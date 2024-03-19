import { IEndpoint } from "@/models/endpoint";

import { decrypt } from "./cryptic";

export async function testConnection(endpoint: Partial<IEndpoint>) {
  const headers = new Headers();
  headers.append("Authorization", endpoint.apiKey || "");
  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
    redirect: "follow"
  };

  try {
    const response = await fetch(endpoint.url || "", requestOptions);
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(
      `Error during testing connection: ${(error as Error).message}`
    );
  }
}

interface getDataFromEndpointProps {
  from: Date;
  to: Date;
  numberOfItems: number;
  aggregationOperation: "$sum" | "$avg" | "$min" | "$max";
  endpoint: Partial<IEndpoint>;
  measurementName: string;
}

export async function getDataFromEndpoint({
  endpoint,
  from,
  to,
  numberOfItems,
  aggregationOperation,
  measurementName
}: getDataFromEndpointProps) {
  const headers = new Headers();
  headers.append("Authorization", decrypt(endpoint.apiKey || ""));
  headers.append("Content-Type", "application/json");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: headers,
    redirect: "follow",
    body: JSON.stringify({
      measurementName,
      from,
      to,
      numberOfItems,
      aggregationOperation
    })
  };
  try {
    const response = await fetch(endpoint.url || "", requestOptions);
    const data = await response.json();
    return data.result;
  } catch (error) {
    throw new Error(
      `Error during testing connection: ${(error as Error).message}`
    );
  }
}

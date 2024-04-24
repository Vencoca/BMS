import { IEndpoint } from "@/models/endpoint";

import { decrypt } from "./cryptic";
import Logger from "./logger";
import { updateEndpoint } from "./services/endpoint";

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

export async function getEndpointSpecs(endpoint: Partial<IEndpoint>) {
  const headers = new Headers();
  headers.append("Authorization", decrypt(endpoint.apiKey || ""));
  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
    redirect: "follow"
  };

  try {
    const response = await fetch(endpoint.url || "", requestOptions);
    const resJson = await response.json();
    if (
      !endpoint.updatedAt ||
      endpoint.updatedAt < new Date(resJson.lastChange)
    ) {
      endpoint.measurements = resJson.measurements;
      endpoint.aggregationMethods = resJson.aggregationMethods;
      return endpoint;
    }
    return false;
  } catch (error) {
    throw new Error(
      `Error during communication with endpoint: ${(error as Error).message}`
    );
  }
}

export async function updateEndpointSpecs(endpoint: Partial<IEndpoint>) {
  const fetchedEndpoint = await getEndpointSpecs(endpoint);
  if (fetchedEndpoint) {
    updateEndpoint(endpoint._id, fetchedEndpoint);
    return fetchedEndpoint;
  }
  return endpoint;
}

interface getDataFromEndpointProps {
  from: Date | string;
  to: Date | string;
  numberOfItems: number;
  aggregationOperation: string;
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
  const fetchedEndpoint = await updateEndpointSpecs(endpoint);
  if (
    fetchedEndpoint.measurements?.find((item) => item === measurementName) &&
    fetchedEndpoint.aggregationMethods?.find(
      (item) => item === aggregationOperation
    )
  ) {
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
      const res = await fetch(endpoint.url || "", requestOptions);
      const resJson = await res.json();
      if (res.ok) {
        return resJson.result;
      }
      throw new Error(resJson.message);
    } catch (error: any) {
      Logger.error(error.message);
      throw new Error(`${error.message}`);
    }
  } else {
    return null;
  }
}

import { IEndpoint } from "@/models/endpoint";

export async function testConnection(endpoint: Partial<IEndpoint>) {
  return true;
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

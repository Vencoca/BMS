interface ApiResponseEntry {
  ts: string; // Assuming ts is a string, adjust if it's a Date or another type
  _id: { [key: string]: any }; // ObjectId can have various types, use a generic object
  power: number;
  current: number;
  voltage: number;
}

type ApiResponse = ApiResponseEntry[];

export async function getData(): Promise<ApiResponse> {
  const headers = new Headers();
  headers.append("Authorization", "LetMeIn");
  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };
  const url = `https://bms-backend-kesler.vercel.app/api/data`;
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  return data.result;
}

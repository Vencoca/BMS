import { NextRequest, NextResponse } from "next/server";

import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { fetchAllEndpointsForUser } from "@/lib/services/endpointUser";
import { getDataFromEndpoint } from "@/lib/workWithEndpoint";

export async function POST(req: NextRequest) {
  try {
    const { user } = await req.json();
    await connectToMongoDB();
    const endpoints = await fetchAllEndpointsForUser(user);
    const data: any[] = [];
    endpoints?.forEach((endpoint) => {
      data.push(
        getDataFromEndpoint({
          endpoint: endpoint,
          from: new Date(Date.now() - 24 * 60 * 60 * 1000),
          to: new Date(),
          numberOfItems: 24,
          aggregationOperation: "$avg",
          measurementName: "smartStripCurrent"
        })
      );
    });
    const resolvedData = await Promise.all(data);
    return NextResponse.json({ data: resolvedData }, { status: 200 });
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

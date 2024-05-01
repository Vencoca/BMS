import { NextRequest, NextResponse } from "next/server";

import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { fetchEndpoint } from "@/lib/services/endpoint";
import { getDataFromEndpoint } from "@/lib/workWithEndpoint";
import { IGraph } from "@/models/graph";

export async function POST(req: NextRequest) {
  try {
    const { graph, from, to }: { graph: IGraph; from: "string"; to: "string" } =
      await req.json();
    connectToMongoDB();
    const endpoint = await fetchEndpoint(graph.endpoint);
    const data = await getDataFromEndpoint({
      endpoint: endpoint,
      // from: "2024-03-17T12:29:24.826Z",
      // to: "2024-03-18T12:29:24.826Z",
      from: new Date(from),
      to: new Date(to),
      numberOfItems: graph.numberOfPoints,
      aggregationOperation: graph.aggregationMethod,
      measurementName: graph.measurement
    });
    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

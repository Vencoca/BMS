import { NextRequest, NextResponse } from "next/server";

import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { createGraph } from "@/lib/services/graph";

export async function POST(req: NextRequest) {
  try {
    const { graph } = await req.json();
    await connectToMongoDB();
    const newGraph = await createGraph(graph);
    return NextResponse.json(
      { message: "Graph created", graph: newGraph },
      { status: 201 }
    );
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

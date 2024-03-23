import { NextRequest, NextResponse } from "next/server";

import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { fetchGraphs } from "@/lib/services/graph";

export async function POST(req: NextRequest) {
  try {
    const { dashboardId } = await req.json();
    await connectToMongoDB();
    const graphs = await fetchGraphs(dashboardId);
    return NextResponse.json({ graphs: graphs }, { status: 200 });
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

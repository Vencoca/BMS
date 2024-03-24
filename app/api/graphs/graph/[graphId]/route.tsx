import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { fetchGraph } from "@/lib/services/graph";

type dashboardProps = {
  params: { graphId: mongoose.Types.ObjectId };
};

export async function POST(req: NextRequest, { params }: dashboardProps) {
  try {
    await connectToMongoDB();
    const newGraph = await fetchGraph(params.graphId);
    return NextResponse.json({ graph: newGraph }, { status: 200 });
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
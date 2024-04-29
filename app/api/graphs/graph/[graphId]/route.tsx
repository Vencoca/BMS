import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { deleteGraph, fetchGraph, updateGraph } from "@/lib/services/graph";

type dashboardProps = {
  params: { graphId: mongoose.Types.ObjectId };
};

export async function GET(req: NextRequest, { params }: dashboardProps) {
  try {
    await connectToMongoDB();
    const newGraph = await fetchGraph(params.graphId);
    return NextResponse.json({ graph: newGraph }, { status: 200 });
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: dashboardProps) {
  try {
    const { graph } = await req.json();
    await connectToMongoDB();
    const newGraph = await updateGraph(params.graphId, graph);
    return NextResponse.json(
      { message: "Graph updated", graph: newGraph },
      { status: 201 }
    );
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: dashboardProps) {
  try {
    await connectToMongoDB();
    await deleteGraph(params.graphId);
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

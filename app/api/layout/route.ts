import { NextRequest, NextResponse } from "next/server";

import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { updateLayout } from "@/lib/services/graph";

export async function POST(req: NextRequest) {
  try {
    const { graphs, layout } = await req.json();
    await connectToMongoDB();
    const newGraph = await updateLayout(layout, graphs);
    return NextResponse.json(
      { message: "Layout updated", graph: newGraph },
      { status: 201 }
    );
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

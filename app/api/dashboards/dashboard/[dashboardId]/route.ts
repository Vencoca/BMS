import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { deleteDashboard } from "@/lib/services/dashboardUser";

type dashboardProps = {
  params: { dashboardId: mongoose.Types.ObjectId };
};

export async function DELETE(req: NextRequest, { params }: dashboardProps) {
  try {
    await connectToMongoDB();
    await deleteDashboard(params.dashboardId);
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

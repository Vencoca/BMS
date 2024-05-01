import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { fetchDashboard, updateDashboard } from "@/lib/services/dashboard";
import { deleteDashboard } from "@/lib/services/dashboardUser";

type dashboardProps = {
  params: { dashboardId: mongoose.Types.ObjectId };
};

export async function GET(req: NextRequest, { params }: dashboardProps) {
  try {
    await connectToMongoDB();
    const dashboard = await fetchDashboard(params.dashboardId);
    return NextResponse.json({ dashboard: dashboard }, { status: 200 });
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: dashboardProps) {
  const { dashboard } = await req.json();
  console.log(dashboard);
  try {
    await connectToMongoDB();
    const updatedDashboard = await updateDashboard(
      params.dashboardId,
      dashboard
    );
    return NextResponse.json({ dashboard: updatedDashboard }, { status: 200 });
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

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

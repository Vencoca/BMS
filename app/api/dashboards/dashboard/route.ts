import { NextRequest, NextResponse } from "next/server";

import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { createDashboardAndPairItWithUser } from "@/lib/services/dashboardUser";

export async function POST(req: NextRequest) {
  try {
    const { user, dashboard } = await req.json();
    await connectToMongoDB();
    const newDashboard = await createDashboardAndPairItWithUser({
      user,
      dashboard
    });
    return NextResponse.json(
      { message: "Dashboard created", dashboard: newDashboard.dashboard },
      { status: 201 }
    );
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

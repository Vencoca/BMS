import { NextRequest, NextResponse } from "next/server";

import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { fetchAllDashboardsForUser } from "@/lib/services/dashboardUser";

export async function POST(req: NextRequest) {
  try {
    const { user } = await req.json();
    await connectToMongoDB();
    const dashboards = await fetchAllDashboardsForUser(user);
    return NextResponse.json({ dashboards: dashboards }, { status: 200 });
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

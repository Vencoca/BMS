import { NextRequest, NextResponse } from "next/server";

import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { fetchAllEndpointsForUser } from "@/lib/services/endpointUser";

export async function POST(req: NextRequest) {
  try {
    const { user } = await req.json();
    await connectToMongoDB();
    const endpoints = await fetchAllEndpointsForUser(user);
    return NextResponse.json({ endpoints: endpoints }, { status: 200 });
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { createEndpointAndPairItWithUser } from "@/lib/services/endpointUser";

export async function POST(req: NextRequest) {
  try {
    const { user, endpoint } = await req.json();
    await connectToMongoDB();
    await createEndpointAndPairItWithUser({ user, endpoint });
    return NextResponse.json({ message: "Endpoint created" }, { status: 201 });
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

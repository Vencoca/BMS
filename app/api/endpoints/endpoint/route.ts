import { NextRequest, NextResponse } from "next/server";

import { decrypt } from "@/lib/cryptic";
import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { createEndpointAndPairItWithUser } from "@/lib/services/endpointUser";

export async function POST(req: NextRequest) {
  try {
    const { user, endpoint } = await req.json();
    await connectToMongoDB();
    const createdEndpoint = await createEndpointAndPairItWithUser({
      user,
      endpoint
    });
    createdEndpoint.endpoint.apiKey = decrypt(createdEndpoint.endpoint.apiKey);
    return NextResponse.json(
      { message: "Endpoint created", endpoint: createdEndpoint.endpoint },
      { status: 201 }
    );
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { encrypt } from "@/lib/cryptic";
import connectToMongoDB from "@/lib/database";
import Logger from "@/lib/logger";
import { updateEndpoint } from "@/lib/services/endpoint";
import { deleteEndpointUser } from "@/lib/services/endpointUser";

type dashboardProps = {
  params: {
    endpointId: mongoose.Types.ObjectId;
  };
};

export async function PUT(req: NextRequest, { params }: dashboardProps) {
  const { endpoint } = await req.json();
  try {
    await connectToMongoDB();
    const key = endpoint.apiKey;
    endpoint.apiKey = encrypt(endpoint.apiKey);
    const updatedEndpoint = await updateEndpoint(params.endpointId, endpoint);
    updatedEndpoint.apiKey = key;
    return NextResponse.json({ endpoint: updatedEndpoint }, { status: 200 });
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: dashboardProps) {
  const { userId } = await req.json();
  try {
    await connectToMongoDB();
    await deleteEndpointUser({ _id: userId }, { _id: params.endpointId });
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    Logger.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

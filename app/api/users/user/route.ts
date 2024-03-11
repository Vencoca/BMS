import { NextRequest, NextResponse } from "next/server";

import connectToMongoDB from "@/lib/database";
import { fetchUserByEmail } from "@/lib/services/user";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  try {
    await connectToMongoDB();
    const user = await fetchUserByEmail(email);
    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: `${error.message}` }, { status: 500 });
  }
}

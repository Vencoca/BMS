import { NextRequest, NextResponse } from "next/server";
import connectToMongoDB from "@/lib/database";
import { createUserWithHashedPassword } from "@/lib/services/user";


export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();
        await connectToMongoDB()
        createUserWithHashedPassword({ name, email, password })
        return NextResponse.json({ message: "User created" }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: "Error occured while creating user" }, { status: 500 })
    }
}
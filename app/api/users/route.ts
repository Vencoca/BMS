import User from "@/models/user";
import { connectMongoDB } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"


export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10)
        await connectMongoDB()
        const user = await User.findOne({ email }).select("_id")

        if (user) {
            return NextResponse.json({ message: "User alredy exists" }, { status: 400 })
        }
        await User.create({ name, email, password: hashedPassword })
        return NextResponse.json({ message: "User created" }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: "Error occured while creating user" }, { status: 500 })
    }
}
import User from "@/models/user";
import { connectMongoDB } from "@/utils/mongodb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface getProps {
    params: { id: mongoose.Types.ObjectId },
}

async function userExists(id: mongoose.Types.ObjectId) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID format");
    }
    await connectMongoDB();
    const user = await User.findById(id);
    if (!user) {
        throw new Error("User doesn't exist");
    }
    return user;
}

export async function GET(req: NextRequest, props: getProps) {
    try {
        const user = await userExists(props.params.id);
        return NextResponse.json({ message: "User exists", user }, { status: 200 });
    } catch (error : any) {
        const errorMessage = error.message || "Internal server error";
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}

export async function POST(req: NextRequest, props: getProps) {
    return NextResponse.json({ message: "You cant create user with specific id use api/users route!" }, { status: 400 })
}

export async function DELETE(req: NextRequest, props: getProps) {
    try {
        const user = await userExists(props.params.id);
        user.remove()
        return NextResponse.json({ message: "User deleted", user }, { status: 200 });       
    } catch (error : any) {
        const errorMessage = error.message || "Internal server error";
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}

export async function PUT(req: NextRequest, props: getProps) {
    try {
        const user = await userExists(props.params.id);
        const { body } = req;
        Object.assign(user, body);
        const updatedUser = await user.save();
        return NextResponse.json({ message: "User updated", updatedUser }, { status: 200 });       
    } catch (error : any) {
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json({ message: "Validation error - you cant update user to this" }, { status: 400 });
        }
        const errorMessage = error.message || "Internal server error";
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}
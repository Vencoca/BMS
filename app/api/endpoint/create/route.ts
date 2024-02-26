import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utils/mongodb";
import Endpoint from "@/models/endpoint";
import EndpointUser from "@/models/endpointUser";

export async function POST(req: NextRequest) {
    try {
        const {email, url, secret} = await req.json();
        await connectMongoDB()
        const user = await User.findOne({email}).select("_id")
        if(!user){
            return NextResponse.json({ message: "User doesnt exist" }, { status: 400 })
        }
        let endpoint = Endpoint.findOne({url}).select("_id")
        if(!endpoint){
           endpoint = await Endpoint.create({url,secret})
        }
        await EndpointUser.create(endpoint, user);
        return NextResponse.json({ message: "Endpoint created" }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: "Error occured while creating endpoint" }, { status: 500 })
    }
}
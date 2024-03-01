import { roles } from "@/utils/roles";
import mongoose, { Schema, models, Document } from "mongoose";
import { IUser } from "./user";
import { IEndpoint } from "./endpoint";

export interface IEndpointUser extends Document {
    user: IUser['_id'];
    endpoint: IEndpoint['_id'];
    role: string;
}

const endpointUserSchema = new Schema<IEndpointUser>({
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    endpoint: { type: mongoose.Types.ObjectId, ref: "Endpoint", required: true },
    role: { type: String, enum: Object.values(roles), required: false },
});

const EndpointUser = models.EndpointUser || mongoose.model<IEndpointUser>("EndpointUser", endpointUserSchema);
export default EndpointUser;
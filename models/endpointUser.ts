import { roles } from "@/utils/roles";
import mongoose, { Schema, models, Document } from "mongoose";
import { IUserSchema } from "./user";
import { IEndpoint } from "./endpoint";

export interface IEndpointUserSchema extends Document {
    user: IUserSchema['_id'];
    endpoint: IEndpoint['_id'];
    role: string;
}

const endpointUserSchema = new Schema<IEndpointUserSchema>({
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    endpoint: { type: mongoose.Types.ObjectId, ref: "Endpoint", required: true },
    role: { type: String, enum: Object.values(roles), required: true },
});

const EndpointUser = models.EndpointUser || mongoose.model<IEndpointUserSchema>("EndpointUser", endpointUserSchema);
export default EndpointUser;
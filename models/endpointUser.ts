import mongoose, { Document, models, Schema } from "mongoose";

import { roles } from "@/lib/roles";

import { IEndpoint } from "./endpoint";
import { IUser } from "./user";

export interface IEndpointUser extends Document {
  user: IUser["_id"];
  endpoint: IEndpoint["_id"];
  role: string;
}

const endpointUserSchema = new Schema<IEndpointUser>({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  endpoint: { type: mongoose.Types.ObjectId, ref: "Endpoint", required: true },
  role: { type: String, enum: Object.values(roles), required: false },
});

const EndpointUser =
  models.EndpointUser ||
  mongoose.model<IEndpointUser>("EndpointUser", endpointUserSchema);
export default EndpointUser;

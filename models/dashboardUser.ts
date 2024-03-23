import mongoose, { Document, models, Schema } from "mongoose";

import { roles } from "@/lib/roles";

import { IDashboard } from "./dashboard";
import { IUser } from "./user";

export interface IDashboardUser extends Document {
  user: IUser["_id"];
  dashboard: IDashboard["_id"];
  role: string;
}

const DasIDashboardUserSchema = new Schema<IDashboardUser>({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  dashboard: {
    type: mongoose.Types.ObjectId,
    ref: "Dashboard",
    required: true
  },
  role: { type: String, enum: Object.values(roles), required: false }
});

const DashboardUser =
  models.DashboardUser ||
  mongoose.model<IDashboardUser>("DashboardUser", DasIDashboardUserSchema);
export default DashboardUser;

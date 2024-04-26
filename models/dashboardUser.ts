import mongoose, { Document, models, Schema } from "mongoose";

import { roles } from "@/lib/roles";

import Dashboard, { IDashboard } from "./dashboard";
import Graph from "./graph";
import { IUser } from "./user";

export interface IDashboardUser extends Document {
  user: IUser["_id"];
  dashboard: IDashboard["_id"];
  role: string;
}

const DashboardUserSchema = new Schema<IDashboardUser>({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  dashboard: {
    type: mongoose.Types.ObjectId,
    ref: "Dashboard",
    required: true
  },
  role: { type: String, enum: Object.values(roles), required: false }
});

DashboardUserSchema.post<IDashboardUser>(
  "findOneAndDelete",
  async function (doc: IDashboardUser, next) {
    await Dashboard.deleteOne({ _id: doc?.dashboard._id });
    await Graph.deleteMany({ dashboard: doc?.dashboard });
    next();
  }
);

const DashboardUser =
  models.DashboardUser ||
  mongoose.model<IDashboardUser>("DashboardUser", DashboardUserSchema);
export default DashboardUser;

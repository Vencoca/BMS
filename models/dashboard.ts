import mongoose, { Document, models, Schema } from "mongoose";

export interface IDashboard extends Document {
  name: string;
  icon: string;
}

const DashboardSchema = new Schema<IDashboard>(
  {
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String
    }
  },
  { timestamps: true }
);

export const Dashboard =
  models.Dashboard || mongoose.model("Dashboard", DashboardSchema);
export default Dashboard;

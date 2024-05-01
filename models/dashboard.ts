import mongoose, { Document, models, Schema } from "mongoose";

export interface IDashboard extends Document {
  name: string;
  icon: string;
  dataOption: string;
  from: Date;
  to: Date;
}

const DashboardSchema = new Schema<IDashboard>(
  {
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String
    },
    dataOption: {
      type: String
    },
    from: {
      type: Date
    },
    to: {
      type: Date
    }
  },
  { timestamps: true }
);

export const Dashboard =
  models.Dashboard || mongoose.model("Dashboard", DashboardSchema);
export default Dashboard;

import mongoose, { Document, models,Schema } from "mongoose";

export interface IEndpoint extends Document {
  url: string;
  apiKey: string;
}

const EndpointSchema = new Schema<IEndpoint>(
  {
    url: {
      type: String,
      unique: true,
      required: true
    },
    apiKey: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const Endpoint =
  models.Endpoint || mongoose.model("Endpoint", EndpointSchema);
export default Endpoint;

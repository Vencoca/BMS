import mongoose, { Document, models, Schema } from "mongoose";

export interface IEndpoint extends Document {
  url: string;
  apiKey: string;
  measurements: string[];
  aggregationMethods: string[];
  updatedAt?: Date;
}

const EndpointSchema = new Schema<IEndpoint>(
  {
    url: {
      type: String,
      required: true
    },
    apiKey: {
      type: String,
      required: true
    },
    measurements: {
      type: [String],
      required: true
    },
    aggregationMethods: {
      type: [String],
      required: true
    }
  },
  { timestamps: true }
);

export const Endpoint =
  models.Endpoint || mongoose.model("Endpoint", EndpointSchema);
export default Endpoint;

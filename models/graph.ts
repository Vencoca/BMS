import mongoose, { models, Schema } from "mongoose";

import { IDashboard } from "./dashboard";
import { IEndpoint } from "./endpoint";

export interface IGraph {
  _id: any;
  endpoint: IEndpoint["_id"];
  dashboard: IDashboard["_id"];
  numberOfPoints: number;
  measurement: string;
  aggregationMethod: string;
  name: string;
  yAxis: string;
  xAxis: string;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

const GraphSchema = new Schema<IGraph>(
  {
    endpoint: {
      type: mongoose.Types.ObjectId,
      ref: "Endpoint",
      required: true
    },
    dashboard: {
      type: mongoose.Types.ObjectId,
      ref: "Dashboard",
      required: true
    },
    numberOfPoints: {
      type: Number,
      required: true
    },
    measurement: {
      type: String,
      required: true
    },
    aggregationMethod: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    xAxis: {
      type: String
    },
    yAxis: {
      type: String
    },
    layout: {
      x: {
        type: Number
      },
      y: {
        type: Number
      },
      h: {
        type: Number
      },
      w: {
        type: Number
      }
    }
  },
  { timestamps: true }
);

export const Graph = models.Graph || mongoose.model("Graph", GraphSchema);
export default Graph;

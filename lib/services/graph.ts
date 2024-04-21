import mongoose from "mongoose";
import { Layout } from "react-grid-layout";

import Graph, { IGraph } from "@/models/graph";

export async function fetchGraphs(
  dashboardId: mongoose.Types.ObjectId
): Promise<IGraph[]> {
  try {
    return await Graph.find({ dashboard: dashboardId });
  } catch (error) {
    throw new Error(`Error fetching graphs: ${(error as Error).message}`);
  }
}

export async function fetchGraph(id: mongoose.Types.ObjectId): Promise<IGraph> {
  try {
    const graph = await Graph.findById(id);
    if (!graph) {
      throw new Error("Graph not found");
    }
    return graph;
  } catch (error) {
    throw new Error(`Error fetching graph: ${(error as Error).message}`);
  }
}

export async function createGraph(graph: Partial<IGraph>): Promise<IGraph> {
  try {
    const newGraph = new Graph(graph);
    return await newGraph.save();
  } catch (error) {
    throw new Error(`Error creating graph: ${(error as Error).message}`);
  }
}

export async function updateLayout(
  layout: Layout[],
  graphs: Partial<IGraph>[]
) {
  if (layout.length !== graphs.length) {
    throw new Error(`Error - not matching lengths of layout and graphs`);
  }
  try {
    const promises: any[] = [];
    for (let i = 0; i < graphs.length; i++) {
      graphs[i].layout = {
        x: layout[i].x,
        y: layout[i].y,
        w: layout[i].w,
        h: layout[i].h
      };
      promises.push(updateGraph(graphs[i]._id, graphs[i]));
    }
    await Promise.all(promises);
    return true;
  } catch (error) {
    throw new Error(`Error updating layout: ${(error as Error).message}`);
  }
}

export async function updateGraph(
  id: mongoose.Types.ObjectId,
  updates: Partial<IGraph>
): Promise<IGraph> {
  try {
    const graph = await Graph.findByIdAndUpdate(id, updates, {
      new: true
    }).exec();
    if (!graph) {
      throw new Error("Graph not found");
    }
    return graph;
  } catch (error) {
    throw new Error(`Error updating graph: ${(error as Error).message}`);
  }
}

export async function deleteGraph(
  id: mongoose.Types.ObjectId
): Promise<IGraph> {
  try {
    const graph = await Graph.findByIdAndDelete(id, {
      new: true
    }).exec();
    if (!graph) {
      throw new Error("Graph not found");
    }
    return graph;
  } catch (error) {
    throw new Error(`Error deleting graph: ${(error as Error).message}`);
  }
}

import mongoose from "mongoose";

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

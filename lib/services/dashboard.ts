import mongoose from "mongoose";

import Dashboard, { IDashboard } from "@/models/dashboard";

export async function fetchDashboards(): Promise<IDashboard[]> {
  try {
    return await Dashboard.find({});
  } catch (error) {
    throw new Error(`Error fetching dashboards: ${(error as Error).message}`);
  }
}

export async function fetchDashboard(
  id: mongoose.Types.ObjectId
): Promise<IDashboard> {
  try {
    const dashboard = await Dashboard.findById(id);
    if (!dashboard) {
      throw new Error("Dashboard not found");
    }
    return dashboard;
  } catch (error) {
    throw new Error(`Error fetching dashboard: ${(error as Error).message}`);
  }
}

export async function createDashboard(
  dashboard: Partial<IDashboard>
): Promise<IDashboard> {
  try {
    const newDashboard = new Dashboard(dashboard);
    return await newDashboard.save();
  } catch (error) {
    throw new Error(`Error creating dashboard: ${(error as Error).message}`);
  }
}

export async function updateDashboard(
  id: mongoose.Types.ObjectId,
  updates: Partial<IDashboard>
): Promise<IDashboard> {
  try {
    const dashboard = await Dashboard.findByIdAndUpdate(id, updates, {
      new: true
    }).exec();
    if (!dashboard) {
      throw new Error("Dashboard not found");
    }
    return dashboard;
  } catch (error) {
    throw new Error(`Error updating dashboard: ${(error as Error).message}`);
  }
}



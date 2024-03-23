import { IDashboard } from "@/models/dashboard";
import DashboardUser, { IDashboardUser } from "@/models/dashboardUser";
import { IUser } from "@/models/user";

import { createDashboard } from "./dashboard";

export async function fetchAllDashboardsForUser(
  user: IUser
): Promise<IDashboard[] | null> {
  try {
    const dashboardUsers = await DashboardUser.find({
      user: user._id
    }).populate("dashboard");
    const dashboards = dashboardUsers.map(
      (dashboardUser) => dashboardUser.dashboard
    );
    return dashboards;
  } catch (error) {
    throw new Error(
      `Error fetching dashboards for user: ${(error as Error).message}`
    );
  }
}

export async function createDashboardUser({
  user,
  dashboard
}: Partial<IDashboardUser>): Promise<IDashboardUser> {
  try {
    const dashboardUser = new DashboardUser({ user, dashboard });
    return await dashboardUser.save();
  } catch (error) {
    throw new Error(
      `Error creating dashboardUser: ${(error as Error).message}`
    );
  }
}

export async function createDashboardAndPairItWithUser({
  user,
  dashboard
}: Partial<IDashboardUser>) {
  try {
    const createdDashboard = await createDashboard(dashboard);
    const createdDashboardUser = await createDashboardUser({
      user,
      dashboard: createdDashboard
    });
    return createdDashboardUser;
  } catch (error) {
    throw new Error(`Error creating dashboard for user`);
  }
}

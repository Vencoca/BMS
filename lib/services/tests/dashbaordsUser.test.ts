import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongoose } from "mongoose";

import DashboardUser from "@/models/dashboardUser";
import { IUser } from "@/models/user";

import {
  createDashboardAndPairItWithUser,
  createDashboardUser,
  deleteDashboard,
  fetchAllDashboardsForUser,
  fetchDashboardUsers
} from "../dashboardUser";
import seedDB from "./seedDB";

describe("DashboardUser methods tests", () => {
  let mongoose: Mongoose;
  let mongodb: MongoMemoryServer;
  let testData: Map<string, any>;

  beforeAll(async () => {
    [mongodb, mongoose, testData] = await seedDB();
  });

  afterAll(async () => {
    mongodb.stop();
    await mongoose?.connection.close();
  });

  describe("fetchDashboards", () => {
    test("Error", async () => {
      jest.spyOn(DashboardUser, "find").mockImplementationOnce(() => {
        throw new Error("MongoDB connection error");
      });
      await expect(fetchDashboardUsers()).rejects.toThrow(
        "Error fetching dashboard users: MongoDB connection error"
      );
    });
  });
  describe("fetchAllDashboardsForUser", () => {
    test("Correct fetch", async () => {
      const dashboard = await fetchAllDashboardsForUser(
        testData.get("users")[0]
      );
      expect(dashboard).toHaveLength(2);
    });
    test("Error when fetching", async () => {
      jest.spyOn(DashboardUser, "find").mockImplementationOnce(() => {
        throw new Error("MongoDB connection error");
      });
      await expect(fetchAllDashboardsForUser({} as IUser)).rejects.toThrow(
        "Error fetching dashboards for user: MongoDB connection error"
      );
    });
  });
  describe("createDashboardUser", () => {
    test("Error when creating", async () => {
      await expect(createDashboardUser({})).rejects.toThrow(
        "Error creating dashboardUser: DashboardUser validation failed: user: Path `user` is required., dashboard: Path `dashboard` is required."
      );
    });
  });
  describe("createDashboardAndPairItWithUser", () => {
    test("Correct creation", async () => {
      const createdDashboardUser = await createDashboardAndPairItWithUser({
        user: testData.get("users")[0],
        dashboard: { name: "Nice name" }
      });
      expect(createdDashboardUser).toBeDefined();
    });
    test("Error", async () => {
      await expect(createDashboardAndPairItWithUser({})).rejects.toThrow(
        "Error creating dashboard for user"
      );
    });
  });
  describe("deleteDashboard", () => {
    test("Correct delete", async () => {
      const dashboardToDelete = testData.get("dashboards")[0];
      const deletedDashboard = await deleteDashboard(dashboardToDelete);
      expect(deletedDashboard.dashboard._id).toEqual(dashboardToDelete._id);
    });
    test("Bad ID", async () => {
      const nonExistingDashboardId = new mongoose.Types.ObjectId();
      await expect(deleteDashboard(nonExistingDashboardId)).rejects.toThrow(
        "Error deleting dashboard: Dashboard not found"
      );
    });
  });
});

import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongoose } from "mongoose";

import Dashboard from "@/models/dashboard";

import {
  createDashboard,
  fetchDashboard,
  fetchDashboards,
  updateDashboard
} from "../dashboard";
import seedDB from "./seedDB";

describe("Dashboard methods tests", () => {
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
      jest.spyOn(Dashboard, "find").mockImplementationOnce(() => {
        throw new Error("MongoDB connection error");
      });
      await expect(fetchDashboards()).rejects.toThrow(
        "Error fetching dashboards: MongoDB connection error"
      );
    });
  });

  describe("fetchDashboard", () => {
    test("Fetch existing dashboard", async () => {
      const existingDashboardId = testData.get("dashboards")[0]._id;
      expect(existingDashboardId).toBeDefined();

      const fetchedDashboard = await fetchDashboard(existingDashboardId);

      expect(fetchedDashboard).toBeDefined();
      expect(fetchedDashboard._id).toStrictEqual(existingDashboardId);
    });

    test("Error fetching nonexisting endpoint by ID", async () => {
      const nonExistingDashboardId = new mongoose.Types.ObjectId();

      await expect(fetchDashboard(nonExistingDashboardId)).rejects.toThrow(
        "Dashboard not found"
      );
    });
  });

  describe("createDashboard", () => {
    test("Error creating dashboard", async () => {
      await expect(createDashboard({})).rejects.toThrow(
        "Error creating dashboard: Dashboard validation failed: name: Path `name` is required."
      );
    });
  });

  describe("udpateDashboard", () => {
    test("Correct update", async () => {
      const dataToUpdate = testData.get("dashboards")[0];
      const newName = "New name";
      const updatedData = await updateDashboard(dataToUpdate._id, {
        name: newName
      });
      expect(updatedData.name).toEqual(newName);
    });
    test("Bad id", async () => {
      const nonExistingId = new mongoose.Types.ObjectId();
      await expect(updateDashboard(nonExistingId, {})).rejects.toThrow(
        "Error updating dashboard: Dashboard not found"
      );
    });
  });
});

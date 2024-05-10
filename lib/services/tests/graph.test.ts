import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongoose } from "mongoose";

import Graph from "@/models/graph";

import {
  createGraph,
  deleteGraph,
  fetchGraph,
  fetchGraphs,
  updateGraph,
  updateLayout
} from "../graph";
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

  describe("fetchGraphs", () => {
    test("Error", async () => {
      jest.spyOn(Graph, "find").mockImplementationOnce(() => {
        throw new Error("MongoDB connection error");
      });
      await expect(
        fetchGraphs(testData.get("dashboards")[0]._id)
      ).rejects.toThrow("Error fetching graphs: MongoDB connection error");
    });
  });
  describe("fetchGraph", () => {
    test("correct fetch", async () => {
      const graph = await fetchGraph(testData.get("graphs")[0]._id);
      expect(graph).toBeDefined();
    });
    test("bad ID", async () => {
      const nonExistingId = new mongoose.Types.ObjectId();
      await expect(fetchGraph(nonExistingId)).rejects.toThrow(
        "Error fetching graph: Graph not found"
      );
    });
  });
  describe("createGraph", () => {
    test("Error", async () => {
      await expect(createGraph({})).rejects.toThrow(
        "Error creating graph: Graph validation failed: aggregationMethod: Path `aggregationMethod` is required., measurement: Path `measurement` is required., numberOfPoints: Path `numberOfPoints` is required., dashboard: Path `dashboard` is required., endpoint: Path `endpoint` is required."
      );
    });
  });
  describe("updateLayout", () => {
    test("correctUpdate", async () => {
      const returnedValue = await updateLayout(
        [
          {
            x: 1,
            y: 1,
            w: 1,
            h: 1,
            i: ""
          }
        ],
        [testData.get("graphs")[0]]
      );
      expect(returnedValue).toBeTruthy();
    });
    test("Bad length", async () => {
      await expect(updateLayout([], [{}])).rejects.toThrow(
        "Error - not matching lengths of layout and graphs"
      );
    });
    test("Error", async () => {
      jest.spyOn(Graph, "findByIdAndUpdate").mockImplementationOnce(() => {
        throw new Error("MongoDB connection error");
      });
      await expect(
        updateLayout(
          [
            {
              x: 1,
              y: 1,
              w: 1,
              h: 1,
              i: ""
            }
          ],
          [testData.get("graphs")[0]]
        )
      ).rejects.toThrow(
        "Error updating layout: Error updating graph: MongoDB connection error"
      );
    });
  });
  describe("updateGraph", () => {
    test("bad ID", async () => {
      const nonExistingId = new mongoose.Types.ObjectId();
      await expect(updateGraph(nonExistingId, {})).rejects.toThrow(
        "Error updating graph: Graph not found"
      );
    });
  });
  describe("deleteGraph", () => {
    test("Correct delete", async () => {
      const graphToDelete = testData.get("graphs")[0];
      const deletedGraph = await deleteGraph(graphToDelete);
      expect(deletedGraph._id).toEqual(graphToDelete._id);
    });
    test("Bad ID", async () => {
      const nonExistingDashboardId = new mongoose.Types.ObjectId();
      await expect(deleteGraph(nonExistingDashboardId)).rejects.toThrow(
        "Error deleting graph: Graph not found"
      );
    });
  });
});

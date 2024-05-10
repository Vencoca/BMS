import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { IEndpoint } from "@/models/endpoint";
import EndpointUser from "@/models/endpointUser";
import { IUser } from "@/models/user";

import * as workWithEndpointHelper from "../../workWithEndpoint";
import { fetchEndpoint } from "../endpoint";
import {
  createEndpointAndPairItWithUser,
  createEndpointUser,
  deleteEndpointUser,
  fetchAllEndpointsForUser,
  fetchAllUsersForEndpoint,
  fetchEndpointUsers
} from "../endpointUser";
import seedDB from "./seedDB";

jest.mock("../../workWithEndpoint", () => {
  return {
    __esModule: true,
    ...jest.requireActual("../../workWithEndpoint")
  };
});

describe("EndpointUser methods tests", () => {
  let mongodb: MongoMemoryServer;
  let mongooseConnection: mongoose.Mongoose | undefined;
  let testData: Map<string, any>;
  beforeAll(async () => {
    [mongodb, mongooseConnection, testData] = await seedDB();
  });

  afterAll(async () => {
    mongodb.stop();
    await mongooseConnection?.connection.close();
  });

  describe("fetchEndpointUsers", () => {
    test("Fetch all endpoint users", async () => {
      const endpointUsers = await fetchEndpointUsers();
      expect(endpointUsers).toHaveLength(testData.get("endpointUsers").length);
    });

    test("Error fetching endpoint users", async () => {
      jest.spyOn(EndpointUser, "find").mockImplementationOnce(() => {
        throw new Error("MongoDB connection error");
      });

      await expect(fetchEndpointUsers()).rejects.toThrow(
        "Error fetching endpoint users: MongoDB connection error"
      );
    });
  });

  describe("fetchAllEndpointsForUser", () => {
    test("Fetch all endpoints for a user", async () => {
      const user = testData.get("users")[0] as IUser;
      const endpoints = await fetchAllEndpointsForUser(user);
      expect(endpoints).toBeDefined();
      expect(endpoints).toHaveLength(testData.get("endpoints").length);
    });

    test("Error fetching endpoints for user", async () => {
      const user = testData.get("users")[0] as IUser;
      jest.spyOn(EndpointUser, "find").mockImplementationOnce(() => {
        throw new Error("MongoDB connection error");
      });
      await expect(fetchAllEndpointsForUser(user)).rejects.toThrow(
        "Error fetching endpoints for user: MongoDB connection error"
      );
    });
  });

  describe("fetchAllUsersForEndpoint", () => {
    test("Fetch all users for an endpoint", async () => {
      const endpoint = testData.get("endpoints")[0] as IEndpoint;
      const users = await fetchAllUsersForEndpoint(endpoint);
      expect(users).toBeDefined();
      expect(users).toHaveLength(testData.get("users").length);
    });

    test("Error fetching users for endpoint", async () => {
      const endpoint = testData.get("endpoints")[0] as IEndpoint;

      jest.spyOn(EndpointUser, "find").mockImplementationOnce(() => {
        throw new Error("MongoDB connection error");
      });

      await expect(fetchAllUsersForEndpoint(endpoint)).rejects.toThrow(
        "Error fetching users for endpoint: MongoDB connection error"
      );
    });
  });

  describe("createEndpointUser", () => {
    test("Create endpoint user", async () => {
      const user = testData.get("users")[0] as IUser;
      const endpoint = testData.get("endpoints")[0] as IEndpoint;

      const createdEndpointUser = await createEndpointUser({ user, endpoint });

      expect(createdEndpointUser).toBeDefined();
      expect(createdEndpointUser.user._id?.toString()).toBe(
        user._id?.toString()
      );
      expect(createdEndpointUser.endpoint._id?.toString()).toBe(
        endpoint._id?.toString()
      );
    });

    test("Error creating endpoint user", async () => {
      const invalidEndpointUser = {
        // Missing required fields
      };

      await expect(createEndpointUser(invalidEndpointUser)).rejects.toThrow(
        "Error creating endpointUser"
      );
    });
  });

  describe("createEndpointAndPairItWithUser", () => {
    test("Create endpoint and pair it with a user", async () => {
      const user = testData.get("users")[0] as IUser;
      const endpoint = {
        url: "https://api.example.com/endpoint4",
        apiKey: "s3cr3t4",
        name: "test"
      } as IEndpoint;
      const spy = jest.spyOn(workWithEndpointHelper, "getEndpointSpecs");
      const mockedReturnValue = Promise.resolve(endpoint);
      spy.mockReturnValue(mockedReturnValue);

      const createdEndpointUser = await createEndpointAndPairItWithUser({
        user,
        endpoint
      });

      expect(createdEndpointUser).toBeDefined();
      expect(createdEndpointUser.user._id?.toString()).toBe(
        user._id?.toString()
      );
      spy.mockRestore();
    });

    test("Test no endpoint", async () => {
      const user = testData.get("users")[0] as IUser;
      const endpoint = {
        url: "https://api.example.com/endpoint4",
        apiKey: "s3cr3t4",
        name: "test"
      } as IEndpoint;
      const spy = jest.spyOn(workWithEndpointHelper, "getEndpointSpecs");
      const mockedReturnValue = Promise.resolve(false) as any;
      spy.mockReturnValue(mockedReturnValue);

      await expect(
        createEndpointAndPairItWithUser({
          user,
          endpoint
        })
      ).rejects.toThrow("Error creating endpoint for user");

      spy.mockRestore();
    });

    test("Error creating endpoint for user", async () => {
      const user = {
        // Missing required fields
      };

      await expect(createEndpointAndPairItWithUser({ user })).rejects.toThrow(
        "Error creating endpoint for user"
      );
    });
  });

  describe("deleteEndpointUser", () => {
    test("Delete existing endpoint user", async () => {
      const user = testData.get("users")[0] as IUser;
      const endpoint = testData.get("endpoints")[0] as IEndpoint;

      const deletedEndpointUser = await deleteEndpointUser(user, endpoint);
      expect(deletedEndpointUser).toBeDefined();
      expect(deletedEndpointUser.user).toStrictEqual(user._id);
      expect(deletedEndpointUser.endpoint).toStrictEqual(endpoint._id);
    });

    test("Error deleting nonexisting endpoint user", async () => {
      const nonExistingUser = { _id: new mongoose.Types.ObjectId() } as IUser;
      const nonExistingEndpoint = {
        _id: new mongoose.Types.ObjectId()
      } as IEndpoint;

      await expect(
        deleteEndpointUser(nonExistingUser, nonExistingEndpoint)
      ).rejects.toThrow("Error deleting endpoint user: userEndpoint not found");
    });
    test("Delete endpoint when the last EndpointUser is deleted", async () => {
      const endpoint = testData.get("endpoints")[0] as IEndpoint;
      expect(fetchEndpoint(endpoint._id)).toBeDefined();
      const users = await fetchAllUsersForEndpoint(endpoint);
      expect(users).toBeDefined();
      for (let i = 0; i < users!.length; i++) {
        await deleteEndpointUser(users![i], endpoint);
      }
      await expect(fetchEndpoint(endpoint._id)).rejects.toThrow(
        "Endpoint not found"
      );
    });
  });
});

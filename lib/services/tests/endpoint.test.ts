import endpointsMock from "../mocks/endpoints.json";
import { createEndpoint, deleteEndpoint, fetchEndpoint, fetchEndpoints, updateEndpoint } from "../endpoint";
import { Mongoose } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import seedDB from "./seedDB";
import Endpoint from "@/models/endpoint"; 

describe("Endpoints methods tests", () => {
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

    describe("fetchEndpoints", () => {
        test("fetchEndpoints (seeding)", async () => {
            let endpoints = await fetchEndpoints();
            expect(endpoints).toHaveLength(endpointsMock.length);
            expect(testData.get("endpoints")).toHaveLength(endpointsMock.length);
        });

        test("Error fetching endpoints", async () => {
            jest.spyOn(Endpoint, 'find').mockImplementationOnce(() => {
                throw new Error("MongoDB connection error");
            });
            await expect(fetchEndpoints()).rejects.toThrow("Error fetching endpoints: MongoDB connection error");
        });
    });

    describe("fetchEndpoint", () => {
        test("Fetch existing endpoint by ID", async () => {
            const existingEndpointId = testData.get("endpoints")[0]._id;
            expect(existingEndpointId).toBeDefined();

            const fetchedEndpoint = await fetchEndpoint(existingEndpointId);

            expect(fetchedEndpoint).toBeDefined();
            expect(fetchedEndpoint._id).toStrictEqual(existingEndpointId);
        });

        test("Error fetching nonexisting endpoint by ID", async () => {
            const nonExistingEndpointId = new mongoose.Types.ObjectId();

            await expect(fetchEndpoint(nonExistingEndpointId)).rejects.toThrow(
                "Endpoint not found"
            );
        });
    });

    describe("createEndpoint", () => {
        test("Create endpoint", async () => {
            const newEndpoint = {
                url: "https://newendpoint.com",
                secret: "newsecret123",
            };

            const createdEndpoint = await createEndpoint(newEndpoint);

            expect(createdEndpoint).toBeDefined();
            expect(createdEndpoint.url).toBe(newEndpoint.url);
            expect(createdEndpoint.secret).toBe(newEndpoint.secret);
        });

        test("Error creating endpoint (incomplete data)", async () => {
            const invalidEndpoint = {
                url: "https://invalidendpoint.com",
            };

            await expect(createEndpoint(invalidEndpoint)).rejects.toThrow(
                "Error creating endpoint: Endpoint validation failed: secret: Path `secret` is required."
            );
        });
    });

    describe("updateEndpoint", () => {
        test("Update existing endpoint", async () => {
            const existingEndpointId = testData.get("endpoints")[0]._id;
            expect(existingEndpointId).toBeDefined();
            const updates = { url: "https://updatedendpoint.com" };

            const updatedEndpoint = await updateEndpoint(
                existingEndpointId,
                updates
            );

            expect(updatedEndpoint).toBeDefined();
            expect(updatedEndpoint.url).toBe(updates.url);
        });

        test("Error updating nonexisting endpoint", async () => {
            const nonExistingEndpointId = new mongoose.Types.ObjectId();
            const updates = { url: "https://updatednonexistingendpoint.com" };

            await expect(
                updateEndpoint(nonExistingEndpointId, updates)
            ).rejects.toThrow("Endpoint not found");
        });
    });

    describe("deleteEndpoint", () => {
        test("Delete existing endpoint", async () => {
            const existingEndpointId = testData.get("endpoints")[0]._id;
            expect(existingEndpointId).toBeDefined();
            const deletedEndpoint = await deleteEndpoint(existingEndpointId);

            expect(deletedEndpoint).toBeDefined();
            expect(deletedEndpoint._id).toStrictEqual(existingEndpointId);
        });

        test("Error deleting nonexisting endpoint", async () => {
            const nonExistingEndpointId = new mongoose.Types.ObjectId();
            await expect(deleteEndpoint(nonExistingEndpointId)).rejects.toThrow(
                "Endpoint not found"
            );
        });
    });
});

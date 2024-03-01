import { Mongoose } from "mongoose";
import endpointMock from "../mocks/endpoints.json";
import { fetchEndpoints } from "../endpoint";
import seedDB from "./seedDB";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("Endpoint Test", () => {
    let mongoose: Mongoose;
    let mongodb: MongoMemoryServer;
    let testData: Map<string, any>;

    beforeAll(async () => {
        [mongodb, mongoose, testData] = await seedDB()
    });

    afterAll(async () => {
        mongodb.stop()
        await mongoose?.connection.close();
    });

    test("createEndpoints test (seeding)", async () => {
        let test = await fetchEndpoints();
        expect(test).toHaveLength(endpointMock.length);
        expect(testData.get("endpoints")).toHaveLength(endpointMock.length);
    });
});
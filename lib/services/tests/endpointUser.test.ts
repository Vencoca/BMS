import { Mongoose } from "mongoose";
import endpointMock from "../mocks/endpoints.json";
import seedDB from "./seedDB";
import { MongoMemoryServer } from "mongodb-memory-server";
import { fetchEndpointUsers } from "../endpointUser";

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

    test("createEndpointUsers test (seeding)", async () => {
        let test = await fetchEndpointUsers();
        expect(test).toHaveLength(3);
        expect(testData.get("endpointUsers")).toHaveLength(3);
    });
});
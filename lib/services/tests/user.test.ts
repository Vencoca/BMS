import usersMock from "../mocks/users.json";
import { fetchUsers } from "../user";
import { Mongoose } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import seedDB from "./seedDB";

describe("Users Test", () => {
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

    test("createUsers test (seeding)", async () => {
        let test = await fetchUsers();
        expect(test).toHaveLength(usersMock.length);
        expect(testData.get("users")).toHaveLength(usersMock.length);
    });
});
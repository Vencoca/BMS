import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongoose } from "mongoose";

import connectToMongoDB from "@/lib/database";

import { createEndpoint, fetchEndpoints } from "../endpoint";
import { createEndpointUser, fetchEndpointUsers } from "../endpointUser";
import endpointMocks from "../mocks/endpoints.json";
import userMocks from "../mocks/users.json";
import { createUser, fetchUsers } from "../user";

export default async function seedDB(): Promise<
  [MongoMemoryServer, Mongoose, Map<string, any>]
> {
  const [mongodb, mongoose] = await prepare();

  await Promise.all([seedEndpoints(), seedUsers()]);
  const [endpoints, users] = await Promise.all([
    fetchEndpoints(),
    fetchUsers(),
  ]);

  await seedEndpointUsers(endpoints, users);
  const [endpointUsers] = await Promise.all([fetchEndpointUsers()]);

  const testData = new Map<string, any>();
  testData.set("endpoints", endpoints);
  testData.set("users", users);
  testData.set("endpointUsers", endpointUsers);
  return [mongodb, mongoose, testData];
}

async function prepare(): Promise<[MongoMemoryServer, Mongoose]> {
  const mongodb = new MongoMemoryServer();
  await mongodb.start();
  process.env.MONGODB_URI = mongodb.getUri();
  process.env.ENCRYPTION_KEY = "topSecret";
  mongoose = await connectToMongoDB();
  return [mongodb, mongoose];
}

async function seedEndpoints() {
  const endpointPromises = endpointMocks.map((endpoint) =>
    createEndpoint(endpoint),
  );
  await Promise.all(endpointPromises);
}

async function seedUsers() {
  const userPromises = userMocks.map((user) => createUser(user));
  await Promise.all(userPromises);
}

async function seedEndpointUsers(endpoints: any[], users: any[]) {
  const endpointUserPromises = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    for (let j = 0; j < endpoints.length; j++) {
      const endpoint = endpoints[j];

      const endpointUserData = {
        user: user._id,
        endpoint: endpoint._id,
        role: "user",
      };
      endpointUserPromises.push(createEndpointUser(endpointUserData));
    }
  }

  await Promise.all(endpointUserPromises);
}

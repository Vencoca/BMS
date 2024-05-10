import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongoose } from "mongoose";

import connectToMongoDB from "@/lib/database";

import { createDashboard, fetchDashboards } from "../dashboard";
import { createDashboardUser, fetchDashboardUsers } from "../dashboardUser";
import { createEndpoint, fetchEndpoints } from "../endpoint";
import { createEndpointUser, fetchEndpointUsers } from "../endpointUser";
import { createGraph, fetchGraphs } from "../graph";
import dashboardMocks from "../mocks/dashboards.json";
import endpointMocks from "../mocks/endpoints.json";
import graphMocks from "../mocks/graphs.json";
import userMocks from "../mocks/users.json";
import { createUser, fetchUsers } from "../user";

export default async function seedDB(): Promise<
  [MongoMemoryServer, Mongoose, Map<string, any>]
> {
  const [mongodb, mongoose] = await prepare();

  await Promise.all([seedEndpoints(), seedUsers(), seedDashboards()]);
  const [endpoints, users, dashboards] = await Promise.all([
    fetchEndpoints(),
    fetchUsers(),
    fetchDashboards()
  ]);

  await seedEndpointUsers(endpoints, users);
  const [endpointUsers] = await Promise.all([fetchEndpointUsers()]);

  await seedDashboardUsers(dashboards, users);
  const [dashboardUsers] = await Promise.all([fetchDashboardUsers()]);

  await seedGraphs(dashboards, endpoints[0]);
  const graphs = await fetchGraphs(dashboards[0]._id);

  const testData = new Map<string, any>();
  testData.set("endpoints", endpoints);
  testData.set("users", users);
  testData.set("endpointUsers", endpointUsers);
  testData.set("dashboardUsers", dashboardUsers);
  testData.set("dashboards", dashboards);
  testData.set("graphs", graphs);
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
    createEndpoint(endpoint)
  );
  await Promise.all(endpointPromises);
}

async function seedUsers() {
  const userPromises = userMocks.map((user) => createUser(user));
  await Promise.all(userPromises);
}

async function seedDashboards() {
  const dashboardPromises = dashboardMocks.map((dashboard) =>
    createDashboard(dashboard as any)
  );
  await Promise.all(dashboardPromises);
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
        role: "user"
      };
      endpointUserPromises.push(createEndpointUser(endpointUserData));
    }
  }

  await Promise.all(endpointUserPromises);
}

async function seedGraphs(dashboards: any[], endpoint: any) {
  const graphsPromises: any[] = [];
  for (let i = 0; i < dashboards.length; i++) {
    const dashboard = dashboards[i];
    graphMocks.forEach((graph) => {
      const graphData = {
        dashboard: dashboard._id,
        endpoint: endpoint._id,
        ...graph
      };
      graphsPromises.push(createGraph(graphData));
    });
  }

  await Promise.all(graphsPromises);
}

async function seedDashboardUsers(dashboards: any[], users: any[]) {
  const dashboardUserPromises = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    for (let j = 0; j < dashboards.length; j++) {
      const dashboard = dashboards[j];

      const dashboardUserData = {
        user: user._id,
        dashboard: dashboard._id
      };
      dashboardUserPromises.push(createDashboardUser(dashboardUserData));
    }
  }

  await Promise.all(dashboardUserPromises);
}

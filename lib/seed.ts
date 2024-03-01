import { Mongoose } from "mongoose";
import endpointMocks from "./services/mocks/endpoints.json";
import userMocks from "./services/mocks/users.json";
import { createEndpoint, fetchEndpoints } from "./services/endpoint";
import { createUser, fetchUsers } from "./services/user";
import { createEndpointUser, fetchEndpointUsers } from "./services/endpointUser";

export enum SeedStatus {
    initial = "initial",
    started = "started",
    completed = "completed",
}

export class Seed {
    client: Mongoose;
    private testData = new Map<string, any>();
    status = SeedStatus.initial;

    constructor(client: Mongoose) {
        this.client = client;
    }

    async seedData() {
        console.log("tak si jajo?")
        if (this.status === SeedStatus.initial) {
            this.status = SeedStatus.started;

            await Promise.all([this.seedEndpoints(), this.seedUsers()]);
            const [endpoints, users] = await Promise.all([fetchEndpoints(), fetchUsers()]);

            await Promise.all([this.seedEndpointUsers(endpoints, users)])
            const [endpointUsers] = await Promise.all([fetchEndpointUsers(),])

            this.testData.set("endpoints", endpoints);
            this.testData.set("users", users);
            this.testData.set("endpointUsers", endpointUsers)

            this.status = SeedStatus.completed;
        }
    }

    getTestData(key?: string) {
        return (
            (this.testData.get(key as any) as Record<string, any>) ||
            (this.testData as Map<string, any>)
        );
    }

    private async seedEndpoints() {
        const orgsPromises = endpointMocks.map((endpoint) => createEndpoint(endpoint));
        await Promise.all(orgsPromises);
    }

    private async seedUsers() {
        const userPromises = userMocks.map((user) => createUser(user));
        await Promise.all(userPromises);
    }

    private async seedEndpointUsers(endpoints: any[], users: any[]) {
        const endpointUserPromises = [];
        for (let i = users.length - 1; i >= 0; i--) {
            const user = users[i];
            const numberOfEndpoints = Math.min(i, endpoints.length);
            for (let j = 0; j < numberOfEndpoints; j++) {
                const endpoint = endpoints[j];
                const endpointUserData = {
                    user: user._id, 
                    endpoint: endpoint._id,
                    role: 'user',
                };
                endpointUserPromises.push(createEndpointUser(endpointUserData));
            }
        }
        await Promise.all(endpointUserPromises);
    }
}
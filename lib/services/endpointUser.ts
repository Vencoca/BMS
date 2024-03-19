import { IEndpoint } from "@/models/endpoint";
import EndpointUser, { IEndpointUser } from "@/models/endpointUser";
import { IUser } from "@/models/user";

import { createEndpoint, deleteEndpoint, fetchEndpointByUrl } from "./endpoint";

export async function fetchEndpointUsers(): Promise<IEndpointUser[]> {
  try {
    return await EndpointUser.find({});
  } catch (error) {
    throw new Error(
      `Error fetching endpoint users: ${(error as Error).message}`
    );
  }
}

export async function fetchAllEndpointsForUser(
  user: IUser
): Promise<IEndpoint[] | null> {
  try {
    const endpointUsers = await EndpointUser.find({ user: user._id }).populate(
      "endpoint"
    );
    const endpoints = endpointUsers.map(
      (endpointUser) => endpointUser.endpoint
    );
    return endpoints;
  } catch (error) {
    throw new Error(
      `Error fetching endpoints for user: ${(error as Error).message}`
    );
  }
}

export async function fetchAllUsersForEndpoint(
  endpoint: IEndpoint
): Promise<IUser[] | null> {
  try {
    const endpointUsers = await EndpointUser.find({
      endpoint: endpoint._id
    }).populate("user");
    const users = endpointUsers.map((endpointUser) => endpointUser.user);
    return users;
  } catch (error) {
    throw new Error(
      `Error fetching users for endpoint: ${(error as Error).message}`
    );
  }
}

export async function createEndpointUser({
  user,
  endpoint
}: Partial<IEndpointUser>): Promise<IEndpointUser> {
  try {
    const endpointUser = new EndpointUser({ user, endpoint });
    return await endpointUser.save();
  } catch (error) {
    throw new Error(`Error creating endpointUser: ${(error as Error).message}`);
  }
}

export async function createEndpointAndPairItWithUser({
  user,
  endpoint
}: Partial<IEndpointUser>) {
  try {
    if (await fetchEndpointByUrl(endpoint.url)) {
      throw new Error("Endpoint already exist!");
    }

    const createdEndpoint = await createEndpoint(endpoint);
    const createdEndpointUser = await createEndpointUser({
      user,
      endpoint: createdEndpoint
    });
    return createdEndpointUser;
  } catch (error) {
    throw new Error(`Error creating endpoint: ${(error as Error).message}`);
  }
}

export async function deleteEndpointUser(
  user: IUser,
  endpoint: IEndpoint
): Promise<IEndpointUser> {
  try {
    const endpointUser = await EndpointUser.findOneAndDelete({
      user: user._id,
      endpoint: endpoint._id
    }).exec();
    if (!endpointUser) {
      throw new Error("userEndpoint not found");
    }
    const users = await fetchAllUsersForEndpoint(endpoint);
    if (users?.length === 0) {
      await deleteEndpoint(endpoint._id);
    }
    return endpointUser;
  } catch (error) {
    throw new Error(
      `Error deleting endpoint user: ${(error as Error).message}`
    );
  }
}

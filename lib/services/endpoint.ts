import mongoose from "mongoose";

import Endpoint, { IEndpoint } from "@/models/endpoint";

export async function fetchEndpoints(): Promise<IEndpoint[]> {
  try {
    return await Endpoint.find({});
  } catch (error) {
    throw new Error(`Error fetching endpoints: ${(error as Error).message}`);
  }
}

export async function fetchEndpoint(
  id: mongoose.Types.ObjectId
): Promise<IEndpoint> {
  try {
    const endpoint = await Endpoint.findById(id);
    if (!endpoint) {
      throw new Error("Endpoint not found");
    }
    return endpoint;
  } catch (error) {
    throw new Error(`Error fetching endpoint: ${(error as Error).message}`);
  }
}

export async function fetchEndpointByUrl(url: IEndpoint["url"]) {
  try {
    const endpoint = await Endpoint.findOne({ url });
    return endpoint;
  } catch (error) {
    throw new Error(`Error fetching Endpoint: ${(error as Error).message}`);
  }
}

export async function createEndpoint(
  endpoint: Partial<IEndpoint>
): Promise<IEndpoint> {
  try {
    if (endpoint.apiKey == undefined) {
      throw new Error("You have to define apiKey!");
    }
    const newEndpoint = new Endpoint(endpoint);
    return await newEndpoint.save();
  } catch (error) {
    throw new Error(`Error creating endpoint: ${(error as Error).message}`);
  }
}

export async function updateEndpoint(
  id: mongoose.Types.ObjectId,
  updates: Partial<IEndpoint>
): Promise<IEndpoint> {
  try {
    const endpoint = await Endpoint.findByIdAndUpdate(id, updates, {
      new: true
    }).exec();
    if (!endpoint) {
      throw new Error("Endpoint not found");
    }
    return endpoint;
  } catch (error) {
    throw new Error(`Error updating endpoint: ${(error as Error).message}`);
  }
}

export async function deleteEndpoint(
  id: mongoose.Types.ObjectId
): Promise<IEndpoint> {
  try {
    const endpoint = await Endpoint.findByIdAndDelete(id, { new: true }).exec();
    if (!endpoint) {
      throw new Error("Endpoint not found");
    }
    return endpoint;
  } catch (error) {
    throw new Error(`Error deleting endpoint: ${(error as Error).message}`);
  }
}

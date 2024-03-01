import Endpoint, { IEndpoint } from "@/models/endpoint";

export const fetchEndpoints = () => Endpoint.find({});

export const fetchEndpoint = (id: string) => Endpoint.findById(id);

export const createEndpoint = ({ url, secret }: Partial<IEndpoint>) => {
  const endpoint = new Endpoint({ url, secret });
  return endpoint.save();
};

export const updateEndpoint = (id: string, updates: Partial<IEndpoint>) =>
  Endpoint.findByIdAndUpdate(id, updates, { new: true }).exec();

export const deleteEndpoint = (id: string) =>
  Endpoint.findByIdAndDelete(id, { new: true }).exec();
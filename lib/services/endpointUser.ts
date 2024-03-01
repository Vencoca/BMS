import EndpointUser, { IEndpointUser } from "@/models/endpointUser";

export const fetchEndpointUsers = () => EndpointUser.find();

export const fetchEndpointUser = (id: string) => EndpointUser.findById(id);

export const createEndpointUser = ({ user, endpoint }: Partial<IEndpointUser>) => {
  const endpointUser = new EndpointUser({ user, endpoint });
  return endpointUser.save();
};

export const updateEndpointUser = (id: string, updates: Partial<IEndpointUser>) =>
  EndpointUser.findByIdAndUpdate(id, updates, { new: true }).exec();

export const deleteEndpointUser = (id: string) =>
  EndpointUser.findByIdAndDelete(id, { new: true }).exec();
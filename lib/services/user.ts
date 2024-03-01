import User, { IUser } from "@/models/user";

export const fetchUsers = () => User.find({});

export const fetchUser = (id: string) => User.findById(id);

export const fetchUserByEmail = (email: string) => User.findOne({email})

export const createUser = ({ name, email, password }: Partial<IUser>) => {
  const user = new User({ name, email, password });
  return user.save();
};

export const updateUser = (id: string, updates: Partial<IUser>) =>
  User.findByIdAndUpdate(id, updates, { new: true }).exec();

export const deleteUser = (id: string) =>
  User.findByIdAndDelete(id, { new: true }).exec();
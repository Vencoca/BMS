import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User, { IUser } from "@/models/user";

export async function fetchUsers(): Promise<IUser[]> {
  try {
    return await User.find({});
  } catch (error) {
    throw new Error(`Error fetching users: ${(error as Error).message}`);
  }
}

export async function fetchUser(id: mongoose.Types.ObjectId): Promise<IUser> {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${(error as Error).message}`);
  }
}

export async function fetchUserByEmail(email: string): Promise<IUser> {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(
      `Error fetching user by email: ${(error as Error).message}`,
    );
  }
}

export async function createUser({
  name,
  email,
  password,
}: Partial<IUser>): Promise<IUser> {
  try {
    const user = new User({ name, email, password });
    return await user.save();
  } catch (error) {
    throw new Error(`Error creating user: ${(error as Error).message}`);
  }
}

export async function createUserWithHashedPassword({
  name,
  email,
  password,
}: Partial<IUser>): Promise<IUser> {
  try {
    const hashedPassword = await bcrypt.hash(password as string, 10);
    const user = new User({ name, email, hashedPassword });
    return await user.save();
  } catch (error) {
    throw new Error(`Error creating user: ${(error as Error).message}`);
  }
}

export async function comparePasswordWithUserPassword(
  { email, password }: Partial<IUser>,
  passwordToCompare: string,
) {
  try {
    if (!password) {
      if (!email) {
        throw new Error(`Error comparing password: no email provided`);
      }
      password = (await fetchUserByEmail(email)).password;
    }
    return await bcrypt.compare(password, passwordToCompare);
  } catch (error) {
    throw new Error(`Error comparing passwords: ${(error as Error).message}`);
  }
}

export async function userExists({ email }: Partial<IUser>) {
  return await User.findOne({ email: email });
}

export async function updateUser(
  id: mongoose.Types.ObjectId,
  updates: Partial<IUser>,
): Promise<IUser> {
  try {
    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).exec();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${(error as Error).message}`);
  }
}

export async function deleteUser(id: mongoose.Types.ObjectId): Promise<IUser> {
  try {
    const user = await User.findByIdAndDelete(id, { new: true }).exec();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(`Error deleting user: ${(error as Error).message}`);
  }
}

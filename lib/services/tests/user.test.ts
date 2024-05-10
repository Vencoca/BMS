import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongoose } from "mongoose";

import User from "@/models/user";

import usersMock from "../mocks/users.json";
import {
  comparePasswordWithUserPassword,
  createUser,
  createUserWithHashedPassword,
  deleteUser,
  fetchUser,
  fetchUserByEmail,
  fetchUsers,
  updateUser,
  userExists
} from "../user";
import seedDB from "./seedDB";

describe("Users methods tests", () => {
  let mongoose: Mongoose;
  let mongodb: MongoMemoryServer;
  let testData: Map<string, any>;
  beforeAll(async () => {
    [mongodb, mongoose, testData] = await seedDB();
  });

  afterAll(async () => {
    mongodb.stop();
    await mongoose?.connection.close();
  });

  describe("fetchUsers", () => {
    test("fetchUsers (seeding)", async () => {
      let users = await fetchUsers();
      expect(users).toHaveLength(usersMock.length);
      expect(testData.get("users")).toHaveLength(usersMock.length);
    });

    test("Error fetching users", async () => {
      jest.spyOn(User, "find").mockImplementationOnce(() => {
        throw new Error("MongoDB connection error");
      });
      await expect(fetchUsers()).rejects.toThrow(
        "Error fetching users: MongoDB connection error"
      );
    });
  });

  describe("fetchUser", () => {
    test("Fetch existing user by ID", async () => {
      const existingUserId = testData.get("users")[0]._id;
      expect(existingUserId).toBeDefined();

      const fetchedUser = await fetchUser(existingUserId);

      expect(fetchedUser).toBeDefined();
      expect(fetchedUser._id).toStrictEqual(existingUserId);
    });

    test("Error fetching nonexisting user by ID", async () => {
      const nonExistingUserId = new mongoose.Types.ObjectId();

      await expect(fetchUser(nonExistingUserId)).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("fetchUserByEmail", () => {
    test("Fetch existing user by email", async () => {
      const existingUserEmail = testData.get("users")[0].email;
      expect(existingUserEmail).toBeDefined();

      const fetchedUser = await fetchUserByEmail(existingUserEmail);

      expect(fetchedUser).toBeDefined();
      expect(fetchedUser.email).toBe(existingUserEmail);
    });

    test("Error fetching nonexisting user by email", async () => {
      const nonExistingUserEmail = "nonexistinguser@example.com";

      await expect(fetchUserByEmail(nonExistingUserEmail)).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("createUser", () => {
    test("Create user", async () => {
      const newUser = {
        name: "New User",
        email: "newuser@example.com",
        password: "password123"
      };

      const createdUser = await createUser(newUser);

      expect(createdUser).toBeDefined();
      expect(createdUser.name).toBe(newUser.name);
      expect(createdUser.email).toBe(newUser.email);
    });

    test("Error creating user (incomplete data)", async () => {
      const invalidUser = {
        name: "Invalid User"
      };

      await expect(createUser(invalidUser)).rejects.toThrow(
        "Error creating user: User validation failed: email: Path `email` is required."
      );
    });
  });

  describe("updateUser", () => {
    test("Update existing user", async () => {
      const existingUserId = testData.get("users")[0]._id;
      expect(existingUserId).toBeDefined();
      const updates = { name: "Updated Name" };

      const updatedUser = await updateUser(existingUserId, updates);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.name).toBe(updates.name);
    });

    test("Error updating nonexisting user", async () => {
      const nonExistingUserId = new mongoose.Types.ObjectId();
      const updates = { name: "Updated Name" };

      await expect(updateUser(nonExistingUserId, updates)).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("deleteUser", () => {
    test("Delete existing user", async () => {
      const existingUserId = testData.get("users")[0]._id;
      expect(existingUserId).toBeDefined();
      const deletedUser = await deleteUser(existingUserId);

      expect(deletedUser).toBeDefined();
      expect(deletedUser._id).toStrictEqual(existingUserId);
    });

    test("Error deleting nonexisting user", async () => {
      const nonExistingUserId = new mongoose.Types.ObjectId();
      await expect(deleteUser(nonExistingUserId)).rejects.toThrow(
        "User not found"
      );
    });
  });
  describe("createUserWithHashedPassword", () => {
    test("Create user", async () => {
      const newUser = {
        name: "New User",
        email: "newuser2@example.com",
        password: "password123"
      };

      const createdUser = await createUserWithHashedPassword(newUser);

      expect(createdUser).toBeDefined();
      expect(createdUser.name).toBe(newUser.name);
      expect(createdUser.email).toBe(newUser.email);
      expect(createdUser.password).not.toBe(newUser.password);
    });
    test("Error creating user (incomplete data)", async () => {
      const invalidUser = {
        name: "Invalid User"
      };

      await expect(createUserWithHashedPassword(invalidUser)).rejects.toThrow(
        "Error creating user: Illegal arguments: undefined, number"
      );
    });
  });
  describe("comparePasswordWithUserPassword", () => {
    test("Comparison with user", async () => {
      const newUser = {
        name: "New User",
        email: "newuser2@example.com"
      };
      const compare = await comparePasswordWithUserPassword(
        newUser,
        "password123"
      );
      expect(compare).toBeTruthy();
    });
    test("Comparison with user password", async () => {
      const newUser = {
        password: "password123"
      };
      const compare = await comparePasswordWithUserPassword(
        newUser,
        "password123"
      );
      expect(compare).toBeFalsy();
    });
    test("No email", async () => {
      const newUser = {
        name: "New User"
      };
      await expect(
        comparePasswordWithUserPassword(newUser, "password123")
      ).rejects.toThrow("Error comparing password: no email provided");
    });
  });

  describe("userExist", () => {
    test("Test if user exist", async () => {
      const user = await userExists("newuser2@example.com");
      expect(user).toBeDefined();
    });
  });
});

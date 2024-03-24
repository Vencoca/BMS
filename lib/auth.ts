import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { connectToMongoDB } from "./database";
import Logger from "./logger";
import {
  comparePasswordWithUserPassword,
  createUser,
  fetchUserByEmail,
  userExists
} from "./services/user";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login" // Redirect users to "/login" when signing in
  },
  session: {
    strategy: "jwt" // Use JSON Web Tokens (JWT) for session management
  },
  secret: process.env.NEXT_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        const { email, password } = credentials;
        try {
          await connectToMongoDB();
          const user = await fetchUserByEmail(email);
          if (!(await comparePasswordWithUserPassword(user, password))) {
            return null;
          }
          return user as User;
        } catch (error) {
          Logger.error(error);
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session }) {
      return session;
    },
    async signIn({ profile }: any) {
      try {
        if (profile?.email) {
          await connectToMongoDB();
          const user = await userExists(profile.email);
          if (!user) {
            await createUser({
              name: profile.name,
              email: profile.email,
              password: ""
            });
          }
        }
        return true;
      } catch (error) {
        Logger.error(error);
        return false;
      }
    }
  }
};

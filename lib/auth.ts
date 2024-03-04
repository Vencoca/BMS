import type { NextAuthOptions, User} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToMongoDB } from "./database";
import { comparePasswordWithUserPassword, createUser, fetchUserByEmail, userExists } from "./services/user";
import Logger from "./logger";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login", // Redirect users to "/login" when signing in
  },
  session: {
    strategy: "jwt", // Use JSON Web Tokens (JWT) for session management
  },
  secret: process.env.NEXT_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: any,) {
        const { email, password } = credentials
        try {
          await connectToMongoDB();
          const user = await fetchUserByEmail(email) 
          if (!comparePasswordWithUserPassword(user,password)) {
            return null
          }
          return user as User
        } catch (error) {
          Logger.error(error)
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async session({ session }) {
      return session;
    },
    async signIn({ profile }: any) {
      try {
        if (profile?.email) {
          await connectToMongoDB();
          if (!userExists(profile.email)) {
            createUser({
              name: profile.name,
              email: profile.email,
              password: '',
            })
          }
        }
        return true
      } catch (error) {
        Logger.error(error)
        return false
      }

    }
  }
};
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "./mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs"

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
      async authorize(credentials: any) {
        const { email, password } = credentials
        try {
          await connectMongoDB();
          const user = await User.findOne({ email })
          if (!user) {
            return null
          }
          const passwordMatch = await bcrypt.compare(password, user?.password)
          if (!passwordMatch) {
            return null
          }
          return user
        } catch (error) {
          console.log(error)
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
          await connectMongoDB();
          const userExist = await User.findOne({ "email": profile.email })
          if (!userExist) {
            const user = await User.create({
              name: profile.name,
              email: profile.email,
              password: '',
            })
          }
        }
        return true
      } catch (error) {
        console.log(error)
        return false
      }

    }
  }
};
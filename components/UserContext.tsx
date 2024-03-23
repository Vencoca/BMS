"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/models/user";

interface UserCtxProps {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

const UserCtx = createContext({} as UserCtxProps);

export const UserCtxProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const { data: session, status } = useSession();
  useEffect(() => {
    const fetchUserFromDB = async () => {
      try {
        if (
          status === "authenticated" &&
          session &&
          session.user &&
          session.user.email &&
          user === null
        ) {
          const res = await fetch(`/api/users/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: session.user.email })
          });
          const resJson = await res.json();
          if (res.ok) {
            setUser(resJson.data);
          } else {
            throw new Error("Error setting user context: ", resJson.message);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserFromDB();
  }, [session, status, user]);

  const value = {
    user: user,
    setUser
  };

  return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
};

export function useUserContext() {
  return useContext(UserCtx);
}

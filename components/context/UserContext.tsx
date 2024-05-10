"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

import Logger from "@/lib/logger";
import { IDashboard } from "@/models/dashboard";
import { IEndpoint } from "@/models/endpoint";
import { IUser } from "@/models/user";

interface UserCtxProps {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  dashboards: IDashboard[] | null;
  setDashboards: React.Dispatch<React.SetStateAction<IDashboard[] | null>>;
  endpoints: IEndpoint[] | null;
  setEndpoints: React.Dispatch<React.SetStateAction<IEndpoint[] | null>>;
}

const UserCtx = createContext({} as UserCtxProps);

export const UserCtxProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [dashboards, setDashboards] = useState<IDashboard[] | null>(null);
  const [endpoints, setEndpoints] = useState<IEndpoint[] | null>(null);

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
        Logger.debug("Error fetching user:", error);
      }
    };
    if (user?.email !== session?.user?.email && session?.user?.email) {
      fetchUserFromDB();
    }
  }, [session, status, user]);

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const res = await fetch(`/api/dashboards`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user: user })
        });
        const resJson = await res.json();
        if (res.ok) {
          setDashboards(resJson.dashboards);
        } else {
          throw new Error("Error setting dashboards: ", resJson.message);
        }
      } catch (error) {
        Logger.debug("Error fetching dashboards:", error);
      }
    };
    if (user != null) {
      fetchDashboards();
    }
  }, [user]);

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        const res = await fetch(`/api/endpoints`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user: user })
        });
        const resJson = await res.json();
        if (res.ok) {
          setEndpoints(resJson.endpoints);
        } else {
          throw new Error("Error setting dashboards: ", resJson.message);
        }
      } catch (error) {
        Logger.debug("Error fetching dashboards:", error);
      }
    };
    if (user != null) {
      fetchEndpoints();
    }
  }, [user]);

  const value = {
    user: user,
    setUser,
    endpoints: endpoints,
    setEndpoints,
    dashboards: dashboards,
    setDashboards
  };

  return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
};

export function useUserContext() {
  return useContext(UserCtx);
}

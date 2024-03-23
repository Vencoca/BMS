import { Box, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

import { IDashboard } from "@/models/dashboard";

import { useUserContext } from "./UserContext";

export default function DashboardList() {
  const { user } = useUserContext();
  const [dashboards, setDashboards] = useState([]);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    const fetchDashboards = async () => {
      setFetching(true);
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
        console.error("Error fetching dashboards:", error);
      } finally {
        setFetching(false);
      }
    };
    if (user != null) {
      fetchDashboards();
    }
  }, [user]);

  return (
    <Box display={"flex"} flexDirection={"column"}>
      {fetching ? (
        <CircularProgress size={24} />
      ) : (
        dashboards.map(
          (dashboard: IDashboard) =>
            dashboard && (
              <Link href={`/dashboard/${dashboard._id}`} key={dashboard._id}>
                {dashboard.name}
              </Link>
            )
        )
      )}
    </Box>
  );
}

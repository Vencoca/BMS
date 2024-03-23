"use client";

import { Box, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { useEffect, useState } from "react";

import Graph from "@/components/Graph";
import { IGraph } from "@/models/graph";

type dashboardProps = {
  params: { dashboardId: string };
};

export default function Dashboard({ params }: dashboardProps) {
  const [graphs, setGraphs] = useState<IGraph[]>([]);
  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const res = await fetch(`/api/graphs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ dashboardId: params.dashboardId })
        });
        const resJson = await res.json();
        if (res.ok) {
          setGraphs(resJson.graphs);
        } else {
          throw new Error("Error setting dashboards: ", resJson.message);
        }
      } catch (error) {
        console.error("Error fetching dashboards:", error);
      }
    };
    fetchDashboards();
  }, [params.dashboardId]);
  return (
    <Box>
      <Typography variant="h3" component="h1">
        {params.dashboardId}
      </Typography>
      <Typography variant="body1" component="p">
        To continue into creating graph click{" "}
        <Link
          href={`./${params.dashboardId}/graph`}
          component={NextLink}
          underline="hover"
        >
          {"here"}
        </Link>
      </Typography>
      <Box>
        {graphs.map((graph, id) => (
          <Graph key={id} {...graph}></Graph>
        ))}
      </Box>
    </Box>
  );
}

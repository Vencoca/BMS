"use client";

import { Box, Button, Divider, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";

import GraphForm from "@/components/forms/GraphForm";
import { IGraph } from "@/models/graph";

type dashboardProps = {
  params: { graphId: string; dashboardId: string };
};

export default function Dashboard({ params }: dashboardProps) {
  const [graph, setGraph] = useState<IGraph | null>(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await fetch(`/api/graphs/graph/${params.graphId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const resJson = await res.json();
        if (res.ok) {
          setGraph(resJson.graph);
        } else {
          throw new Error("Error getting graph: ", resJson.message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchGraph();
  }, [params.graphId]);

  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
      minHeight="calc(100vh - 64px)"
    >
      <Box
        bgcolor={"white"}
        padding="32px"
        display={"flex"}
        flexDirection={"column"}
        gap={"16px"}
      >
        <Divider>Edit graph</Divider>
        <Box>
          {!graph ? (
            <Box
              minWidth="280px"
              sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <Skeleton variant="rectangular" width={"100%"} height={56} />
              <Skeleton variant="rectangular" width={"100%"} height={56} />
              <Skeleton variant="rectangular" width={"100%"} height={56} />
              <Skeleton variant="rectangular" width={"100%"} height={56} />
              <Skeleton variant="rectangular" width={"100%"} height={56} />
              <Skeleton variant="rectangular" width={"100%"} height={56} />
              <Button
                type="submit"
                variant="contained"
                sx={{ width: "100%" }}
                disabled={true}
              >
                Edit graph
              </Button>
            </Box>
          ) : (
            <GraphForm
              graph={graph}
              dashboardId={params.dashboardId}
            ></GraphForm>
          )}
        </Box>
      </Box>
    </Box>
  );
}

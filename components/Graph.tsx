"use client";

import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";

import { IGraph } from "@/models/graph";

export default function Graph(graph: Partial<IGraph>) {
  const [graphData, setGraphData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/workWithEndpoint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ graph: graph })
        });
        const resJson = await res.json();
        if (res.ok) {
          console.log(resJson);
          setGraphData(resJson.data);
        } else {
          throw new Error(resJson.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [graph]);

  if (loading || !graphData) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "40px",
        overflow: "hidden",
        width: "800px",
        height: "300px"
      }}
    >
      <LineChart
        xAxis={[
          {
            scaleType: "point",
            dataKey: "timestamp"
          }
        ]}
        series={[{ dataKey: "value" }]}
        dataset={graphData}
      />
    </Box>
  );
}

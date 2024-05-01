"use client";

import { Box, Skeleton } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";

import { IGraph } from "@/models/graph";

export default function Graph({
  graph,
  from,
  to
}: {
  graph: Partial<IGraph>;
  from: Date | null;
  to: Date | null;
}) {
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
          body: JSON.stringify({
            graph: graph,
            from: from,
            to: to
          })
        });
        const resJson = await res.json();
        if (res.ok) {
          const data = resJson.data;
          const newData = data.map(
            (item: { timestamp: string | number | Date; value: any }) => {
              return {
                ...item,
                timestamp: new Date(item.timestamp),
                value: Number(item.value)
              };
            }
          );
          setGraphData(newData);
        } else {
          throw new Error(resJson.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (from && to) {
      fetchData();
    }
  }, [from, graph, to]);

  if (loading || !graphData) {
    return (
      <Skeleton width={"90%"} height={"100%"} sx={{ ml: 2, mr: 2 }}></Skeleton>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "40px",
        overflow: "hidden",
        width: "100%",
        height: "100%"
      }}
    >
      <LineChart
        xAxis={[
          {
            scaleType: "time",
            dataKey: "timestamp"
          }
        ]}
        series={[{ dataKey: "value" }]}
        dataset={graphData}
      />
    </Box>
  );
}

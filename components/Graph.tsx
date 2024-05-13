"use client";

import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { BarChart, LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";

import Logger from "@/lib/logger";
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
            (
              item: { timestamp: string | number | Date; value: any },
              index: number
            ) => {
              return {
                ...item,
                timestamp: new Date(item.timestamp),
                value: Number(item.value),
                id: index + 1
              };
            }
          );
          setGraphData(newData);
        } else {
          throw new Error(resJson.message);
        }
      } catch (error) {
        Logger.debug("Error fetching data:", error);
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
      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: 5,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          textAlign: "center"
        }}
      >
        {graph.name}
      </Typography>
      {graph.variant === "Bar" && (
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              dataKey: "id",
              label: graph.xAxis
            }
          ]}
          yAxis={[{ label: graph.yAxis }]}
          series={[{ dataKey: "value" }]}
          dataset={graphData}
        />
      )}
      {graph.variant === "Table" && (
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            height: "calc(100% - 48px)",
            marginTop: "48px"
          }}
        >
          <TableContainer sx={{ maxHeight: "100%" }}>
            <Table stickyHeader aria-label="Table">
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(graphData as [{ timestamp: Date; value: Number }]).map(
                  (row, index) => (
                    <TableRow key={index}>
                      <TableCell>{String(row.value)}</TableCell>
                      <TableCell>{String(row.timestamp)}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      {(!graph.variant || graph.variant === "Line") && (
        <LineChart
          xAxis={[
            {
              scaleType: "time",
              dataKey: "timestamp",
              label: graph.xAxis
            }
          ]}
          yAxis={[{ label: graph.yAxis }]}
          series={[{ dataKey: "value" }]}
          dataset={graphData}
        />
      )}
    </Box>
  );
}

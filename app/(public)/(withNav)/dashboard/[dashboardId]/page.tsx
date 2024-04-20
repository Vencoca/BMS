"use client";

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import "@/styles/gridLayout.css";

import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import Graph from "@/components/Graph";
import { IGraph } from "@/models/graph";

type dashboardProps = {
  params: { dashboardId: string };
};

export default function Dashboard({ params }: dashboardProps) {
  const [graphs, setGraphs] = useState<IGraph[]>([]);
  const ResponsiveGridLayout = WidthProvider(Responsive);
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
    <ResponsiveGridLayout
      className="layout"
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      width={1920}
    >
      {graphs.map((graph, id) => (
        <Box
          key={id}
          sx={{ backgroundColor: "white" }}
          data-grid={{ x: 0, y: 0, w: 4, h: 2 }}
        >
          <Graph key={id} {...graph}></Graph>
        </Box>
      ))}
      <Box
        key="c"
        sx={{ backgroundColor: "white" }}
        data-grid={{ x: 0, y: 0, w: 3, h: 2 }}
      >
        <Button
          onMouseDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
          onClick={() => {
            console.log("hey");
          }}
        >
          Hey Click me
        </Button>
      </Box>
    </ResponsiveGridLayout>
  );
}

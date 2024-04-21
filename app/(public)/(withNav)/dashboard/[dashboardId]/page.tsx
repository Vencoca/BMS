"use client";

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import "@/styles/gridLayout.css";

import { Box, FormControlLabel, Switch } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";

import Graph from "@/components/Graph";
import { IGraph } from "@/models/graph";

type dashboardProps = {
  params: { dashboardId: string };
};

export default function Dashboard({ params }: dashboardProps) {
  const [editable, setEditable] = useState(false);
  const [graphs, setGraphs] = useState<IGraph[]>([]);
  const data = useRef<any>({ layout: null });
  const ResponsiveGridLayout = useMemo(() => {
    return WidthProvider(Responsive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  async function handleEditableSwitch() {
    setEditable(() => !editable);
    if (editable && data.current.layout) {
      try {
        const res = await fetch("/api/layout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            graphs: graphs,
            layout: data.current.layout
          })
        });
        if (res.ok) {
          console.log("Update layout done");
        } else {
          console.log("Something went wrong");
        }
      } catch (error) {
        console.log(error);
      }

      data.current.layout = null;
    }
  }

  return (
    <>
      <Box sx={{ position: "fixed", right: 40, bottom: 40 }}>
        <FormControlLabel
          checked={editable}
          onChange={() => handleEditableSwitch()}
          control={<Switch />}
          label="Label"
        />
      </Box>
      <ResponsiveGridLayout
        className="layout"
        cols={{ lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }}
        width={1920}
        isDraggable={editable}
        isResizable={editable}
        onLayoutChange={(layout: Layout[]) => {
          if (editable) {
            data.current.layout = layout;
          }
        }}
      >
        {graphs.map((graph, id) => (
          <Box
            key={id}
            sx={{ backgroundColor: "white" }}
            data-grid={
              graph?.layout ? graph.layout : { x: 0, y: 0, w: 12, h: 2 }
            }
          >
            <Graph graph={graph}></Graph>
          </Box>
        ))}
      </ResponsiveGridLayout>
    </>
  );
}

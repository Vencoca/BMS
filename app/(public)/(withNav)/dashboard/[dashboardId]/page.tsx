"use client";

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import "@/styles/gridLayout.css";

import SaveIcon from "@mui/icons-material/Save";
import { Box, IconButton, Paper } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";

import { useNavContext } from "@/components/context/NavContext";
import Graph from "@/components/Graph";
import DashboardSettings from "@/components/menu/DashboardSettings";
import { IGraph } from "@/models/graph";

type dashboardProps = {
  params: { dashboardId: string };
};

export default function Dashboard({ params }: dashboardProps) {
  const [graphs, setGraphs] = useState<IGraph[]>([]);
  const { setRightMenu, RightMenu, editable, data, setEditable } =
    useNavContext();

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
          data.current.graphs = resJson.graphs;
        } else {
          throw new Error("Error setting dashboards: ", resJson.message);
        }
      } catch (error) {
        console.error("Error fetching dashboards:", error);
      }
    };
    fetchDashboards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.dashboardId]);

  useEffect(() => {
    if (!RightMenu) {
      setRightMenu(() => (
        <DashboardSettings dashboardId={params.dashboardId} />
      ));
    }
  }, [setRightMenu, RightMenu, params.dashboardId]);

  async function handleSave() {
    setEditable(() => !editable);
    if (editable && data.current.layout) {
      try {
        const res = await fetch("/api/layout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            graphs: data.current.graphs,
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
      {editable && (
        <Paper
          sx={{
            position: "fixed",
            right: 40,
            bottom: 40,
            borderRadius: "100%",
            zIndex: 999
          }}
        >
          <IconButton aria-label="save" size="large" onClick={handleSave}>
            <SaveIcon fontSize="large" />
          </IconButton>
        </Paper>
      )}
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

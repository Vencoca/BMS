"use client";

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import "@/styles/gridLayout.css";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper
} from "@mui/material";
import NextLink from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";

import { useNavContext } from "@/components/context/NavContext";
import { useUserContext } from "@/components/context/UserContext";
import DatePicker, { CalculateDate } from "@/components/DatePicker";
import Graph from "@/components/Graph";
import DashboardSettings from "@/components/menu/DashboardSettings";
import Logger from "@/lib/logger";
import { IDashboard } from "@/models/dashboard";
import { IGraph } from "@/models/graph";

type dashboardProps = {
  params: { dashboardId: string };
};
type ValuePiece = Date | null;
type Value = [ValuePiece, ValuePiece];

export default function Dashboard({ params }: dashboardProps) {
  const [graphs, setGraphs] = useState<IGraph[]>([]);
  const { setRightMenu, RightMenu, editable, data, setEditable } =
    useNavContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const graphToBeDeleted = useRef({ id: null });
  const [value, setValue] = useState<Value>([null, null]);
  const [option, setOption] = useState<string | null>(null);
  const { setDashboards, dashboards } = useUserContext();

  const ResponsiveGridLayout = useMemo(() => {
    return WidthProvider(Responsive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchGraphs = async () => {
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
        Logger.error("Error fetching dashboards:", error);
      }
    };
    fetchGraphs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.dashboardId]);

  useEffect(() => {
    const dashboard = dashboards?.find(
      (dash) => dash._id === params.dashboardId
    );
    if (dashboard) {
      setOption(dashboard?.dataOption || "Today");
      setValue(
        dashboard?.dataOption === "Custom"
          ? [new Date(dashboard.from), new Date(dashboard.to)]
          : (CalculateDate((dashboard?.dataOption as any) || "Today") as any)
      );
    }
  }, [dashboards, params.dashboardId]);

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
          Logger.debug("Update layout done");
        } else {
          Logger.debug("Something went wrong");
        }
      } catch (error) {
        Logger.debug(error);
      }

      data.current.layout = null;
    }

    try {
      const res = await fetch(
        `/api/dashboards/dashboard/${params.dashboardId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            dashboard: {
              dataOption: option,
              from: value[0],
              to: value[1]
            }
          })
        }
      );
      const resJson = await res.json();
      if (res.ok) {
        setDashboards((dashboards) => {
          const index = dashboards?.findIndex(
            (dashboard) => dashboard._id === params.dashboardId
          );
          if (index != undefined) {
            const updatedDashboards = [...(dashboards as IDashboard[])];
            updatedDashboards[index] = resJson.dashboard;
            return updatedDashboards;
          }
          return dashboards;
        });
      } else {
        Logger.debug("Something went wrong");
      }
    } catch (error) {
      Logger.debug(error);
    }
  }

  const stopPropagation = (event: any) => {
    event.stopPropagation();
  };

  async function handleDelete() {
    const id = graphToBeDeleted.current.id;
    setDialogOpen(false);
    try {
      const res = await fetch(`/api/graphs/graph/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const resJson = await res.json();
      if (res.ok) {
        const filteredGraphs = graphs.filter((item) => item._id !== id);
        data.current.graphs = filteredGraphs;
        setGraphs(filteredGraphs);
      } else {
        throw new Error("Error deleting graph: ", resJson.message);
      }
    } catch (error) {
      Logger.debug(error);
    }
  }

  return (
    <>
      {editable && (
        <>
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
          <DatePicker
            value={value}
            setValue={setValue}
            option={option}
            setOption={setOption}
          ></DatePicker>
        </>
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
            sx={{ backgroundColor: "white", position: "relative" }}
            data-grid={
              graph?.layout ? graph.layout : { x: 0, y: 0, w: 12, h: 2 }
            }
          >
            {editable && (
              <Box
                sx={{
                  position: "absolute",
                  top: 1,
                  right: 0,
                  zIndex: 9
                }}
              >
                <IconButton
                  size="small"
                  color="inherit"
                  aria-label="Edit graph"
                  onMouseDown={stopPropagation}
                  onTouchStart={stopPropagation}
                  sx={{ mr: 1 }}
                  href={`./${graph._id}`}
                  component={NextLink}
                >
                  <EditIcon fontSize="small"></EditIcon>
                </IconButton>
                <IconButton
                  size="small"
                  color="inherit"
                  aria-label="Delete graph"
                  sx={{ mr: 1 }}
                  onMouseDown={stopPropagation}
                  onTouchStart={stopPropagation}
                  onClick={() => {
                    graphToBeDeleted.current.id = graph._id;
                    setDialogOpen(true);
                  }}
                >
                  <DeleteIcon fontSize="small"></DeleteIcon>
                </IconButton>
              </Box>
            )}
            <Graph
              graph={graph}
              from={value ? value[0] : null}
              to={value ? value[1] : null}
            ></Graph>
          </Box>
        ))}
      </ResponsiveGridLayout>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="Consent to delete graph"
      >
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to delte this graph?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Disagree</Button>
          <Button onClick={handleDelete} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

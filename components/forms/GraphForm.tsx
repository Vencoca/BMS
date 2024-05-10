import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Snackbar,
  TextField
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import Logger from "@/lib/logger";
import { IDashboard } from "@/models/dashboard";
import { IEndpoint } from "@/models/endpoint";
import { IGraph } from "@/models/graph";

import { useUserContext } from "../context/UserContext";

interface Form {
  endpoint: IEndpoint["_id"];
  numberOfPoints: number;
  measurement: string;
  aggregationMethod: string;
  name: string;
  dashboard: IDashboard["_id"];
  yAxis: string;
  xAxis: string;
  variant: string;
}

export default function GraphForm({
  dashboardId,
  graph
}: {
  dashboardId?: string;
  graph?: IGraph;
}) {
  const { user } = useUserContext();
  const [apiInProgress, setApiInProgress] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const [endpoints, setEndpoints] = useState<Record<string, IEndpoint>>({});
  const [dashboards, setDashboards] = useState<IDashboard[]>([]);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: graph?.name || "",
      measurement: graph?.measurement || "",
      endpoint: graph?.endpoint || "",
      numberOfPoints: graph?.numberOfPoints || 0,
      aggregationMethod: graph?.aggregationMethod || "",
      yAxis: graph?.yAxis || "",
      xAxis: graph?.xAxis || "",
      variant: graph?.variant || "Line",
      dashboard: dashboardId
    },
    mode: "onBlur"
  });

  let endpointWatch = watch("endpoint") as any;
  const variants = ["Line", "Bar", "Table"];
  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit: SubmitHandler<Form> = async (data) => {
    try {
      setApiInProgress(true);
      let res;
      if (graph) {
        res = await fetch(`/api/graphs/graph/${graph._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            graph: {
              ...data
            }
          })
        });
      } else {
        res = await fetch("/api/graphs/graph", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            graph: {
              ...data
            }
          })
        });
      }

      if (res.ok) {
        router.replace(`/dashboard/${data.dashboard}`);
      } else {
        const resJson = await res.json();
        throw new Error(resJson.message);
      }
    } catch (error: any) {
      setError(error.message || "Internal server error");
      setOpen(true);
    } finally {
      setApiInProgress(false);
    }
  };

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        const res = await fetch(`/api/endpoints`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user: user })
        });
        const resJson = await res.json();
        if (res.ok) {
          const endpointsObj = resJson.endpoints.reduce(
            (acc: any, endpoint: IEndpoint) => {
              acc[endpoint._id] = endpoint;
              return acc;
            },
            {}
          );
          setEndpoints(endpointsObj);
        } else {
          throw new Error("Error fetching endpoint: ", resJson.message);
        }
      } catch (error) {
        Logger.debug("Error fetching endpoitns:", error);
      } finally {
        setFetching(false);
      }
    };
    const fetchDashboards = async () => {
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
          throw new Error("Error fetching dashboards: ", resJson.message);
        }
      } catch (error) {
        Logger.debug(error);
      } finally {
        setFetching(false);
      }
    };
    if (user != null) {
      fetchEndpoints();
      fetchDashboards();
    }
  }, [user, dashboardId]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fetching ? (
        <Box
          minWidth="280px"
          sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {!dashboardId && (
            <Skeleton variant="rectangular" width={"100%"} height={56} />
          )}
          <Skeleton variant="rectangular" width={"100%"} height={56} />
          <Skeleton variant="rectangular" width={"100%"} height={56} />
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
            {apiInProgress ? (
              <CircularProgress size={24} />
            ) : graph ? (
              "Edit Graph"
            ) : (
              "Create Graph"
            )}
          </Button>
        </Box>
      ) : (
        <Box
          minWidth="280px"
          sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {!dashboardId && (
            <Controller
              name="dashboard"
              control={control}
              rules={{
                required: { value: true, message: "Dashboard is required" }
              }}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel
                    id="dashboard"
                    error={errors["dashboard"] && true}
                  >
                    {errors["dashboard"]?.message || "Dashboard"}
                  </InputLabel>
                  <Select
                    labelId="dashboard"
                    error={errors["dashboard"] && true}
                    label={errors["dashboard"]?.message || "Dashboard"}
                    {...field}
                  >
                    {dashboards.map((dashboard, index) => (
                      <MenuItem key={index} value={dashboard._id}>
                        {dashboard.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          )}
          <Controller
            name="name"
            control={control}
            rules={{
              required: { value: true, message: "Name is required!" }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                error={errors["name"] && true}
                label={errors["name"]?.message || "Name"}
                variant="outlined"
              />
            )}
          />
          <Controller
            name="xAxis"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={errors["xAxis"] && true}
                label={errors["xAxis"]?.message || "xAxis label"}
                variant="outlined"
              />
            )}
          />
          <Controller
            name="yAxis"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={errors["yAxis"] && true}
                label={errors["yAxis"]?.message || "yAxis label"}
                variant="outlined"
              />
            )}
          />
          <Controller
            name="variant"
            control={control}
            rules={{
              required: { value: true, message: "Variant is required!" }
            }}
            render={({ field }) => (
              <FormControl fullWidth sx={{ maxWidth: "280px" }}>
                <InputLabel id="variant" error={errors["variant"] && true}>
                  {errors["variant"]?.message || ("Variant" as any)}
                </InputLabel>
                <Select
                  labelId="variant"
                  error={errors["variant"] && true}
                  label={errors["variant"]?.message || ("Variant" as any)}
                  {...field}
                >
                  {variants.map((variant, index) => (
                    <MenuItem
                      key={index}
                      value={variant}
                      sx={{
                        width: "280px",
                        textOverflow: "ellipsis",
                        maxWidth: "280px",
                        textWrap: "nowrap",
                        overflow: "hidden",
                        display: "block"
                      }}
                    >
                      {variant}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="numberOfPoints"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Number of points is required!"
              },
              validate: (value) => value > 0 || "Value must be greater than 0"
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                error={errors["numberOfPoints"] && true}
                label={errors["numberOfPoints"]?.message || "Number of points"}
                variant="outlined"
              />
            )}
          />
          <Controller
            name="endpoint"
            control={control}
            rules={{
              required: { value: true, message: "Endpoint is required!" }
            }}
            render={({ field }) => (
              <FormControl fullWidth sx={{ maxWidth: "280px" }}>
                <InputLabel id="endpoint" error={errors["endpoint"] && true}>
                  {errors["endpoint"]?.message || ("Endpoint" as any)}
                </InputLabel>
                <Select
                  labelId="endpoint"
                  error={errors["endpoint"] && true}
                  label={errors["endpoint"]?.message || ("Endpoint" as any)}
                  {...field}
                >
                  {Object.values(endpoints).map((endpoint, index) => (
                    <MenuItem
                      key={index}
                      value={endpoint._id}
                      sx={{
                        width: "280px",
                        textOverflow: "ellipsis",
                        maxWidth: "280px",
                        textWrap: "nowrap",
                        overflow: "hidden",
                        display: "block"
                      }}
                    >
                      {endpoint.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="aggregationMethod"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Aggregation method is required!"
              }
            }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel
                  id="aggregationMethod"
                  error={errors["aggregationMethod"] && true}
                >
                  {errors["aggregationMethod"]?.message || "Aggregation method"}
                </InputLabel>
                <Select
                  labelId="aggregationMethod"
                  error={errors["aggregationMethod"] && true}
                  label={
                    errors["aggregationMethod"]?.message || "Aggregation method"
                  }
                  {...field}
                >
                  {endpointWatch !== "" &&
                    endpoints[endpointWatch].aggregationMethods.map(
                      (method, index) => (
                        <MenuItem key={index} value={method}>
                          {method}
                        </MenuItem>
                      )
                    )}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="measurement"
            control={control}
            rules={{
              required: { value: true, message: "Measurement is required!" }
            }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel
                  id="measurement"
                  error={errors["measurement"] && true}
                >
                  {errors["measurement"]?.message || "Measurement"}
                </InputLabel>
                <Select
                  labelId="measurement"
                  error={errors["measurement"] && true}
                  label={errors["measurement"]?.message || "Measurement"}
                  {...field}
                >
                  {endpointWatch !== "" &&
                    endpoints[endpointWatch].measurements.map(
                      (measurement, index) => (
                        <MenuItem key={index} value={measurement}>
                          {measurement}
                        </MenuItem>
                      )
                    )}
                </Select>
              </FormControl>
            )}
          />
          {error !== "" && (
            <Snackbar
              open={open}
              autoHideDuration={5000}
              onClose={handleClose}
              message={error}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Alert
                onClose={handleClose}
                severity="error"
                variant="filled"
                sx={{ width: "100%" }}
              >
                {error}
              </Alert>
            </Snackbar>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{ width: "100%" }}
            disabled={apiInProgress}
          >
            {apiInProgress ? (
              <CircularProgress size={24} />
            ) : graph ? (
              "Edit Graph"
            ) : (
              "Create Graph"
            )}
          </Button>
        </Box>
      )}
    </form>
  );
}

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { IEndpoint } from "@/models/endpoint";

import { useUserContext } from "./UserContext";

interface Form {
  endpoint: IEndpoint["_id"];
  numberOfPoints: number;
  measurement: string;
  aggregationMethod: string;
  name: string;
}

export default function CreateGraphForm({
  dashboardId
}: {
  dashboardId: string;
}) {
  const { user } = useUserContext();
  const [apiInProgress, setApiInProgress] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const [endpoints, setEndpoints] = useState<IEndpoint[]>([]);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      measurement: "",
      endpoint: "",
      numberOfPoints: 0,
      aggregationMethod: "",
      dashboard: dashboardId
    },
    mode: "onBlur"
  });

  let endpointWatch = watch("endpoint") as any;

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit: SubmitHandler<Form> = async (data) => {
    try {
      setApiInProgress(true);
      const res = await fetch("/api/graphs/graph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          graph: { ...data, endpoint: endpoints[data.endpoint] }
        })
      });
      if (res.ok) {
        router.replace(`/`);
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
          setEndpoints(resJson.endpoints);
        } else {
          throw new Error("Error fetching endpoint: ", resJson.message);
        }
      } catch (error) {
        console.error("Error fetching endpoitns:", error);
      } finally {
        setFetching(false);
      }
    };
    if (user != null) {
      fetchEndpoints();
    }
  }, [user]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fetching ? (
        <CircularProgress size={24} />
      ) : (
        <Box
          minWidth="280px"
          sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
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
              required: { value: true, message: "Measurement is required!" }
            }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="endpoint">Endpoint</InputLabel>
                <Select
                  labelId="endpoint"
                  error={errors["endpoint"] && true}
                  label={errors["endpoint"]?.message || "Name"}
                  {...field}
                >
                  {endpoints.map((endpoint, index) => (
                    <MenuItem key={index} value={index}>
                      {endpoint.url}
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
                <InputLabel id="aggregationMethod">
                  Aggregation method
                </InputLabel>
                <Select
                  labelId="aggregationMethod"
                  error={errors["aggregationMethod"] && true}
                  label={errors["aggregationMethod"]?.message || "Name"}
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
                <InputLabel id="measurement">Measurement</InputLabel>
                <Select
                  labelId="measurement"
                  error={errors["measurement"] && true}
                  label={errors["measurement"]?.message || "Name"}
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
            {apiInProgress ? <CircularProgress size={24} /> : "Create graph"}
          </Button>
        </Box>
      )}
    </form>
  );
}

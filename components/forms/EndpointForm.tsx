"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { IEndpoint } from "@/models/endpoint";

import { useUserContext } from "../context/UserContext";

interface Form {
  name: string;
  url: string;
  apiKey: string;
}

export default function EndpointForm({ endpoint }: { endpoint?: IEndpoint }) {
  const [apiInProgress, setApiInProgress] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const { user, setEndpoints } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handleFormSubmit = () => {
    setDialogOpen(false);
    handleSubmit(onSubmit)();
  };
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: endpoint?.name || "",
      url: endpoint?.url || "",
      apiKey: endpoint?.apiKey || ""
    },
    mode: "onBlur"
  });
  const handleClose = () => {
    setOpen(false);
  };
  const router = useRouter();

  const handleEdit = async (endpoint: IEndpoint) => {
    try {
      const res = await fetch(`/api/endpoints/endpoint/${endpoint?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          endpoint: endpoint
        })
      });
      const resJson = await res.json();
      if (res.ok) {
        setEndpoints((endpoints) => {
          if (!endpoints) {
            return null; //this should never happen
          }
          const index = endpoints.findIndex(
            (endpoint) => endpoint._id === resJson.endpoint._id
          );
          if (index !== -1) {
            const updatedEndpoints = [...endpoints];
            updatedEndpoints[index] = resJson.endpoint;
            return updatedEndpoints;
          }
          return endpoints;
        });
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit: SubmitHandler<Form> = async (data) => {
    if (endpoint) {
      const updatedEndpoint = {
        ...endpoint,
        name: data.name,
        url: data.url,
        apiKey: data.apiKey
      } as IEndpoint;
      try {
        setApiInProgress(true);
        const workingConnection = await testConnection(updatedEndpoint);
        if (!workingConnection) {
          throw new Error("Cant establish connection to endpoit!");
        }
        await handleEdit(updatedEndpoint);
      } catch (error: any) {
        setError(error.message || "Internal server error");
        setOpen(true);
      } finally {
        setApiInProgress(false);
      }
    } else {
      try {
        setApiInProgress(true);
        const newEndpoint = {
          name: data.name,
          url: data.url,
          apiKey: data.apiKey
        };
        const workingConnection = await testConnection(newEndpoint);
        if (!workingConnection) {
          throw new Error("Cant establish connection to endpoit!");
        }
        const res = await fetch("/api/endpoints/endpoint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ endpoint: newEndpoint, user: user })
        });
        const resJson = await res.json();
        if (res.ok) {
          setEndpoints((endpoints) => {
            if (endpoints) {
              endpoints.push(resJson.endpoint);
            } else {
              return resJson.endpoint;
            }
            return [...endpoints];
          });
          router.replace(`/`);
        } else {
          throw new Error(resJson.message);
        }
      } catch (error: any) {
        setError(error.message || "Internal server error");
        setOpen(true);
      } finally {
        setApiInProgress(false);
      }
    }
  };

  async function testConnection(endpoint: Partial<IEndpoint>) {
    const headers = new Headers();
    headers.append("Authorization", endpoint.apiKey || "");
    const requestOptions: RequestInit = {
      method: "GET",
      headers: headers,
      redirect: "follow"
    };

    try {
      const url =
        endpoint.url?.startsWith("http://") ||
        endpoint.url?.startsWith("https://")
          ? endpoint.url
          : `http://${endpoint.url}`;
      const response = await fetch(url || "", requestOptions);
      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(`Error during testing connection!`);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            name="url"
            control={control}
            rules={{
              required: { value: true, message: "Url is required!" }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                error={errors["url"] && true}
                label={errors["url"]?.message || "Url"}
                variant="outlined"
              />
            )}
          />
          <Controller
            name="apiKey"
            control={control}
            rules={{
              required: { value: true, message: "apiKey is required!" }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                error={errors["apiKey"] && true}
                label={errors["apiKey"]?.message || "apiKey"}
                type={showPassword ? "text" : "password"}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
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
            type={endpoint ? "button" : "submit"}
            variant="contained"
            sx={{ width: "100%" }}
            disabled={apiInProgress}
            onClick={() => {
              {
                endpoint ? setDialogOpen(true) : null;
              }
            }}
          >
            {apiInProgress ? (
              <CircularProgress size={24} />
            ) : endpoint ? (
              "Edit endpoint"
            ) : (
              "Add endpoint"
            )}
          </Button>
        </Box>
        {endpoint && (
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            aria-labelledby="Consent to delete endpoint"
          >
            <DialogTitle>{"Are you sure?"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Do you really want to edit this endpoint it may harm already
                created graphs if you changed the url! Proceed with caution!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Disagree</Button>
              <Button onClick={handleFormSubmit} autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </form>
    </>
  );
}

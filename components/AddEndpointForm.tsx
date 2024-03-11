import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField
} from "@mui/material";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { testConnection } from "@/lib/workWithEndpoint";

import { useUserContext } from "./UserContext";

interface Form {
  url: string;
  apiKey: string;
}

export default function AddEndpointForm() {
  const [apiInProgress, setApiInProgress] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useUserContext();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      url: "",
      apiKey: ""
    },
    mode: "onBlur"
  });
  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit: SubmitHandler<Form> = async (data) => {
    try {
      setApiInProgress(true);
      const endpoint = {
        url: data.url,
        apiKey: data.apiKey
      };
      const workingConnection = await testConnection(endpoint);
      if (!workingConnection) {
        throw new Error("Cant establish connection to endpoit!");
      }
      const res = await fetch("api/endpoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ endpoint: endpoint, user: user })
      });
      const resJson = await res.json();
      if (res.ok) {
        reset();
      } else {
        throw new Error(resJson.message);
      }
    } catch (error: any) {
      setError(error.message || "Internal server error");
      setOpen(true);
    } finally {
      setApiInProgress(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        minWidth="280px"
        sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
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
              type={"password"}
              variant="outlined"
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
          type="submit"
          variant="contained"
          sx={{ width: "100%" }}
          disabled={apiInProgress}
        >
          {apiInProgress ? <CircularProgress size={24} /> : "Add endpoint"}
        </Button>
      </Box>
    </form>
  );
}

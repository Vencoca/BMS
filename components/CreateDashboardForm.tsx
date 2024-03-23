import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { useUserContext } from "./UserContext";

interface Form {
  name: string;
}

export default function CreateDashboardForm() {
  const [apiInProgress, setApiInProgress] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useUserContext();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: ""
    },
    mode: "onBlur"
  });
  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit: SubmitHandler<Form> = async (data) => {
    try {
      setApiInProgress(true);
      const dashboard = {
        name: data.name
      };
      const res = await fetch("/api/dashboards/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ dashboard: dashboard, user: user })
      });
      const resJson = await res.json();
      if (res.ok) {
        router.replace(`dashboard/${resJson.dashboardId}`);
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

  return (
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
          {apiInProgress ? <CircularProgress size={24} /> : "Create dashboard"}
        </Button>
      </Box>
    </form>
  );
}

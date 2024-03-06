import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface Form {
  email: string;
  password: string;
}

export default function RegisterFrom() {
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  const router = useRouter();
  const handleClose = () => {
    setOpen(false);
  };
  const onSubmit: SubmitHandler<Form> = async (data) => {
    setRegistering(true);
    try {
      const res = await fetch("api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resJson = await res.json();
      if (res.ok) {
        reset();
        router.replace("/login");
      } else if (resJson.message === "User alredy exists") {
        setError("User alredy exists");
        setOpen(true);
      } else {
        setError("User registration failed");
        setOpen(true);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
    setRegistering(false);
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
            required: { value: true, message: "Name is required!" },
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
          name="email"
          control={control}
          rules={{
            required: { value: true, message: "Email is required!" },
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email format!" },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              error={errors["email"] && true}
              label={errors["email"]?.message || "E-mail"}
              variant="outlined"
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: { value: true, message: "Password is required!" },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              error={errors["password"] && true}
              label={errors["password"]?.message || "Password"}
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
          disabled={registering}
        >
          {registering ? <CircularProgress size={24} /> : "Register"}
        </Button>
      </Box>
    </form>
  );
}

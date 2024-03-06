"use client";

import { Alert, Box, Button, Snackbar, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface Form {
  email: string;
  password: string;
}

export default function RegisterFrom() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit: SubmitHandler<Form> = async (data: Form) => {
    const { email, password } = data;
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid Credentials");
        setOpen(true);
        return;
      }
      router.replace("dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        minWidth="280px"
        sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="E-mail" variant="outlined" />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
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
        <Button type="submit" variant="contained" sx={{ width: "100%" }}>
          Login
        </Button>
      </Box>
    </form>
  );
}

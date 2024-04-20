"use client";

import { Box, Link, Typography } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";

import AuthCard from "@/components/AuthCard";
import RegisterFrom from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      width="100vw"
    >
      <AuthCard>
        <RegisterFrom></RegisterFrom>
        <Typography variant="body1" component="p" textAlign={"center"}>
          Already have an account?&nbsp;
          <Link component={NextLink} href="/login" underline="hover">
            {"Login"}
          </Link>
        </Typography>
      </AuthCard>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: "-1"
        }}
      >
        <Image
          width={1920}
          height={1080}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
          src="/loginBackground.jpg"
          alt="Building"
        ></Image>
      </Box>
    </Box>
  );
}

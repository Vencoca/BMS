"use client";

import { Box, Link, Typography } from "@mui/material";
import NextLink from "next/link";

import { useUserContext } from "@/components/context/UserContext";

export default function Home() {
  const { endpoints } = useUserContext();
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="calc(100vh - 64px)"
      height="100%"
      width="100%"
    >
      <Box
        bgcolor={"white"}
        padding="32px"
        display={"flex"}
        flexDirection={"column"}
        gap={"16px"}
      >
        <Typography variant="h3" component="h1" textAlign={"center"}>
          Welcome to FacilitIQ
        </Typography>
        {endpoints ? (
          <Typography variant="body1" component="p" textAlign={"center"}>
            To continue, click{" "}
            <Link href="/dashboard" component={NextLink} underline="hover">
              {"here"}
            </Link>{" "}
            to add a dashboard.
          </Typography>
        ) : (
          <Typography variant="body1" component="p" textAlign={"center"}>
            To continue, click{" "}
            <Link href="/endpoint" component={NextLink} underline="hover">
              {"here"}
            </Link>{" "}
            to add an endpoint.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

"use client";

import { Box, Link, Typography } from "@mui/material";
import NextLink from "next/link";

export default function Home() {
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
        <Typography variant="h3" component="h1">
          Welcome to FacilitIQ
        </Typography>
        <Typography variant="body1" component="p">
          To continue into creating dashboard click{" "}
          <Link href="/dashboard" component={NextLink} underline="hover">
            {"here"}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

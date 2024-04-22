"use client";

import "@/app/globals.css";

import { Box } from "@mui/material";

import Nav from "@/components/menu/Nav";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <Box
        sx={{
          mt: 8,
          zIndex: 1,
          position: "relative",
          minHeight: "calc(100vh - 64px)",
          height: "100%",
          minWidth: "100%"
        }}
      >
        {children}
      </Box>
    </>
  );
}

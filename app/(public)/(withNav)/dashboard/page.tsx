"use client";

import { Box, Divider } from "@mui/material";

import CreateDashboardForm from "@/components/forms/CreateDashboardForm";

export default function DashboardOverview() {
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
      minHeight="calc(100vh - 64px)"
    >
      <Box
        bgcolor={"white"}
        padding="32px"
        display={"flex"}
        flexDirection={"column"}
        gap={"16px"}
      >
        <Divider>Create new dashboard</Divider>
        <Box>
          <CreateDashboardForm></CreateDashboardForm>
        </Box>
      </Box>
    </Box>
  );
}

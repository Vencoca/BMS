"use client";

import { Box, Divider } from "@mui/material";

import AddEndpointForm from "@/components/forms/AddEndpointForm";

export default function Endpoint() {
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
      width="100%"
      minHeight="calc(100vh - 64px)"
    >
      <Box
        bgcolor={"white"}
        padding="32px"
        display={"flex"}
        flexDirection={"column"}
        gap={"16px"}
      >
        <Divider>Add new endpoint</Divider>
        <Box>
          <AddEndpointForm></AddEndpointForm>
        </Box>
      </Box>
    </Box>
  );
}

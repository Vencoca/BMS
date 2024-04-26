"use client";

import { Box, Divider } from "@mui/material";

import GraphForm from "@/components/forms/GraphForm";

type graphPageProps = {
  params: { dashboardId: string };
};

export default function GraphPage({ params }: graphPageProps) {
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
        <Divider>Create new Graph</Divider>
        <Box>
          <GraphForm {...{ dashboardId: params.dashboardId }} />
        </Box>
      </Box>
    </Box>
  );
}

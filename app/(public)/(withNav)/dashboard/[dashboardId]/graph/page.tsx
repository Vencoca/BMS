"use client";

import { Box, Divider } from "@mui/material";
import Image from "next/image";

import GraphForm from "@/components/forms/GraphForm";
import LogoutButton from "@/components/LogoutButton";
import { UserInfo } from "@/components/UserInfo";

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
        <UserInfo></UserInfo>
        <LogoutButton></LogoutButton>
        <Divider>Create new Graph</Divider>
        <Box>
          <GraphForm {...{ dashboardId: params.dashboardId }} />
        </Box>
      </Box>
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

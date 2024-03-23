"use client";

import { Box, Divider } from "@mui/material";
import Image from "next/image";

import CreateGraphForm from "@/components/CreateGraphForm";
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
      minHeight="100vh"
      width="100vw"
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
          <CreateGraphForm {...{ dashboardId: params.dashboardId }} />
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

"use client";

import { Box } from "@mui/material";
import Image from "next/image";

import AddEndpointForm from "@/components/AddEndpointForm";
import Graphs from "@/components/Graphs";
import LogoutButton from "@/components/LogoutButton";
import { UserInfo } from "@/components/UserInfo";

export default function Dashboard() {
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
        <Box>
          <AddEndpointForm></AddEndpointForm>
        </Box>
        <Box>
          <Graphs></Graphs>
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

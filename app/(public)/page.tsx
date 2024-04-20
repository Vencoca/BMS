"use client";

import { Box, Link, Typography } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";

import AddEndpointForm from "@/components/forms/AddEndpointForm";
import LogoutButton from "@/components/LogoutButton";
import { UserInfo } from "@/components/UserInfo";

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
          Welcome to BMS
        </Typography>
        <UserInfo></UserInfo>
        <LogoutButton></LogoutButton>
        <Box>
          <AddEndpointForm></AddEndpointForm>
        </Box>
        <Typography variant="body1" component="p">
          To continue into creating dashboard click{" "}
          <Link href="/dashboard" component={NextLink} underline="hover">
            {"here"}
          </Link>
        </Typography>
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

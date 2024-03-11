"use client";

import { Box, Typography } from "@mui/material";
import Image from "next/image";

import AddEndpointForm from "@/components/AddEndpointForm";
import LogoutButton from "@/components/LogoutButton";
import { useUserContext } from "@/components/UserContext";

export default function Dashboard() {
  const { user } = useUserContext();
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
        <Box>
          <Typography variant="body1" component="p">
            {user?.name}
          </Typography>
          <Typography variant="body1" component="p">
            {user?.email}
          </Typography>
        </Box>
        <LogoutButton></LogoutButton>

        <Box>
          <AddEndpointForm></AddEndpointForm>
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

"use client";

import { Box, Button, Divider, Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useNavContext } from "@/components/context/NavContext";
import { useUserContext } from "@/components/context/UserContext";
import EndpointForm from "@/components/forms/EndpointForm";
import EndpointSettings from "@/components/menu/EndpointSettings";
import { IEndpoint } from "@/models/endpoint";

type dashboardProps = {
  params: { endpointId: string };
};

export default function EndpointPage({ params }: dashboardProps) {
  const [endpoint, setEndpoint] = useState<IEndpoint | null>(null);
  const { endpoints } = useUserContext();
  const { setRightMenu, RightMenu } = useNavContext();
  const router = useRouter();
  useEffect(() => {
    if (!RightMenu) {
      setRightMenu(() => <EndpointSettings endpointId={params.endpointId} />);
    }
  }, [setRightMenu, RightMenu, params.endpointId]);

  useEffect(() => {
    if (endpoints != null) {
      const foundEndpoint = endpoints?.find(
        (endpoint) => endpoint._id === params.endpointId
      );
      if (foundEndpoint) {
        setEndpoint(foundEndpoint);
      } else {
        router.replace(`/`);
      }
    }
  }, [endpoints, params.endpointId, router]);

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
        <Divider>Edit endpoint</Divider>
        <Box>
          {!endpoint ? (
            <Box
              minWidth="280px"
              sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <Skeleton variant="rectangular" width={"100%"} height={56} />
              <Skeleton variant="rectangular" width={"100%"} height={56} />
              <Skeleton variant="rectangular" width={"100%"} height={56} />
              <Button
                type="submit"
                variant="contained"
                sx={{ width: "100%" }}
                disabled={true}
              >
                Edit endpoint
              </Button>
            </Box>
          ) : (
            <EndpointForm endpoint={endpoint}></EndpointForm>
          )}
        </Box>
      </Box>
    </Box>
  );
}

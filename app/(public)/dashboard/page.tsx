"use client"

import Image from "next/image"
import { Box, Link, Typography } from "@mui/material"
import LogoutButton from "@/components/LogoutButton"
import { useSession } from "next-auth/react"


export default function Dashboard() {
    const { data: session } = useSession()
    return (
        <Box position="relative" display="flex" alignItems="center" justifyContent="center" minHeight="100vh" width="100vw">
            <Box bgcolor={"white"} padding="32px">
                <Box marginBottom="16px">
                    <Typography variant="body1" component="p">{session?.user?.name}</Typography>
                    <Typography variant="body1" component="p">{session?.user?.email}</Typography>
                </Box>
                <LogoutButton></LogoutButton>
            </Box>
            <Box sx={{ position: "absolute", width: "100%", height: "100%", zIndex: "-1" }}>
                <Image width={1920} height={1080} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} src='/loginBackground.jpg' alt="Building"></Image>
            </Box>
        </Box>
    )
}
"use client"

import AuthCard from "@/components/AuthCard"
import Image from "next/image"
import LoginFrom from "@/components/LoginForm"
import { Box, Link, Typography } from "@mui/material"
import NextLink from "next/link"


export default function LoginPage() {
    return (
        <Box position="relative" display="flex" alignItems="center" justifyContent="center" minHeight="100vh" width="100vw">
            <AuthCard>
                <LoginFrom></LoginFrom>
                <Typography variant="body1" component="p" textAlign={"center"}>Dont have an account?&nbsp;
                    <Link href="/register" component={NextLink} underline="hover">
                        {"Register"}
                    </Link>
                </Typography>
            </AuthCard>
            <Box sx={{ position: "absolute", width: "100%", height: "100%", zIndex: "-1" }}>
                <Image width={1920} height={1080} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} src='/loginBackground.jpg' alt="Building"></Image>
            </Box>
        </Box>
    )
}
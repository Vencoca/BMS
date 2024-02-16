"use client"

import AuthCard from "@/components/AuthCard"
import Image from "next/image"
import { Box, Link, Typography } from "@mui/material"
import RegisterFrom from "@/components/RegisterForm"
import NextLink from "next/link"

export default function RegisterPage() {
    return (
        <Box position="relative" display="flex" alignItems="center" justifyContent="center" minHeight="100vh" width="100vw">
            <AuthCard>
                <RegisterFrom></RegisterFrom>
                <Typography variant="body1" component="p" textAlign={"center"}>Already have an account?&nbsp;
                    <NextLink href="/login"><Link underline="hover">
                        {"Singup"}
                    </Link></NextLink>
                </Typography>
            </AuthCard>
            <Box sx={{ position: "absolute", width: "100%", height: "100%", zIndex: "-1" }}>
                <Image width={1920} height={1080} style={{display:"block", width:"100%", height:"100%", objectFit:"cover"}} src='/loginBackground.jpg' alt="Building"></Image>
            </Box>
        </Box>
    )
}
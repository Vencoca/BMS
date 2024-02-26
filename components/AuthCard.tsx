"use client"

import { Divider, Link, Paper, Typography } from "@mui/material";
import LoginWithButton from "./LoginWithButton";
import LoginFrom from "./LoginForm";
import { ReactNode } from "react";

export default function AuthCard({children}: {children?: ReactNode},) {
    return (
        <Paper elevation={20} sx={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px", margin:"32px"}}>
            <Typography variant="h3" component="h1" textAlign={"center"}>BMS</Typography>
            {children}
            <Divider>OR</Divider>
            <LoginWithButton provider='google' text='Login with google' imageSrc='/google.svg' callbackUrl={"/dashboard"}></LoginWithButton>
        </Paper>
    )
}
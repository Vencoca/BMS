"use client"

import { Box, useTheme } from "@mui/material";
import React, { ReactNode } from "react";
import Sidebar, { DrawerHeader } from "./Sidebar";
import TopBar from "./TopBar";

export default function MainLayout({ children }: { children?: ReactNode }) {
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = React.useState(false);

    function openDrawerHandler() {
        setOpenDrawer(true);
    }

    function closeDrawerHandler() {
        setOpenDrawer(false);
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={openDrawer} buttonOnClick={closeDrawerHandler} theme={theme}></Sidebar>
            <TopBar open={openDrawer} buttonOnClick={openDrawerHandler}></TopBar>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    )
}

"use client"

import { Box, useTheme } from "@mui/material";
import React, { ReactNode, useState } from "react";
import Sidebar, { DrawerHeader } from "./Sidebar";
import TopBar from "./TopBar";
import UserContext from "./UserContext";

export default function MainLayout({ children, user }: { children?: ReactNode, user: any }) {
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = useState(false);

    function openDrawerHandler() {
        setOpenDrawer(true);
    }

    function closeDrawerHandler() {
        setOpenDrawer(false);
    }
    return (
        <UserContext.Provider value={{ user: user }}>
            <Box sx={{ display: 'flex' }}>
                <Sidebar open={openDrawer} buttonOnClick={closeDrawerHandler} theme={theme}></Sidebar>
                <TopBar open={openDrawer} buttonOnClick={openDrawerHandler}></TopBar>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <DrawerHeader />
                    {user ? (
                        children
                    ) : (
                        <p>You must be logged in to see the content</p>
                    )}
                </Box>
            </Box>
        </UserContext.Provider>
    )
}

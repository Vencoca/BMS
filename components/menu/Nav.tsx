"use client";

import AccountCircle from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import TimelineIcon from "@mui/icons-material/Timeline";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

import DashboardsList from "@/components/menu/DashboardsList";
import EndpointsList from "@/components/menu/EndpointsList";

import { useNavContext } from "../context/NavContext";
import { useUserContext } from "../context/UserContext";

export default function Nav() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUserContext();
  const { RightMenu } = useNavContext();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pathname = usePathname();
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setSidebarOpen(true)}
            sx={{ mr: 2, height: "64px" }}
          >
            <MenuIcon />
          </IconButton>
          <Link href={"/"} component={NextLink}>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <Image
                src="/iconWhite.png"
                alt="facilitIQ"
                width={32}
                height={32}
                style={{ height: "100%", width: "auto", objectFit: "contain" }}
              ></Image>
              <Typography variant="h6" color={"white"}>
                FacilitIQ
              </Typography>
            </Box>
          </Link>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              minWidth: "96px"
            }}
          >
            {RightMenu}
            <Box>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled={true}>{user?.name}</MenuItem>
                <Divider />
                <MenuItem onClick={() => signOut()}>Logout</MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={"left"}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{
          keepMounted: true
        }}
      >
        <List sx={{ minWidth: 200 }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
              mb: 1
            }}
          >
            <IconButton
              size="large"
              color="inherit"
              aria-label="close menu"
              onClick={() => setSidebarOpen(false)}
              sx={{ mr: 1 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider></Divider>
          <ListItemButton href="/dashboard" component={NextLink}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={"Create Dashboard"} />
          </ListItemButton>
          <ListItemButton href="/graph" component={NextLink}>
            <ListItemIcon>
              <TimelineIcon />
            </ListItemIcon>
            <ListItemText primary={"Create Graph"} />
          </ListItemButton>
          <ListItemButton href="/endpoint" component={NextLink}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary={"Add Endpoint"} />
          </ListItemButton>
          <Divider></Divider>
          <ListItem disablePadding>
            <DashboardsList></DashboardsList>
          </ListItem>
          <Divider></Divider>
          <ListItem disablePadding>
            <EndpointsList></EndpointsList>
          </ListItem>
          <Divider></Divider>
        </List>
      </Drawer>
      <Image
        width={1920}
        height={1080}
        style={{
          display: "block",
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          position: "fixed"
        }}
        src="/loginBackground.jpg"
        alt="Building"
      ></Image>
    </>
  );
}

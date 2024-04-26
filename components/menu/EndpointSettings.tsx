"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from "@mui/material";
import { useState } from "react";

import { useUserContext } from "../context/UserContext";

export default function EndpointSettings({
  endpointId
}: {
  endpointId: string;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const { user, setEndpoints } = useUserContext();

  function handleDialogOpen() {
    setDialogOpen(true);
    handleClose();
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/endpoints/endpoint/${endpointId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user?._id
        })
      });
      if (res.ok) {
        setEndpoints((endpoints) => {
          return endpoints!.filter((item) => item._id !== endpointId);
        });
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem disabled={true}>Endpoint Settings</MenuItem>
        <Divider />
        <ListItemButton onClick={handleDialogOpen}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary={"Delete Endpoint"} />
        </ListItemButton>
      </Menu>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="Consent to delete endpoint"
      >
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to delete this endpoints and all graphs where its
            used?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Disagree</Button>
          <Button onClick={handleDelete} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

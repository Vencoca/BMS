"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import TimelineIcon from "@mui/icons-material/Timeline";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Switch
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useNavContext } from "../context/NavContext";
import { useUserContext } from "../context/UserContext";

export default function DashboardSettings({
  dashboardId
}: {
  dashboardId: string;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const { editable, setEditable, data } = useNavContext();
  const router = useRouter();
  const { setDashboards } = useUserContext();

  async function handleEditableSwitch() {
    setEditable(() => !editable);
    setTimeout(handleClose, 400);
    if (editable && data.current.layout) {
      try {
        const res = await fetch("/api/layout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            graphs: data.current.graphs,
            layout: data.current.layout
          })
        });
        if (res.ok) {
          console.log("Update layout done");
        } else {
          console.log("Something went wrong");
        }
      } catch (error) {
        console.log(error);
      }

      data.current.layout = null;
    }
  }

  function handleDialogOpen() {
    setDialogOpen(true);
    handleClose();
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/dashboards/dashboard/${dashboardId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        setDashboards((dashboards) => {
          return dashboards!.filter((item) => item._id !== dashboardId);
        });
        router.replace(`/dashboard`);
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
        <MenuItem disabled={true}>Dashboard Settings</MenuItem>
        <Divider />
        <MenuItem>
          <FormControlLabel
            checked={editable}
            onChange={() => handleEditableSwitch()}
            control={<Switch />}
            label="Editable"
          />
        </MenuItem>
        <ListItemButton href="./graph" component={NextLink}>
          <ListItemIcon>
            <TimelineIcon />
          </ListItemIcon>
          <ListItemText primary={"Create Graph"} />
        </ListItemButton>
        <ListItemButton onClick={handleDialogOpen}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary={"Delete dashboard"} />
        </ListItemButton>
      </Menu>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="Consent to delete dashboard"
      >
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to delete this dashboard and all its graphs?
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

"use client";

import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Divider,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Switch
} from "@mui/material";
import { useState } from "react";

import { useNavContext } from "../context/NavContext";

export default function DashboardSettings() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const { editable, setEditable, data } = useNavContext();

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

  const handleClose = () => {
    setAnchorEl(null);
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
      </Menu>
    </Box>
  );
}

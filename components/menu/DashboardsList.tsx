import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";

import { IDashboard } from "@/models/dashboard";

import { useUserContext } from "../context/UserContext";

export default function DashboardsList() {
  const { dashboards } = useUserContext();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary="Dashboards" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open}>
        <List sx={{ width: "100%" }}>
          {dashboards === null ? (
            <Skeleton variant="rectangular" width={"100%"} height={120} />
          ) : (
            dashboards?.map(
              (dashboard: IDashboard) =>
                dashboard && (
                  <ListItem key={dashboard._id} disablePadding>
                    <ListItemButton
                      href={`/dashboard/${dashboard._id}`}
                      component={Link}
                      sx={{ width: "100%" }}
                    >
                      {dashboard.name}
                    </ListItemButton>
                  </ListItem>
                )
            )
          )}
        </List>
      </Collapse>
    </Box>
  );
}

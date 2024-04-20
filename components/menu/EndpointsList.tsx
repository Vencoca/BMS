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

import { IEndpoint } from "@/models/endpoint";

import { useUserContext } from "../context/UserContext";

export default function EndpointsList() {
  const { endpoints } = useUserContext();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary="Endpoints" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open}>
        <List sx={{ width: "100%" }}>
          {endpoints === null ? (
            <Skeleton variant="rectangular" width={"100%"} height={120} />
          ) : (
            endpoints?.map(
              (endpoint: IEndpoint) =>
                endpoint && (
                  <ListItem key={endpoint._id} disablePadding>
                    <ListItemButton
                      href={`/endpoints/${endpoint._id}`}
                      component={Link}
                      sx={{
                        width: "100%",
                        textOverflow: "ellipsis",
                        maxWidth: "350px",
                        textWrap: "nowrap",
                        overflow: "hidden",
                        display: "block"
                      }}
                    >
                      {endpoint.name || endpoint.url}
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

import { Box, Typography } from "@mui/material";

import { useUserContext } from "./context/UserContext";

export function UserInfo() {
  const { user } = useUserContext();
  return (
    <Box>
      <Typography variant="body1" component="p">
        {user?.name}
      </Typography>
      <Typography variant="body1" component="p">
        {user?.email}
      </Typography>
    </Box>
  );
}

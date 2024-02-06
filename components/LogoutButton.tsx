import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return <Button onClick={(e) => { e.preventDefault(); signOut(); }} variant="contained" href="#contained-buttons">
        Logout
    </Button>
}
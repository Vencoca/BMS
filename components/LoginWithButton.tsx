import { Button } from "@mui/material";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface LoginWithButtonProps {
    provider: string,
    callbackUrl: string,
    text: string,
    imageSrc: string,
}

export default function LoginWithButton({ provider, callbackUrl, text, imageSrc }: LoginWithButtonProps) {
    return (
        <Button onClick={(e) => {e.preventDefault();signIn(provider, { callbackUrl });}} variant="contained" href="#contained-buttons">
            <Image width={16} height={16} style={{marginRight:'8px'}} src={imageSrc} alt={`${text} icon`}></Image>
            {text}
        </Button>
    )
}
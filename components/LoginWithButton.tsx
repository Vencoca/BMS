"use client";
import { Button } from "@mui/material";
import Image from "next/image";
import { signIn } from "next-auth/react";

interface LoginWithButtonProps {
  provider: string;
  callbackUrl: string;
  text: string;
  imageSrc: string;
}

export default function LoginWithButton({
  provider,
  callbackUrl,
  text,
  imageSrc,
}: LoginWithButtonProps) {
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        signIn(provider, { callbackUrl });
      }}
      variant="contained"
      sx={{ width: "100%" }}
    >
      <Image
        width={16}
        height={16}
        style={{ marginRight: "8px" }}
        src={imageSrc}
        alt={`${text} icon`}
      ></Image>
      {text}
    </Button>
  );
}

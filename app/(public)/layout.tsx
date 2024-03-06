import "@/app/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { CssBaseline } from "@mui/material";
import type { Metadata } from "next";
import Head from "next/head";

import { AuthProvider } from "@/components/Providers";

export const metadata: Metadata = {
  title: "BMS",
  description: "Building managment system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

import "@/app/globals.css";

import { CssBaseline } from "@mui/material";
import type { Metadata } from "next";
import Head from "next/head";

import { AuthContext } from "@/components/context/AuthContext";
import { NavCtxProvider } from "@/components/context/NavContext";
import { UserCtxProvider } from "@/components/context/UserContext";

export const metadata: Metadata = {
  title: "FacilitIQ",
  description:
    "FacilitIQ: Revolutionizing Building Management. Optimize efficiency, comfort, and security with our intelligent BMS solution. Experience the future of facility management today!"
};

export default function RootLayout({
  children
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
        <AuthContext>
          <UserCtxProvider>
            <NavCtxProvider>{children}</NavCtxProvider>
          </UserCtxProvider>
        </AuthContext>
      </body>
    </html>
  );
}

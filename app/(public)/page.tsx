import { getServerSession } from "next-auth";
import { use } from "react";

import Graphs from "@/components/Graphs";
import MainLayout from "@/components/MainLayout";
import { authOptions } from "@/lib/auth";

async function getUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export default function Home() {
  const user = use(getUser());
  return (
    <MainLayout user={user}>
      <Graphs></Graphs>
    </MainLayout>
  );
}

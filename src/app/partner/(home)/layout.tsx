"use client";
import { MouseEvent } from "react";

import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { redirect, useRouter } from "next/navigation";

import { useSession } from "@/context/authenticationContext";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const session = useSession();
  if (!session) redirect("/partner/login");
  return (
    <DashboardLayout
      slotProps={{
        toolbarAccount: {
          slotProps: {
            signInButton: {
              onClick: (event: MouseEvent) => {
                event.preventDefault();
                router.push("/partner/login");
              },
            },
            signOutButton: {
              color: "secondary",
              onClick: (e) => {
                e.preventDefault();
                localStorage.removeItem("accessToken");
                localStorage.removeItem("profile");
                router.push("/partner/login");
              },
            },
          },
        },
      }}
    >
      {children}
    </DashboardLayout>
  );
};
export default Layout;

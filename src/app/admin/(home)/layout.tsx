"use client"
import { MouseEvent } from "react";

import { DashboardLayout } from "@toolpad/core";
import { useRouter } from "next/navigation";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  return (
    <DashboardLayout
      slotProps={{
        toolbarAccount: {
          slotProps: {
            signInButton: {
              onClick: (event: MouseEvent) => {
                event.preventDefault();
                router.push("/admin/login");
              },
            },
            signOutButton: {
              color: "secondary",
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

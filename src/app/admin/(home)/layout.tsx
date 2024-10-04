"use client"
import { MouseEvent, useContext } from "react";

import { AuthenticationContext, DashboardLayout } from "@toolpad/core";
import { useRouter } from "next/navigation";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const authentication = useContext(AuthenticationContext)
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
              onClick: () => {
                authentication?.signOut();
                router.push("/logout");
              }
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

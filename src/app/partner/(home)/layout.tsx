"use client";
import { MouseEvent, useContext } from "react";

import { AuthenticationContext } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useRouter } from "next/navigation";


const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const authentication = useContext(AuthenticationContext);
  const router = useRouter();
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
                authentication?.signOut()
                router.push("/logout");
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

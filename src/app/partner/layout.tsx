"use client";
import { MouseEvent, useContext } from "react";

import { Build, Dashboard } from "@mui/icons-material";
import { AuthenticationContext, Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/nextjs";
import { useRouter } from "next/navigation";

import { constants } from "@/constants";
import { SessionProvider, useSession } from "@/context/authenticationContext";
import { partnerTheme } from "@/themes/partner";
const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "home",
  },
  {
    segment: "partner",
    title: "Dashboard",
    icon: <Dashboard />,
  },
  {
    segment: "partner/parkinglocation",
    title: "Parking location",
    icon: <Build />,
  },
];

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const authentication = useContext(AuthenticationContext);
  const session = useSession();
  const router = useRouter();
  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={partnerTheme}
      authentication={authentication}
      branding={{
        title: constants.PROJECT_NAME,
        logo: "",
      }}
      session={session}
    >
      <SessionProvider>
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
                },
              },
            },
          }}
        >
          {children}
        </DashboardLayout>
      </SessionProvider>
    </AppProvider>
  );
};
export default Layout;

"use client";
import { useContext } from "react";

import { Build, Dashboard } from "@mui/icons-material";
import { DialogsProvider, NotificationsProvider } from "@toolpad/core";
import { AuthenticationContext, Navigation } from "@toolpad/core/AppProvider";
import { AppProvider } from "@toolpad/core/nextjs";

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
      <NotificationsProvider>
        <DialogsProvider>
          <SessionProvider>{children}</SessionProvider>
        </DialogsProvider>
      </NotificationsProvider>
    </AppProvider>
  );
};
export default Layout;

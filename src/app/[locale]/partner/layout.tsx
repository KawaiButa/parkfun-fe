"use client";
import { Suspense, useContext } from "react";

import { Book, Build, CarCrash, Dashboard } from "@mui/icons-material";
import { DialogsProvider, NotificationsProvider } from "@toolpad/core";
import { AuthenticationContext, Navigation } from "@toolpad/core/AppProvider";
import { AppProvider } from "@toolpad/core/nextjs";

import { constants } from "@/constants";
import { SessionProvider, useSession } from "@/context/authenticationContext";
import { partnerTheme } from "@/themes/partner";
const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Home",
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
  {
    segment: "partner/parkingslot",
    title: "Parking slot",
    icon: <CarCrash />,
  },
  {
    segment: "partner/booking",
    title: "Booking",
    icon: <Book />,
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
    <Suspense>
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
    </Suspense>
  );
};
export default Layout;

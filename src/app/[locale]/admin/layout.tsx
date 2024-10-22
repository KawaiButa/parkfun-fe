"use client";
import { Suspense, useContext } from "react";

import { BarChart, Dashboard, Description, Layers, Person } from "@mui/icons-material";
import { NotificationsProvider } from "@toolpad/core";
import { AuthenticationContext, Navigation } from "@toolpad/core/AppProvider";
import { AppProvider } from "@toolpad/core/nextjs";

import { constants } from "@/constants";
import { useSession } from "@/context/authenticationContext";
import { adminTheme } from "@/themes/admin";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main menu",
  },
  {
    segment: "admin/dashboard",
    title: "Dashboard",
    icon: <Dashboard />,
  },
  {
    segment: "en/admin/partners",
    title: "Partners",
    icon: <Person />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChart />,
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <Description />,
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <Description />,
      },
    ],
  },
  {
    segment: "integrations",
    title: "Integrations",
    icon: <Layers />,
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
        theme={adminTheme}
        authentication={authentication}
        branding={{
          title: constants.PROJECT_NAME,
          logo: "",
        }}
        session={session}
      >
        <NotificationsProvider>{children}</NotificationsProvider>
      </AppProvider>
    </Suspense>
  );
};
export default Layout;

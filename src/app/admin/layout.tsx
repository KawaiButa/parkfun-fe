"use client";
import { useContext } from "react";

import { BarChart, Dashboard, Description, Layers } from "@mui/icons-material";
import { AuthenticationContext, Navigation } from "@toolpad/core/AppProvider";
import { AppProvider } from "@toolpad/core/nextjs";

import { constants } from "@/constants";
import { SessionProvider, useSession } from "@/context/authenticationContext";
import { adminTheme } from "@/themes/admin";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main menu",
  },
  {
    segment: "admin",
    title: "Dashboard",
    icon: <Dashboard />,
  },
  {
    segment: "admin/partner",
    title: "Partners",
    icon: <Dashboard />,
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
      <SessionProvider>
        {children}
      </SessionProvider>
    </AppProvider>
  );
};
export default Layout;

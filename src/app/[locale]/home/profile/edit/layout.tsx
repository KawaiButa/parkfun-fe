import { BarChart, Dashboard, Description, Layers } from "@mui/icons-material";
import { Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/nextjs";

import { constants } from "@/constants";

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
  segment: "admin/partners",
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

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AppProvider navigation={NAVIGATION} theme={adminTheme} branding={{
      title: constants.PROJECT_NAME,
      logo: ""
    }}>
      <DashboardLayout>{children}</DashboardLayout>
    </AppProvider>
  );
};
export default layout;

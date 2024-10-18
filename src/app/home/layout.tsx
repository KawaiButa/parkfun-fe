"use client";

import { Stack } from "@mui/material";
import { DialogsProvider, NotificationsProvider } from "@toolpad/core";

import NavigationBar from "@/components/NavigationBar/navigationBar";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <DialogsProvider>
      <NotificationsProvider>
        <Stack direction="column" maxHeight="100vh">
          <NavigationBar />
          {children}
        </Stack>
      </NotificationsProvider>
    </DialogsProvider>
  );
};

export default AuthLayout;

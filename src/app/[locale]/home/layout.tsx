"use client";

import { Stack } from "@mui/material";
import { DialogsProvider, NotificationsProvider } from "@toolpad/core";

import NavigationBar from "@/components/NavigationBar/navigationBar";
import { LocationContextProvider } from "@/context/locationContext";
const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <DialogsProvider>
      <NotificationsProvider>
        <LocationContextProvider>
          <Stack direction="column" maxHeight="100vh">
            <NavigationBar />
            {children}
          </Stack>
        </LocationContextProvider>
      </NotificationsProvider>
    </DialogsProvider>
  );
};

export default AuthLayout;

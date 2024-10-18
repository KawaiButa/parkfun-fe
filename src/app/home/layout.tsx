"use client";

import { Suspense } from "react";

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
    <Suspense>
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
    </Suspense>
  );
};

export default AuthLayout;

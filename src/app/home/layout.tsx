"use client";

import { Stack } from "@mui/material";
import { DialogsProvider } from "@toolpad/core";

import NavigationBar from "@/components/NavigationBar/navigationBar";
const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <DialogsProvider>
      <Stack direction="column" maxHeight="100vh">
        <NavigationBar />
        {children}
      </Stack>
    </DialogsProvider>
  );
};

export default AuthLayout;

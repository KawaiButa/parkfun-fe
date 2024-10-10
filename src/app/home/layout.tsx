"use client";

import { Stack } from "@mui/material";

import NavigationBar from "@/components/NavigationBar/navigationBar";
const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Stack direction="column" maxHeight="100vh">
      <NavigationBar />
      {children}
    </Stack>
  );
};

export default AuthLayout;

"use client";

import NavigationBar from "@/components/NavigationBar/navigationBar";
const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
};

export default AuthLayout;

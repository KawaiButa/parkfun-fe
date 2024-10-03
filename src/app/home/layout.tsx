"use client";


import NavigationBar from "@/components/NavigationBar/navigationBar";
import { useProfile } from "@/context/profileContext";
const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const {profile} = useProfile();
  return (
    <>
    {!profile && <NavigationBar/>}{children} </>
  );
};

export default AuthLayout;

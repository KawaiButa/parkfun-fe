"use client";
import { Suspense, useEffect, useState } from "react";

import { Tab, Tabs, Typography } from "@mui/material";
import { NotificationsProvider } from "@toolpad/core";
import { useRouter } from "next/navigation";

import ContainerFlexColumn from "@/components/containerFlexColumn/containerFlexColumn";
import NavigationBar from "@/components/NavigationBar/navigationBar";
import { useSession } from "@/context/authenticationContext";
const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [value, setValue] = useState("login");
  const label = value === "login" ? "Login" : "Sign up";
  const router = useRouter();
  const session = useSession();
  useEffect(() => {
    if (window.location.href.includes("login")) setValue("login");
    else setValue("signup");
  }, []);

  return (
    <Suspense>
      <NotificationsProvider>
        {!session && <NavigationBar />}
        <ContainerFlexColumn
          maxWidth="sm"
          sx={{
            marginTop: "30px",
            backgroundColor: "background.default",
            padding: "30px",
            borderRadius: "10px",
            gap: "20px",
          }}
          disableGutters
        >
          <Typography variant="h4" color="primary" align="center" fontWeight="600">
            {label}
          </Typography>
          <Tabs
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              router.replace(
                `/auth/${newValue}?${typeof window !== "undefined" ? (window.location.href.split("?")[1] ?? "") : ""}`
              );
            }}
            textColor="secondary"
            indicatorColor="primary"
            variant="fullWidth"
            centered
          >
            <Tab
              value="login"
              label="Login"
              sx={{
                "&.Mui-selected": {
                  color: "primary.main",
                },
                fontSize: "20px",
              }}
            />
            <Tab
              value="signup"
              label="Sign up"
              sx={{
                "&.Mui-selected": {
                  color: "primary.main",
                },
                fontSize: "20px",
              }}
            />
          </Tabs>
          <div className="auth">{children}</div>
        </ContainerFlexColumn>
      </NotificationsProvider>
    </Suspense>
  );
};

export default AuthLayout;

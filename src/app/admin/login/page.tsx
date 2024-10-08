"use client";
import React, { useContext, useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import { Container } from "@mui/material";
import { AuthProvider, SignInPage, AuthenticationContext, useNotifications } from "@toolpad/core";

import { loginWithEmailAndPassword } from "@/utils/authentication";

const providers: AuthProvider[] = [{ id: "credentials", name: "Email and Password" }];
const AdminLogin = () => {
  const authentication = useContext(AuthenticationContext);
  const notification = useNotifications();
  const [loading, setLoading] = useState(false);
  function handleSignIn(provider: AuthProvider, formData?: FormData): void {
    setLoading(true);
    if (!formData) return;
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    if (!(email && password)) return;
    loginWithEmailAndPassword({ email, password })
      .then(() => {
        if (authentication) {
          authentication.signIn();
          window.location.replace("/admin");
        }
      })
      .catch((err) => {
        notification.show(err.response.data.message, {
          severity: "error",
          autoHideDuration: 2000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Container
      sx={{
        backgroundColor: "secondary.contrastText",
        width: "fit-content",
        borderRadius: "10px",
        "& main div.MuiBox-root.mui-binzgt": {
          padding: "20px 0",
        },
      }}
    >
      <SignInPage
        signIn={handleSignIn}
        providers={providers}
        slotProps={{
          submitButton: {
            sx: {
              fontWeight: "bold",
            },
          },
        }}
        slots={{
          submitButton: () => (
            <LoadingButton loading={loading} fullWidth variant="contained" type="submit">
              Sign in
            </LoadingButton>
          ),
        }}
      />
    </Container>
  );
};

export default AdminLogin;

"use client";
import React, { useContext } from "react";

import { Container } from "@mui/material";
import { AuthProvider, SignInPage, AuthenticationContext, useNotifications } from "@toolpad/core";
import { useRouter } from "next/navigation";

import { loginWithEmailAndPassword } from "@/utils/authentication";

const providers: AuthProvider[] = [{ id: "credentials", name: "Email and Password" }];
const AdminLogin = () => {
  const router = useRouter();
  const authentication = useContext(AuthenticationContext);
  const notification = useNotifications();
  function handleSignIn(provider: AuthProvider, formData?: FormData): void {
    if (!formData) return;
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    if (!(email && password)) return;
    loginWithEmailAndPassword({ email, password })
      .then(() => {
        if (authentication) {
          authentication.signIn();
          router.push("/admin")
        }
      })
      .catch((err) => {
        notification.show(err.response.data.message, {
          severity: "error",
          autoHideDuration: 2000,

        });
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
      />
    </Container>
  );
};

export default AdminLogin;

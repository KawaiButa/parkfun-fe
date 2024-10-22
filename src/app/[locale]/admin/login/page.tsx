"use client";
import React, { useContext } from "react";

import { Container } from "@mui/material";
import { AuthProvider, SignInPage, AuthenticationContext } from "@toolpad/core";
import { useRouter } from "next/navigation";

import { useNotify } from "@/hooks/useNoti";
import { loginWithEmailAndPassword } from "@/utils/authentication";

const providers: AuthProvider[] = [{ id: "credentials", name: "Email and Password" }];
const AdminLogin = () => {
  const router = useRouter();
  const authentication = useContext(AuthenticationContext);
  const {showError} = useNotify()
  function handleSignIn(provider: AuthProvider, formData?: FormData): void {
    if (!formData) return;
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    if (!(email && password)) return;
    loginWithEmailAndPassword({ email, password })
      .then(() => {
        if (authentication) {
          authentication.signIn();
          router.push("/admin");
        }
      })
      .catch((err) => {
        showError(err.response.data.message);
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
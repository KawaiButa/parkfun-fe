"use client";
import { useState } from "react";

import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import { Alert, Button, Container, ContainerOwnProps, Divider, Typography } from "@mui/material";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { LoginFormData } from "@/interfaces/loginFormData";
import { handleLoginWithGoogleSuccess, loginWithEmailAndPassword } from "@/utils/authentication";

import {FormTextInput} from "../formTextInput/formTextInput";

const LoginForm = (props: ContainerOwnProps) => {
  const router = useRouter();
  const [error, setError] = useState("error");
  const { handleSubmit, control } = useForm<LoginFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: LoginFormData) => {
    await loginWithEmailAndPassword(data)
      .then(() => router.push("/"))
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
      <Container
        {...props}
        component={"form"}
        maxWidth="sm"
        sx={{
          ...props.sx,
          backgroundColor: "var(--secondary-color)",
          padding: "30px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Typography variant="h4" color="primary" align="center" fontWeight={"500"}>
          Login
        </Typography>
        <FormTextInput
          label="Email"
          name="email"
          control={control}
          rule={{
            required: "Please enter your email",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          type="email"
        />
        <FormTextInput
          label="Password"
          name="password"
          control={control}
          rule={{
            required: "Please enter your password",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          }}
          type="password"
        />
        <Button
          variant="contained"
          type="submit"
          onClick={handleSubmit(onSubmit)}
          sx={{
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          Login
        </Button>
        <Container sx={{ display: "flex", flexDirection: "column", gap: "10px", padding: "0 !important" }}>
          <Typography
            textAlign={"right"}
            component={"a"}
            href="/register"
            color="var(--secondary-text-color)"
            sx={{
              fontSize: {
                xs: "13px",
                md: "16px",
              },
            }}
          >
            {"Don't have a account? Make it here "}
            <KeyboardDoubleArrowRight
              sx={{
                fontSize: "18px",
                transform: "translateY(3px)",
              }}
            />
          </Typography>
          <Divider
            sx={{
              "&::before, &::after": {
                borderColor: "primary.main",
              },
            }}
          >
            <Typography variant="h5" color="primary">
              {" "}
              or
            </Typography>
          </Divider>
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <GoogleLogin
              width={"50%"}
              auto_select={false}
              shape="rectangular"
              onSuccess={handleLoginWithGoogleSuccess}
              containerProps={{
                style: {
                  width: "fit-content",
                },
              }}
            />
          </Container>
        </Container>
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;

"use client";
import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Container, ContainerOwnProps, Divider, Typography } from "@mui/material";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import {  useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useProfile } from "@/context/profileContext";
import { LoginFormData } from "@/interfaces/loginFormData";
import { handleLoginWithGoogleSuccess, loginWithEmailAndPassword } from "@/utils/authentication";

import { loginValidationSchema } from "./validationSchema";
import ContainerFlexColumn from "../containerFlexColumn/containerFlexColumn";
import { FormTextInput } from "../formTextInput/formTextInput";
import PrimaryContainedButton from "../primaryContainedButton/primaryContainedButton";

const LoginForm = (props: ContainerOwnProps) => {
  const { setProfile } = useProfile();
  const router = useRouter();
  const [error, setError] = useState<string | undefined>(undefined);
  const { handleSubmit, control } = useForm<LoginFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginValidationSchema),
  });
  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginWithEmailAndPassword(data);
      if (res) {
        setProfile(res);
        router.replace("/");
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
      <ContainerFlexColumn
        {...props}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        maxWidth="sm"
        sx={{
          ...props.sx,
          backgroundColor: "var(--secondary-color)",
          padding: "30px",
          borderRadius: "10px",
          gap: "20px",
        }}
      >
        <FormTextInput label="Email" name="email" control={control} outlineColor="primary" type="email" />
        <FormTextInput label="Password" name="password" control={control} outlineColor="primary" type="password" />
        <PrimaryContainedButton
          type="submit"
          sx={{
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          Login
        </PrimaryContainedButton>
        <ContainerFlexColumn sx={{ gap: "10px" }} disableGutters>
          <Divider
            sx={{
              "&::before, &::after": {
                borderColor: "primary.main",
              },
            }}
          >
            <Typography variant="h5" color="primary">
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
              width="50%"
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
        </ContainerFlexColumn>
        {error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
      </ContainerFlexColumn>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;

"use client";
import { useContext, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, CircularProgress, Container, ContainerOwnProps, Divider, styled, Typography } from "@mui/material";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { AuthenticationContext } from "@toolpad/core";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { constants } from "@/constants";
import { LoginFormData } from "@/interfaces/loginFormData";
import { handleLoginWithGoogleSuccess, loginWithEmailAndPassword } from "@/utils/authentication";

import { loginValidationSchema } from "./validationSchema";
import ContainerFlexColumn from "../containerFlexColumn/containerFlexColumn";
import { FormTextInput, FormTextInputProps } from "../formTextInput/formTextInput";
const StypedFormTextInput = styled((props: FormTextInputProps) => (
  <FormTextInput
    slotProps={{
      textField: {
        sx: {
          "& fieldset": {
            borderColor: "secondary.contrastText",
          },
        },
      },
    }}
    {...props}
  />
))();
const LoginForm = (props: ContainerOwnProps) => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const authentication = useContext(AuthenticationContext);
  const [error, setError] = useState<string | undefined>(undefined);
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
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
        authentication?.signIn();
        const redirectUrl = searchParam.get("redirect");
        if (redirectUrl) router.push(redirectUrl);
        else router.replace("/");
      }
    } catch (err) {
      if (err instanceof AxiosError) setError(err.response?.data.message);
      else setError((err as Error).message);
    }
  };
  return (
    <GoogleOAuthProvider clientId={constants.GOOGLE_CLIENT_ID}>
      <ContainerFlexColumn
        {...props}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        maxWidth="sm"
        sx={{
          ...props.sx,
          padding: "30px",
          borderRadius: "10px",
          gap: "20px",
        }}
      >
        <StypedFormTextInput
          label="Email"
          name="email"
          control={control}
          type="email"
          slotProps={{
            textField: {
              sx: {
                "& fieldset": {
                  borderColor: "secondary.contrastText",
                },
              },
            },
          }}
        />
        <StypedFormTextInput label="Password" name="password" control={control} type="password" />
        <LoadingButton
          type="submit"
          sx={{
            fontSize: "20px",
            fontWeight: "600",
          }}
          loadingIndicator={<CircularProgress color="primary" />}
          variant="contained"
          color="primary"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
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

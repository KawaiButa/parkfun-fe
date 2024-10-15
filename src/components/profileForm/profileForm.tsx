"use client";
import { useState } from "react";

import styled from "@emotion/styled";
import { Alert, AlertColor, Button, Container, Stack, Typography } from "@mui/material";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";

import { useProfile } from "@/context/profileContext";
import { ProfileFormData } from "@/interfaces/profileFormData";
import AxiosInstance from "@/utils/axios";

import ContainerFlexColumn from "../containerFlexColumn/containerFlexColumn";
import { FormTextInput, FormTextInputProps } from "../formTextInput/formTextInput";

const StyledFormTextInput = styled((props: FormTextInputProps) => <FormTextInput {...props} />)(() => ({
  "& label": {
    color: "var(--secondary-color)",
  },
  "& .MuiOutlinedInput-root": {
    color: "var(--secondary-color) !important",
  },
}));
const fieldList = [
  {
    key: "name",
    rule: {
      required: "Please enter your name",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters long",
      },
    },
  },
  { key: "email", rule: {}, disabled: true },
  { key: "address" },
  { key: "phoneNumber" },
];
const ProfileForm = () => {
  const { profile } = useProfile();
  const [error, setError] = useState<{ type: AlertColor; message: string } | undefined>(undefined);
  const { handleSubmit, control } = useForm({
    defaultValues: { ...new ProfileFormData(), ...profile },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const onSubmit = (data: ProfileFormData) => {
    AxiosInstance.patch("/user/me", data)
      .then((res: AxiosResponse) => {
        window.localStorage.setItem("profile", JSON.stringify(res.data));
        setError({ type: "success", message: "Successfully update your profile" });
      })
      .catch((err) => {
        setError({ type: "error", message: err.message });
      });
  };
  function handleReset(): void {
    control._reset();
    setError(undefined);
  }

  return (
    <Stack
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
      direction="row"
      alignItems="center"
      p={2}
      sx={{
        borderRadius: "10px",
        backgroundColor: "secondary.contrastText",
      }}
    >
      <Container sx={{ width: "240px", height: "200px" }} disableGutters>
        <img
          src={profile?.image.url ?? ""}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </Container>
      <ContainerFlexColumn
        sx={{
          gap: "10px",
          marginTop: "10px",
        }}
        disableGutters
      >
        {fieldList.map(({ key, rule }) => (
          <Container
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
            key={key}
          >
            <Typography
              sx={{
                "&::first-letter": {
                  textTransform: "capitalize",
                },
                minWidth: {
                  md: "200px",
                  xs: "120px",
                },
                fontSize: {
                  xs: "14px",
                  md: "16px",
                },
                maxWidth: 100,
                height: "fit-content",
                transform: "translateY(10px)",
                textAlign: "left",
                fontWeight: "500",
                marginRight: {
                  xs: "10px",
                  md: "20px",
                },
              }}
            >
              {`${key}: `}
            </Typography>
            <StyledFormTextInput
              key={key}
              name={key}
              control={control}
              placeholder={key}
              size="small"
              type="text"
              rule={rule}
            />
          </Container>
        ))}
        <Container
          sx={{
            gap: "10px",
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <Button variant="contained" type="submit">
            Save
          </Button>
          <Button variant="contained" color="info" onClick={() => handleReset()}>
            Reset
          </Button>
        </Container>
      </ContainerFlexColumn>
      {error && (
        <Alert
          variant="filled"
          severity={error.type as AlertColor}
          sx={{
            marginTop: "10px",
          }}
        >
          {error.message}
        </Alert>
      )}
    </Stack>
  );
};

export default ProfileForm;

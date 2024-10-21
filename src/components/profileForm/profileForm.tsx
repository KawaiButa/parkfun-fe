"use client";
import { useEffect, useRef, useState } from "react";

import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Container, Stack, Typography } from "@mui/material";
import { useNotifications } from "@toolpad/core";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";

import { useProfile } from "@/context/profileContext";
import { useUploadImage } from "@/hooks/useUploadImage";
import { ProfileFormData } from "@/interfaces/profileFormData";
import AxiosInstance from "@/utils/axios";

import profileSchema from "./validationSchema";
import ContainerFlexColumn from "../containerFlexColumn/containerFlexColumn";
import { FormTextInput, FormTextInputProps } from "../formTextInput/formTextInput";
import PrimaryContainedButton from "../primaryContainedButton/primaryContainedButton";

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
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: { ...new ProfileFormData() },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(profileSchema),
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedSrc, setSelectedSrc] = useState<File | null>(null);
  const { uploadImage, getPublicUrl } = useUploadImage("avatar");
  const notifications = useNotifications();
  useEffect(() => {
    if (profile) reset((prev) => ({ ...prev, ...profile }));
  }, [profile, reset]);
  const onSubmit = async (data: ProfileFormData) => {
    if (!profile) return;
    let image = profile?.image.url;
    if (selectedSrc) {
      image = getPublicUrl(await uploadImage(selectedSrc));
    }
    AxiosInstance.patch("/user/" + profile.id, { ...data, image })
      .then((res: AxiosResponse) => {
        window.localStorage.setItem("profile", JSON.stringify(res.data));
        notifications.show("Successfully update your profile", {
          severity: "success",
          autoHideDuration: 2000,
        });
      })
      .catch((err) => {
        notifications.show("Error updating your profile. " + err.message, {
          severity: "error",
          autoHideDuration: 2000,
        });
      });
  };
  useEffect(() => {
    if (Object.keys(errors).length > 0)
      notifications.show(Object.values(errors)[0].message, {
        severity: "error",
        autoHideDuration: 2000,
      });
  }, [errors]);
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
      <Stack sx={{ width: "220px", height: "220px" }}>
        <img
          src={selectedSrc ? URL.createObjectURL(selectedSrc) : (profile?.image.url ?? "")}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <input
          type="file"
          hidden
          ref={inputRef}
          onChange={(e) => {
            if (e.target.files) {
              setSelectedSrc(e.target.files[0]);
            }
          }}
        />
        <PrimaryContainedButton
          onClick={() => {
            if (inputRef.current) inputRef.current.click();
          }}
          type="button"
          sx={{
            mt: 2,
          }}
        >
          Change image
        </PrimaryContainedButton>
      </Stack>
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
              size="small"
              type="text"
              disabled={key === "email"}
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
          <LoadingButton variant="contained" type="submit">
            Save
          </LoadingButton>
          {!isSubmitting && (
            <Button variant="contained" color="info" onClick={() => reset()}>
              Reset
            </Button>
          )}
        </Container>
      </ContainerFlexColumn>
    </Stack>
  );
};

export default ProfileForm;

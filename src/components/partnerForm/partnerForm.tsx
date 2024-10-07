"use client";

import { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Typography, FormControl, Autocomplete, Container, styled } from "@mui/material";
import { useNotifications } from "@toolpad/core";
import { Controller, useForm } from "react-hook-form";

import { usePartner } from "@/hooks/usePartner";
import { usePartnerType } from "@/hooks/userPartnerType";
import { Partner } from "@/interfaces/partner";
import { PartnerFormData } from "@/interfaces/partnerFormData";

import { partnerValidationSchema } from "./validationSchema";
import { defaultUserAvatar } from "../../../public/images";
import ContainerFlexColumn from "../containerFlexColumn/containerFlexColumn";
import { FormRadioInput } from "../formRadioInput/formRadioInput";
import { FormTextInputProps, FormTextInput } from "../formTextInput/formTextInput";
import { ImageUpload } from "../imageUpload/ImageUpload";
import PrimaryContainedButton from "../primaryContainedButton/primaryContainedButton";

const StyledFormTextInput = styled(({ sx, ...props }: FormTextInputProps) => (
  <FormTextInput
    sx={{
      "& label": {
        fontWeight: "normal",
      },
      ...sx,
    }}
    size="small"
    {...props}
  />
))();

const PartnerForm = (props: { initValue?: Partner | null }) => {
  const { createPartner, udpatePartner } = usePartner();
  const { partnerTypeList, fetchPartnerType } = usePartnerType();
  const notifications = useNotifications();
  const { initValue } = props;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormData>({
    mode: "all",
    reValidateMode: "onSubmit",
    resolver: yupResolver(partnerValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      location: "",
      description: "",
      typeId: 0,
    },
  });
  useEffect(() => {
    if (initValue) {
      const {
        user: {
          name,
          email,
          phoneNumber,

          image: { url },
        },
        type: { id: typeId },
        location,
        description,
      } = initValue;
      reset((prev) => ({
        ...prev,
        description: description ?? "",
        name,
        email,
        typeId,
        phoneNumber: phoneNumber ?? "",
        location,
        image: url,
      }));
    }
    fetchPartnerType();
  }, [initValue, reset]);
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      notifications.show(Object.values(errors)[0].message, {
        severity: "error",
        autoHideDuration: 2000,
      });
    }
  }, [errors]);
  const onSubmit = async (formData: PartnerFormData) => {
    try {
      if (initValue) {
        await udpatePartner({ partner: initValue, formData });
        notifications.show("Successfully update partner account", {
          severity: "success",
          autoHideDuration: 2000,
        });
        return;
      }
      await createPartner(formData);
      notifications.show("Successfully create partner account", {
        severity: "success",
        autoHideDuration: 2000,
      });
      reset();
    } catch (err) {
      notifications.show(err.message, {
        severity: "error",
        autoHideDuration: 2000,
      });
    }
  };
  return (
    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: {
            xs: "block",
            md: "flex",
          },
        }}
      >
        <ContainerFlexColumn
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: {
                xs: "block",
                md: "flex",
              },
              gap: "10px",
            }}
          >
            <Box>
              <Controller
                name="image"
                control={control}
                render={({ field: { onChange, value } }) => {
                  const url = value && value instanceof File ? URL.createObjectURL(value) : value;
                  return (
                    <ImageUpload
                      src={url ? url : defaultUserAvatar.src}
                      sx={{
                        width: {
                          xs: "200px",
                          md: "200px",
                        },
                        height: {
                          xs: "200px",
                          md: "200px",
                        },
                        margin: "auto",
                        marginBotton: {
                          xs: "10px",
                          md: "0px",
                        },
                        borderRadius: "50%",
                        position: "relative",
                        overflow: "hidden",
                        cursor: "pointer",
                        "&:hover": {
                          opacity: 0.5,
                        },
                      }}
                      onChange={(e) => {
                        if (e.target.files) {
                          onChange(e.target.files[0]);
                        }
                      }}
                    />
                  );
                }}
              />

              <ContainerFlexColumn
                sx={{
                  margin: "10px 0",
                }}
              >
                <PrimaryContainedButton
                  onClick={(e) => (e.currentTarget.parentElement?.previousElementSibling as HTMLDivElement).click()}
                >
                  Change image
                </PrimaryContainedButton>
              </ContainerFlexColumn>
            </Box>
            <ContainerFlexColumn
              disableGutters
              sx={{
                width: {
                  xs: "100%",
                  md: "50%",
                },
                justifyContent: "space-evenly",
              }}
            >
              <Typography>1. Partner is a individual bussiness or a company</Typography>
              <FormRadioInput
                name="typeId"
                control={control}
                options={partnerTypeList ?? []}
                transformLabel={(value) => value.name}
                transformValue={(value) => value.id}
                sx={{
                  "& .MuiFormControlLabel-label::first-letter": {
                    textTransform: "uppercase",
                  },
                }}
              />
              <Typography>2. Where is your main location of bussiness</Typography>
              <FormControl>
                <Autocomplete
                  disablePortal
                  options={[]}
                  sx={{ marginTop: "10px" }}
                  renderInput={(params) => (
                    <StyledFormTextInput name="location" control={control} label="Location" {...params} size="small" />
                  )}
                />
              </FormControl>
            </ContainerFlexColumn>
          </Box>
        </ContainerFlexColumn>
        <ContainerFlexColumn
          sx={{
            gap: "10px",
          }}
        >
          <Typography>{"1. Partner's name or bussiness name"}</Typography>
          <StyledFormTextInput name="name" control={control} label="Name" />
          <Typography>2. Contact email</Typography>
          <StyledFormTextInput
            name="email"
            control={control}
            label={initValue ? "" : "Email"}
            disabled={Boolean(initValue)}
            value={initValue?.user.email}
          />
          <Typography>3. Contact phone number</Typography>
          <StyledFormTextInput name="phoneNumber" control={control} label="Phone number" />
        </ContainerFlexColumn>
      </Box>
      <Container
        sx={{
          marginTop: "10px",
          width: "100%",
        }}
      >
        <FormTextInput
          name="description"
          control={control}
          label="Description"
          minRows={10}
          multiline
          fullWidth
          placeholder="Write something to describe your company or service"
        />
      </Container>
      <Container
        sx={{
          marginTop: "10px",
          width: "fit-content",
          marginRight: "0",
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          sx={{
            marginRight: "10px",
          }}
          onClick={() => reset()}
        >
          Reset
        </Button>

        <LoadingButton loading={isSubmitting} variant="contained" color="primary" type="submit">
          Save
        </LoadingButton>
      </Container>
    </Box>
  );
};

export default PartnerForm;

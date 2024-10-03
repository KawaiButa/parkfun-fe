"use client";
import { useState, useRef, ChangeEvent } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Typography, FormControl, Autocomplete, Container, styled } from "@mui/material";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";

import { usePartner } from "@/hooks/usePartner";
import { PartnerType } from "@/interfaces/partner";
import { PartnerFormData } from "@/interfaces/partnerFormData";

import { partnerValidationSchema } from "./validationSchema";
import { defaultUserAvatar } from "../../../public/images";
import ContainerFlexColumn from "../containerFlexColumn/containerFlexColumn";
import { FormRadioInput } from "../FormRadioInput/formRadioInput";
import { FormTextInputProps, FormTextInput } from "../formTextInput/formTextInput";
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

const PartnerForm = () => {
  const { createPartner } = usePartner();
  const { control, handleSubmit, reset } = useForm<PartnerFormData>({
    mode: "all",
    reValidateMode: "onSubmit",
    resolver: yupResolver(partnerValidationSchema),
    defaultValues: {
      role: "partner",
      name: "",
      email: "",
      phoneNumber: "",
      location: "",
      description: "",
      avatarUrl: "",
    },
  });
  const [imageSrc, setImageSrc] = useState(defaultUserAvatar.src);
  const imageRef = useRef<HTMLInputElement>(null);
  function handleOnClick(): void {
    if (imageRef.current) imageRef.current!.click();
  }
  function handleOnChange(event: ChangeEvent): void {
    event.preventDefault();
    const files = (event.target as HTMLInputElement).files;
    if (files) setImageSrc(URL.createObjectURL(files[0]));
  }
  const onSubmit = async (partnerFormData: PartnerFormData) => {
    try {
      //TODO: Upload image to supabase and get url
      await createPartner(partnerFormData);
      alert("Successfully create partner account");
      //TODO: SEND PASSWORD TO PARTNER'S EMAIL
    } catch (err) {
      alert((err as AxiosError).message);
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
              <Box
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
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={imageSrc}
                  style={{
                    borderRadius: "100%",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  alt="User avatar"
                />
                <input ref={imageRef} hidden type="file" onChange={handleOnChange} />
              </Box>
              <ContainerFlexColumn
                sx={{
                  margin: "10px 0",
                }}
              >
                <PrimaryContainedButton onClick={handleOnClick}>Change image</PrimaryContainedButton>
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
                name="type"
                control={control}
                options={[PartnerType.INDIVIDUAL, PartnerType.COMPANY]}
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
          <StyledFormTextInput name="email" control={control} label="Email" />
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

        <Button variant="contained" color="primary" type="submit">
          Create
        </Button>
      </Container>
    </Box>
  );
};

export default PartnerForm;

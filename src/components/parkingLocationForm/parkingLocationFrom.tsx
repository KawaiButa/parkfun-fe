"use client";
import React, { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, BoxProps, Button, styled, Typography } from "@mui/material";
import { useNotifications } from "@toolpad/core";
import { useForm, Controller, useWatch } from "react-hook-form";

import { useParkingLocation } from "@/hooks/useParkingLocation";
import { ParkingLocationFormData } from "@/interfaces/parkingLocationForm";

import { parkingLocationSchema } from "./validationScheme";
import { FormRadioInput } from "../formRadioInput/formRadioInput";
import { FormTextInput } from "../formTextInput/formTextInput";
import { ImageUpload, ImageUploadProps } from "../imageUpload/ImageUpload";
const StyledImageUpload = styled(({ sx, ...props }: ImageUploadProps) => (
  <ImageUpload
    sx={{
      flexGrow: 1,
      height: "150px",
      borderRadius: "10px",
      backgroundColor: "white",
      maxWidth: "300px",
      overflow: "hidden",
      ...sx,
      cursor: "pointer",
      "&:hover": {
        opacity: 0.4,
      },
    }}
    {...props}
  />
))();
const ParkingLocationForm = (props: BoxProps) => {
  const { sx, ...remain } = props;
  const { createParkingLocation } = useParkingLocation();
  const notification = useNotifications();
  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ParkingLocationFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      address: "",
      access: "",
      paymentMethodId: 0,
      pricingOptionId: 0,
      partnerId: 0,
      imageList: [],
    },
    resolver: yupResolver(parkingLocationSchema),
  });
  const onSubmit = async (data: ParkingLocationFormData) => {
    try {
      const res = await createParkingLocation(data);
      if (res) {
        reset();
        notification.show("Successfully create parking location", {
          severity: "success",
          autoHideDuration: 1000,
        });
      }
    } catch (err) {
      notification.show((err as Error).message, {
        severity: "error",
        autoHideDuration: 1000,
      });
    }
  };
  useEffect(() => {
    if (Object.keys(errors).length)
      notification.show(Object.values(errors)[0].message, {
        severity: "error",
        autoHideDuration: 1000,
      });
  }, [errors]);
  const data = useWatch({ control, name: "pricingOptionId" });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          padding: "20px",
          mt: "60px",
          ...sx,
        }}
        {...remain}
      >
        <Typography variant="h5" fontWeight={600}>
          Parking location
        </Typography>
        <Typography variant="h6">Basic information</Typography>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
          }}
        >
          <Box>
            <Typography>1. Name of the parking location</Typography>
            <FormTextInput name="name" placeholder="E.g. Super luxury parking lot" control={control} size="small" />
            <Typography>2. Address of the parking location</Typography>
            <FormTextInput name="address" placeholder="E.g. Super luxury parking lot" control={control} size="small" />
            <Typography>3. Describe as clearly as possible how to access to the parking location</Typography>
            <FormTextInput name="access" placeholder="E.g. Super luxury parking lot" control={control} size="small" />
          </Box>
          <Box>
            <Typography>3. Description (This will be show when user search for your place)</Typography>
            <FormTextInput
              name="description"
              placeholder="In 1000 works, write about your parking location"
              control={control}
              multiline
              minRows={6}
              fullWidth
            />
          </Box>
        </Box>
        <Typography variant="h6">Pricing and Availibity</Typography>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography>1. Pricing options</Typography>
            <FormRadioInput
              name="pricingOptionId"
              control={control}
              options={["Percentage", "Fixed"]}
              transformValue={(value, options) => options?.findIndex((e) => e === value)}
            />
          </Box>
          <Typography
            sx={{
              width: "50%",
            }}
          >
            {data == 0
              ? "We will earn a portion of your income. How ever this will lower than the fixed price. Consider this option if you are individual or a small company"
              : "Fixed option will only charge you with a small fee for each booking request to your facility."}
          </Typography>
        </Box>
        <Typography>
          2. Payment method.{" "}
          <Typography variant="caption">This will be your main method for receiving money</Typography>
        </Typography>
        <FormRadioInput
          name="paymentMethodId"
          control={control}
          options={["Zalopay", "Momo", "PayPal", "VNPAY"]}
          transformValue={(value, options) => options?.findIndex((e) => e === value)}
        />
        <Typography variant="h5">Image</Typography>
        <Typography variant="caption">
          Please upload images to showcase your place. It will help customers to know where you are.
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Controller
            name="imageList"
            control={control}
            render={({ field: { value } }) => {
              return (
                <>
                  {Array.from(Array(4)).map((_, index) => (
                    <StyledImageUpload
                      src={value.length > index ? URL.createObjectURL(value[index]) :  undefined}
                      key={Math.random()}
                      onChange={(e) =>
                        setValue("imageList", [...(value as File[]), (e.currentTarget as HTMLInputElement).files![0]])
                      }
                    />
                  ))}
                </>
              );
            }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: "10px", justifyContent: "flex-end", mt: "10px" }}>
          <Button variant="contained" size="medium" color="info" onClick={() => reset()}>
            Reset
          </Button>
          <Button variant="contained" color="secondary" size="medium" type="submit">
            Save
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default ParkingLocationForm;

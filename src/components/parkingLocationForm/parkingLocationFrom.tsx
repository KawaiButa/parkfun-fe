"use client";
import React, { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, BoxProps, Button, styled, Typography } from "@mui/material";
import { useNotifications } from "@toolpad/core";
import { useForm, Controller, useWatch } from "react-hook-form";

import { FormRadioInput } from "@/components/formRadioInput/formRadioInput";
import { useParkingLocation } from "@/hooks/useParkingLocation";
import { usePaymentMethod } from "@/hooks/usePaymentMethod";
import { usePricingOption } from "@/hooks/usePricingOption";
import { ParkingLocation } from "@/interfaces";
import { ParkingLocationFormData } from "@/interfaces/parkingLocationForm";

import { parkingLocationSchema } from "./validationScheme";
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
const ParkingLocationForm = (props: BoxProps & { initValue?: ParkingLocation | null }) => {
  const { sx, initValue, ...remain } = props;
  const { createParkingLocation, updateParkingLocation } = useParkingLocation();
  const notification = useNotifications();
  const { name, address } = initValue ?? {};
  const { pricingOptionList, fetchPricingOption } = usePricingOption();
  const { paymentMethodList, fetchPaymentMethod } = usePaymentMethod();
  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ParkingLocationFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      address: "",
      access: "",
      paymentMethodId: 0,
      pricingOptionId: 0,
      description: "",
      images: [],
    },
    resolver: yupResolver(parkingLocationSchema),
  });
  const onSubmit = async (data: ParkingLocationFormData) => {
    try {
      if (initValue) {
        const { paymentMethodId, pricingOptionId, access, description, images } = data;
        const res = await updateParkingLocation(initValue, {
          paymentMethodId,
          pricingOptionId,
          access,
          description,
          images,
        });
        if (res) {
          notification.show("Successfully updated parking location", {
            severity: "success",
            autoHideDuration: 1000,
          });
        }
      }
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
    if (initValue) {
      const {
        images,
        pricingOption: { id: pricingOptionId },
        paymentMethod: { id: paymentMethodId },
        ...remain
      } = initValue as ParkingLocation;
      reset((prev) => ({ ...prev, ...remain, pricingOptionId, paymentMethodId, images: images.map(({ url }) => url) }));
    }
    fetchPricingOption();
    fetchPaymentMethod();
  }, [initValue, reset]);
  useEffect(() => {
    if (Object.keys(errors).length)
      notification.show(Object.values(errors)[0].message, {
        severity: "error",
        autoHideDuration: 1000,
      });
  }, [errors, isSubmitting, notification]);
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
        <Typography variant="h5" fontWeight={500}>
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
            <Box sx={{ pl: "20px" }}>
              {name ? (
                <Typography>{name}</Typography>
              ) : (
                <FormTextInput name="name" placeholder="E.g. Super luxury parking lot" control={control} size="small" />
              )}
            </Box>
            <Typography>2. Address of the parking location</Typography>
            <Box sx={{ pl: "20px" }}>
              {address ? (
                <Typography>{address}</Typography>
              ) : (
                <FormTextInput
                  name="address"
                  placeholder="E.g. Super luxury parking lot"
                  control={control}
                  size="small"
                />
              )}
            </Box>
            <Typography>3. Describe as clearly as possible how to access to the parking location</Typography>
            <Box
              sx={{
                pl: "20px",
              }}
            >
              <FormTextInput name="access" placeholder="E.g. Super luxury parking lot" control={control} size="small" />
            </Box>
          </Box>
          <Box>
            <Typography>4. Description (This will be show when user search for your place)</Typography>
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
              options={pricingOptionList ?? []}
              transformLabel={(value) => value.name}
              transformValue={(value) => value.id}
              sx={{
                ":first-letter": {
                  textTransform: "uppercase",
                },
              }}
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
          2. Payment method.
          <Typography variant="caption">This will be your main method for receiving money</Typography>
        </Typography>
        <FormRadioInput
          name="paymentMethodId"
          control={control}
          options={paymentMethodList ?? []}
          transformLabel={(value) => value.name}
          transformValue={(value) => value.id}
          sx={{
            ":first-letter": {
              textTransform: "uppercase",
            },
          }}
        />
        <Typography variant="h5">Image</Typography>
        <>
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
              name="images"
              control={control}
              render={({ field: { value } }) => {
                return (
                  <>
                    {Array.from(Array(4)).map((_, index) => {
                      const url =
                        value.length > index
                          ? value[index] instanceof File
                            ? URL.createObjectURL(value[index])
                            : value[index]
                          : undefined;
                      return (
                        <StyledImageUpload
                          src={url}
                          key={Math.random()}
                          onChange={(e) => {
                            const temp = [...(value as File[])];
                            temp[index] = (e.currentTarget as HTMLInputElement).files![0];
                            setValue("images", temp);
                          }}
                        />
                      );
                    })}
                  </>
                );
              }}
            />
          </Box>
        </>

        <Box sx={{ display: "flex", gap: "10px", justifyContent: "flex-end", mt: "10px" }}>
          <Button variant="outlined" size="medium" color="info" onClick={() => reset()}>
            Reset
          </Button>
          <LoadingButton loading={isSubmitting} variant="contained" color="secondary" size="medium" type="submit">
            Save
          </LoadingButton>
        </Box>
      </Box>
    </form>
  );
};

export default ParkingLocationForm;

import React, { ChangeEvent, useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Close } from "@mui/icons-material";
import { Typography, Box, Grid2, Button, styled, InputAdornment } from "@mui/material";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNotifications } from "@toolpad/core";
import { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";

import { useParkingLocation } from "@/hooks/useParkingLocation";
import { useParkingSlot } from "@/hooks/useParkingSlot";
import { ParkingSlotFormData } from "@/interfaces/parkingSlotFormData";

import { parkingSlotSchema } from "./validationScheme";
import ContainerFlexColumn from "../containerFlexColumn/containerFlexColumn";
import FormCheckboxInput from "../formCheckboxInput/formCheckboxInput";
import { FormNumberInput } from "../formNumberInput.ts/formNumberInput";
import { FormRadioInput } from "../formRadioInput/formRadioInput";
import { FormTextInput } from "../formTextInput/formTextInput";
import { ImageUploadProps, ImageUpload } from "../imageUpload/ImageUpload";
import PrimaryContainedButton from "../primaryContainedButton/primaryContainedButton";
import SelectInput from "../selectInput/selectInput";

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
//TODO: Call API to get data
const slotTypeData = ["Garage", "Car park", "On-street"];
const serviceData = ["Car wask", "Electrical charger", "Fuel", "Shuttle services"];
const ParkingSlotForm = () => {
  const { createParkingSlot } = useParkingSlot();
  const { parkingLocationList, fetchParkingLocation } = useParkingLocation();
  const notification = useNotifications();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(parkingSlotSchema),
    defaultValues: {
      type: 0,
      space: 1,
      length: 0,
      width: 0,
      height: 0,
      services: [],
      price: 0,
      images: [],
    },
  });
  useEffect(() => {
    fetchParkingLocation();
  }, []);
  const onSubmit = async (formData: ParkingSlotFormData) => {
    try {
      const res = await createParkingSlot(formData);
      if (res) {
        reset();
        notification.show("Successfully create parking slot", {
          severity: "success",
          autoHideDuration: 1000,
        });
      }
    } catch (err) {
      if (err instanceof AxiosError)
        notification.show(err.response?.data.err, {
          severity: "error",
          autoHideDuration: 3000,
        });
      throw err;
    }
  };
  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      notification.show(Object.values(errors)[0].message, {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [errors]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ContainerFlexColumn
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          backgroundColor: "background.default",
          borderRadius: "10px",
          padding: "20px !important",
          gap: "10px",
          mt: "50px",
        }}
      >
        <Typography variant="h5" fontWeight={600} textAlign="left">
          Create parking slot
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <ContainerFlexColumn
            sx={{
              width: "50%",
              gap: "10px",
              margin: "0",
              justifyContent: "flex-start",
            }}
          >
            <Typography>1. Select your parking location</Typography>
            {parkingLocationList && (
              <Controller
                name="parkingLocationId"
                control={control}
                render={({ field: { onChange } }) => (
                  <SelectInput
                    options={parkingLocationList}
                    transformToLabel={(parkLoc) => parkLoc.name}
                    transformToValue={(parkLoc) => parkLoc.id}
                    sx={{
                      maxWidth: "200px",
                    }}
                    menuProps={{
                      sx: {
                        maxWidth: "200px",
                      },
                    }}
                    onChange={(e) => {
                      const selected = parkingLocationList!.find((a) => a.id == e.target.value);
                      if (selected) {
                        onChange(selected.id);
                      }
                    }}
                  />
                )}
              />
            )}

            <Typography>2. What is the type of the space</Typography>
            <FormRadioInput
              control={control}
              options={slotTypeData}
              name="type"
              transformValue={(b) => slotTypeData.findIndex((a) => a == b)}
            />
            <Typography>3. How many spaces of this parking slot that your parking location have?</Typography>
            <Box
              sx={{
                width: "200px",
              }}
            >
              <FormNumberInput control={control} name="space" />
            </Box>
            <Typography>4. Size of the slot</Typography>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <Box>
                <FormTextInput control={control} name="length" type="number" size="small" placeholder="Length" />
              </Box>
              <Close />
              <Box>
                <FormTextInput control={control} name="width" type="number" size="small" placeholder="Width" />
              </Box>
              <Close />
              <Box>
                <FormTextInput control={control} name="height" type="number" size="small" placeholder="Height" />
              </Box>
            </Box>
          </ContainerFlexColumn>
          <ContainerFlexColumn
            sx={{
              width: "50%",
              gap: "10px",
            }}
          >
            <Typography>4. Which service do this type of parking slot provide?</Typography>
            <FormCheckboxInput
              control={control}
              options={serviceData}
              name="services"
              sx={{
                padding: "0 20px",
              }}
              transformValue={(value) => serviceData.findIndex((a) => a == value)}
            />
            <Typography>5. How much do you like to charge user for this slot by hours?</Typography>

            <FormTextInput
              control={control}
              name="price"
              variant="standard"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              sx={{
                padding: "0 10px",
              }}
            />
            <Typography>6. Avalability</Typography>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                padding: "0 10px",
              }}
            >
              <Typography
                sx={{
                  width: "100px",
                }}
              >
                Start at:
              </Typography>
              <Controller
                control={control}
                name="startTime"
                render={({ field: { onChange } }) => (
                  <TimeField size="small" fullWidth ampm={false} onChange={(e) => onChange(e?.second())} />
                )}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                padding: "0 10px",
              }}
            >
              <Typography
                sx={{
                  width: "100px",
                }}
              >
                End at:
              </Typography>
              <Controller
                control={control}
                name="endTime"
                render={({ field: { onChange } }) => (
                  <TimeField size="small" fullWidth ampm={false} onChange={(e) => onChange(e?.second())} />
                )}
              />
            </Box>
          </ContainerFlexColumn>
        </Box>
        <Typography variant="h6">Images</Typography>
        <Typography variant="caption">Please provide us some images of your parking location</Typography>
        <Controller
          control={control}
          name="images"
          render={({ field: { onChange, value } }) => {
            return (
              <Grid2 container spacing={2}>
                {Array.from(Array(4)).map((_, index) => (
                  <Grid2 key={index} size={3}>
                    <StyledImageUpload
                      src={value && value[index] ? URL.createObjectURL(value[index]) : ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files) {
                          if (value?.length > index) {
                            const temp = [...value];
                            temp[index] = e.target.files[0];
                            onChange(temp);
                          } else onChange((value as File[]).concat([e.target.files[0]]));
                        }
                      }}
                    />
                  </Grid2>
                ))}
              </Grid2>
            );
          }}
        />
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="contained" color="info" onClick={() => reset()}>
            Reset
          </Button>
          <PrimaryContainedButton type="submit">Create</PrimaryContainedButton>
        </Box>
      </ContainerFlexColumn>
    </LocalizationProvider>
  );
};

export default ParkingSlotForm;
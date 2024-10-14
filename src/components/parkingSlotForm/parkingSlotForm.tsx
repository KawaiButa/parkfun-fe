import React, { ChangeEvent, useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Close } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Typography, Box, Grid2, Button, styled, InputAdornment } from "@mui/material";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNotifications } from "@toolpad/core";
import { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";

import { useParkingService } from "@/hooks/useParkingService";
import { useParkingSlot } from "@/hooks/useParkingSlot";
import { useParkingSlotType } from "@/hooks/useParkingSlotType";
import { ParkingLocation } from "@/interfaces";
import { ParkingSlot } from "@/interfaces/parkingSlot";
import { ParkingSlotFormData } from "@/interfaces/parkingSlotFormData";
import { timeToSeconds } from "@/utils/utils";

import { parkingSlotSchema } from "./validationScheme";
import ContainerFlexColumn from "../containerFlexColumn/containerFlexColumn";
import FormCheckboxInput from "../formCheckboxInput/formCheckboxInput";
import { FormNumberInput } from "../formNumberInput.ts/formNumberInput";
import { FormRadioInput } from "../formRadioInput/formRadioInput";
import { FormTextInput } from "../formTextInput/formTextInput";
import { ImageUploadProps, ImageUpload } from "../imageUpload/ImageUpload";
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
const ParkingSlotForm = (props: { parkingLocationList: ParkingLocation[]; initValue?: ParkingSlot | null }) => {
  const { initValue } = props;
  const { parkingLocationList } = props;
  const { createParkingSlot } = useParkingSlot();
  const { parkingSlotTypeList, fetchParkingSlotType } = useParkingSlotType();
  const notification = useNotifications();
  const { parkingServiceList, fetchParkingService } = useParkingService();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(parkingSlotSchema),
    defaultValues: {
      parkingSlotTypeId: 0,
      space: 1,
      name: "",
      length: 0,
      width: 0,
      height: 0,
      parkingServiceIds: [],
      price: 0,
      images: [],
    },
  });

  const onSubmit = async (formData: ParkingSlotFormData) => {
    try {
      const res = await createParkingSlot(formData);
      if (res) {
        notification.show("Successfully create parking slot", {
          severity: "success",
          autoHideDuration: 3000,
        });
        reset();
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        notification.show(err.response?.data.message, {
          severity: "error",
          autoHideDuration: 3000,
        });
      } else {
        notification.show((err as Error).message, {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    }
  };
  useEffect(() => {
    fetchParkingSlotType();
    fetchParkingService();
    if (initValue) {
      const {
        images,
        parkingLocation: { id: parkingLocationId },
      } = initValue;
      const imageUrl = images.map(({ url }) => url);
      reset((prev) => ({ ...prev, ...initValue, parkingLocationId, images: imageUrl }));
    }
  }, [initValue]);
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
            alignItems: "baseline",
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
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ width: "50%" }}>
                {initValue ? (
                  <>
                    <Typography>1. Select your parking location</Typography>

                    <FormTextInput
                      name="parkingLocationId"
                      control={control}
                      value={initValue.parkingLocation.name}
                      size="small"
                      disabled
                    />
                  </>
                ) : (
                  <>
                    <Typography>1. Select your parking location</Typography>

                    <Controller
                      name="parkingLocationId"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <SelectInput
                          options={parkingLocationList}
                          transformToLabel={(parkLoc) => parkLoc.name}
                          transformToValue={(parkLoc) => parkLoc.id}
                          onChange={(e) => {
                            const selected = parkingLocationList!.find((a) => a.id == e.target.value);
                            if (selected) {
                              onChange(selected.id);
                            }
                          }}
                          fullWidth={true}
                        />
                      )}
                    />
                  </>
                )}
              </Box>
              <Box>
                <Typography>1.1 What is the slot called</Typography>
                <FormTextInput control={control} name="name" size="small" />
              </Box>
            </Box>
            {!initValue && (
              <>
                <Typography>2. What is the type of the space</Typography>
                <FormRadioInput
                  control={control}
                  options={parkingSlotTypeList ?? []}
                  name="parkingSlotTypeId"
                  transformLabel={(value) => value.name}
                  transformValue={(b) => b.id}
                />
                <Typography>3. How many spaces of this parking slot that your parking location have?</Typography>
                <Box
                  sx={{
                    width: "200px",
                  }}
                >
                  <FormNumberInput control={control} name="space" />
                </Box>
              </>
            )}
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
            <Typography>5. Which service do this type of parking slot provide?</Typography>
            <FormCheckboxInput
              control={control}
              options={parkingServiceList ?? []}
              name="parkingServiceIds"
              sx={{
                padding: "0 20px",
              }}
              transformLabel={(value) => value.name}
              transformValue={(value) => value.id}
            />
            <Typography>6. How much do you like to charge user for this slot by hours?</Typography>

            <FormTextInput
              control={control}
              name="price"
              variant="standard"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              sx={{
                padding: "0 10px",
              }}
            />
            <Typography>7. Avalability</Typography>
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
                name="startAt"
                render={({ field: { onChange } }) => (
                  <TimeField
                    size="small"
                    fullWidth
                    ampm={false}
                    onChange={(e) => {
                      if (e) onChange(timeToSeconds(e));
                    }}
                  />
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
                name="endAt"
                render={({ field: { onChange } }) => (
                  <TimeField
                    size="small"
                    fullWidth
                    ampm={false}
                    onChange={(e) => {
                      if (e) onChange(timeToSeconds(e));
                    }}
                  />
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
                {Array.from(Array(4)).map((_, index) => {
                  const url =
                    value.length > index
                      ? value[index] instanceof File
                        ? URL.createObjectURL(value[index])
                        : value[index]
                      : undefined;
                  return (
                    <Grid2 key={index} size={3}>
                      <StyledImageUpload
                        src={url}
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
                  );
                })}
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
          {!isSubmitting && (
            <Button variant="contained" color="info" onClick={() => reset()}>
              Reset
            </Button>
          )}
          <LoadingButton loading={isSubmitting} type="submit" variant="contained" color="primary">
            Create
          </LoadingButton>
        </Box>
      </ContainerFlexColumn>
    </LocalizationProvider>
  );
};

export default ParkingSlotForm;

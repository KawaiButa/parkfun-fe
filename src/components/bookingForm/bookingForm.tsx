"use client";

import { useEffect } from "react";

import { FeaturesItemOutput } from "@azure-rest/maps-search";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Container, ContainerOwnProps, TextField, Typography, TypographyProps } from "@mui/material";
import { useNotifications } from "@toolpad/core";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import { useForm } from "react-hook-form";

import { constants } from "@/constants";
import { useLocation } from "@/context/locationContext";
import { useSearchMapAPI } from "@/hooks/useMapApi";
import { getNearestRoundTime } from "@/utils/utils";

import BookingTimePicker from "./bookingTimePicker/bookingTimePicker";
import { bookingFormValidation } from "./validationSchema";
import ContainerFlexColumn from "../containerFlexColumn/containerFlexColumn";
import PrimaryContainedButton from "../primaryContainedButton/primaryContainedButton";
const StyledTypography = ({ children, ...props }: TypographyProps) => (
  <Typography variant="h6" {...props}>
    {children}
  </Typography>
);
function BookingForm(props: ContainerOwnProps) {
  const { locations, isLoading, setParam } = useSearchMapAPI();
  const notifications = useNotifications();
  const { location } = useLocation();
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startAt: getNearestRoundTime(dayjs()).toDate(),
      endAt: getNearestRoundTime(dayjs()).add(30, "minutes").toDate(),
    },
    resolver: yupResolver(bookingFormValidation),
  });
  const router = useRouter();
  const onSubmit = (data: { lat: number; lng: number; startAt: Date; endAt: Date }) => {
    router.push(
      "home/map?" + queryString.stringify({ ...data, startAt: data.startAt.toJSON(), endAt: data.endAt.toJSON() })
    );
  };
  useEffect(() => {
    if (Object.values(errors).length)
      notifications.show(Object.values(errors)[0].message, {
        severity: "error",
        autoHideDuration: 3000,
      });
  }, [errors]);
  return (
    <Container
      maxWidth="md"
      {...props}
      sx={{
        ...props.sx,
        backgroundColor: "background.default",
        borderRadius: "10px",
        padding: {
          xs: "15px",
          md: "20px 20px",
        },
        color: "secondary.contrastText",
        gap: "20px",
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
        },
      }}
    >
      <Container
        sx={{
          height: {
            xs: "200px",
            md: "unset",
          },
          width: {
            xs: "100%",
            md: "50%",
          },
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "var(--secondary-color)",
          minWidth: "200px",
        }}
      />
      <ContainerFlexColumn
        sx={{
          gap: "10px",
        }}
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column-reverse",
          }}
          disableGutters
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              fontSize: {
                xs: "30px",
                md: "40px",
              },
            }}
          >
            {constants.PROJECT_NAME}
          </Typography>
          <StyledTypography
            sx={{
              fontSize: {
                xs: "15px",
                md: "20px",
              },
            }}
          >
            Simplify your parking experience
          </StyledTypography>
        </Container>
        <StyledTypography
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          1. Choose your location
        </StyledTypography>
        <Autocomplete
          loading={isLoading}
          options={[...locations, location]}
          getOptionLabel={(location) => {
            if(!location) return "";
            if (location instanceof Array) return "Find parking location arount my location.";
            return (location as FeaturesItemOutput).properties?.address?.formattedAddress ?? "";
          }}
        >
          <Input placeholder="Search here" disableUnderline={true} />
        </Container>
        <StyledTypography
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          2. Select the time and duration
        </StyledTypography>
        <BookingTimePicker
          onStartChange={(e: Dayjs | null) => {
            if (e) setValue("startAt", e.toDate());
          }}
          onEndChange={(e: Dayjs | null) => {
            if (e) setValue("endAt", e.toDate());
          }}
          slotProps={{
            leftTimePicker: {
              sx: {
                "& svg": {
                  color: "secondary.contrastText",
                },
              },
            },
            rightTimePicker: {
              sx: {
                width: "200px",
                "& fieldset": {
                  borderColor: "secondary.contrastText",
                },
                "& svg": {
                  color: "secondary.contrastText",
                },
              },
            },
          }}
        />
        <StyledTypography
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          3. Continue to checkout and start parking!!!!
        </StyledTypography>
        <PrimaryContainedButton
          sx={{
            fontWeight: "bold",
          }}
          type="submit"
        >
          Book
        </PrimaryContainedButton>
      </ContainerFlexColumn>
    </Container>
  );
}

export default BookingForm;

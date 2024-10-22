"use client";

import { useEffect } from "react";

import { FeaturesItemOutput } from "@azure-rest/maps-search";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, Box, Container, ContainerOwnProps, TextField, Typography, TypographyProps } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import queryString from "query-string";
import { useForm } from "react-hook-form";

import { constants } from "@/constants";
import { useLocation } from "@/context/locationContext";
import { useSearchMapAPI } from "@/hooks/useMapApi";
import { useNotify } from "@/hooks/useNoti";
import { getNearestRoundTime } from "@/utils/utils";

import { bookingFormValidation } from "./validationSchema";
import { map } from "../../../public/images";
import BookingTimePicker from "../bookingTimePicker/bookingTimePicker";
import ContainerFlexColumn from "../containerFlexColumn/containerFlexColumn";
const StyledTypography = ({ children, ...props }: TypographyProps) => (
  <Typography variant="h6" {...props}>
    {children}
  </Typography>
);
function BookingForm(props: ContainerOwnProps) {
  const { locations, isLoading, setParam } = useSearchMapAPI();
  const { showError } = useNotify();
  const { location } = useLocation();
  const t = useTranslations("bookingForm");
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
    if (Object.values(errors).length) showError(Object.values(errors)[0].message ?? "");
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
          overflow: "hidden",
          position: "relative",
          minWidth: "200px",
          display: "flex",
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            p: 2,
          }}
        >
          <Image src={map.src} width={200} height={200} alt="map" />
        </Box>
      </Container>
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
            {t("label")}
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
          1. {t("step1")}
        </StyledTypography>
        <Autocomplete
          loading={isLoading}
          options={[...locations, location]}
          getOptionLabel={(location) => {
            if (!location) return "";
            if (location instanceof Array) return t("searchCurrentLocation");
            return (location as FeaturesItemOutput).properties?.address?.formattedAddress ?? "";
          }}
          onChange={(e, value) => {
            if (value) {
              const point =
                value instanceof Array ? [value[0], value[1]] : (value as FeaturesItemOutput).geometry.coordinates;
              setValue("lng", point[0]);
              setValue("lat", point[1]);
            }
          }}
          renderInput={(param) => {
            return (
              <TextField
                {...param}
                placeholder="Search for your location"
                sx={{
                  fontSize: {
                    xs: "15px",
                    md: "20px",
                    borderRadius: "5px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                  },
                }}
                onChange={(e) => {
                  if (e) setParam(e.target.value);
                }}
                size="small"
              />
            );
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
          2. {t("step2")}
        </StyledTypography>
        <Box
          sx={{
            alignSelf: "center",
          }}
        >
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
                  "& input.MuiInputBase-input.MuiOutlinedInput-input": {
                    p: "0.7rem",
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
                  "& input": {
                    p: "0.7rem",
                  },
                },
              },
            }}
          />
        </Box>
        <StyledTypography
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          3. {t("step3")}
        </StyledTypography>
        <LoadingButton
          variant="contained"
          color="primary"
          sx={{
            fontWeight: "bold",
          }}
          type="submit"
        >
          {t("search")}
        </LoadingButton>
      </ContainerFlexColumn>
    </Container>
  );
}

export default BookingForm;

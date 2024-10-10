"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Container, ContainerOwnProps, TextField, Typography, TypographyProps } from "@mui/material";
import { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import { useForm } from "react-hook-form";

import { constants } from "@/constants";
import { useSearchMapAPI } from "@/hooks/useMapApi";
import { timeToSeconds } from "@/utils/utils";

import BookingTimePicker from "./bookingTimePicker/bookingTimePicker";
import { bookingFormValidation } from "./validationSchema";
import ContainerFlexColumn from "../containerFlexColumn/containerFlexColumn";
import PrimaryContainedButton from "../primaryContainedButton/primaryContainedButton";
const StyledTypography = ({ children, ...props }: TypographyProps) => (
  <Typography variant="h6" color="secondary" {...props}>
    {children}
  </Typography>
);
function BookingForm(props: ContainerOwnProps) {
  const { locations, setParam } = useSearchMapAPI();
  const { handleSubmit, setValue } = useForm({
    defaultValues: {
      startAt: 28800,
      endAt: 30600,
    },
    resolver: yupResolver(bookingFormValidation)
  });
  const router = useRouter();
  const onSubmit = (data: { lat: number; lng: number; startAt: number; endAt: number }) => {
    router.push("home/map?" + queryString.stringify(data));
  };
  return (
    <Container
      maxWidth="md"
      {...props}
      sx={{
        ...props.sx,
        backgroundColor: "var(--form-background-color)",
        borderRadius: "10px",
        padding: {
          xs: "15px",
          md: "20px 20px",
        },
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
        onSubmit={handleSubmit(onSubmit)}
        component={"form"}
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
            color="secondary"
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
          options={locations}
          getOptionLabel={(value) => value.properties?.address?.formattedAddress ?? ""}
          onChange={(e, value) => {
            if (value?.geometry) {
              setValue("lat", value?.geometry.coordinates[1]);
              setValue("lng", value?.geometry.coordinates[0]);
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
                  },
                  backgroundColor: "background.paper",
                }}
                onChange={(e) => {
                  setParam(e.target.value);
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
          2. Select the time and duration
        </StyledTypography>
        <BookingTimePicker
          onStartChange={(e: Dayjs | null) => {
            if (e) setValue("startAt", timeToSeconds(e));
          }}
          onEndChange={(e: Dayjs | null) => {
            if (e) setValue("endAt", timeToSeconds(e));
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

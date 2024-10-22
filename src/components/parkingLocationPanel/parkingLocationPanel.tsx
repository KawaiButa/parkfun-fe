"use client";
import { useEffect, useState } from "react";

import { Close } from "@mui/icons-material";
import { Stack, Typography, IconButton, Paper, Box, Button, CircularProgress, Divider } from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Carousel from "react-material-ui-carousel";

import { SearchedParkingLocation } from "@/hooks/useParkingLocation";
import { usePartner } from "@/hooks/usePartner";
import { ParkingLocation } from "@/interfaces";
import { DirectionMeta } from "@/interfaces/directionMeta";

const ParkingLocationPanel = (props: {
  parkingLocation: ParkingLocation | SearchedParkingLocation;
  onClose?: () => void;
  directionMeta: DirectionMeta | null;
  onBook?: (value: ParkingLocation | SearchedParkingLocation) => void;
}) => {
  const t = useTranslations("parkingLocationPanel")
  const { onClose, onBook, directionMeta } = props;
  const [parkingLocation, setParkingLocation] = useState<ParkingLocation | SearchedParkingLocation>(
    props.parkingLocation
  );
  const { fetchOnePartner } = usePartner();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const id = props.parkingLocation.partner?.id ?? (props.parkingLocation as SearchedParkingLocation).partnerId;
    fetchOnePartner(id)
      .then((value) => {
        if (value) setParkingLocation({ ...parkingLocation, partner: value });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props]);

  const buildOwnerSection = () => {
    if (loading)
      return (
        <Stack width={"100%"}>
          <CircularProgress />
        </Stack>
      );
    if (!parkingLocation.partner || !parkingLocation.partner.user)
      return (
        <Paper>
          <Typography>{t("errorWhenFetchOwnerLocation")}</Typography>
        </Paper>
      );
    return (
      <Paper
        sx={{
          padding: "10px",
        }}
      >
        <Typography variant="body2">
          <Typography variant="h6" fontWeight={500}>
            {t("owner")}:
          </Typography>
          <Typography ml={1} variant="body2">{parkingLocation.partner?.user.name}</Typography>
        </Typography>
        <Typography variant="body1">
          <Typography variant="h6" fontWeight={500}>
            {t("description")}:
          </Typography>
          <Typography ml={1} variant="body2">{parkingLocation.partner?.description}</Typography>
        </Typography>
        <Typography variant="body1">
          <Typography variant="h6" fontWeight={500}>
            {t("location")}:
          </Typography>
          <Typography ml={1} variant="body2">{parkingLocation.partner?.location}</Typography>
        </Typography>
        <Typography variant="body1">
          <Typography variant="h6" fontWeight={500}>
            {t("contact")}:
          </Typography >
          <Box ml={1} >
            {`${t("email")}: ${parkingLocation.partner?.user.email} `}
            <br />
            {`${t("phoneNumber")}: ${parkingLocation.partner?.user.phoneNumber}`}
          </Box>
        </Typography>
      </Paper>
    );
  };
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" position="relative">
        <Typography variant="h3" fontWeight={600} color="primary">
          {t("detail")}:
        </Typography>
        <IconButton
          sx={{
            width: "fit-content",
          }}
          onClick={() => onClose && onClose()}
        >
          <Close color="primary" />
        </IconButton>
      </Stack>
      {parkingLocation && (
        <Stack gap={1} overflow="scroll" mb={6}>
          <Carousel
            sx={{
              width: "100%",
              minHeight: "300px",
              padding: "0px 10px",
            }}
            height={"300px"}
          >
            {(parkingLocation.images ?? []).map((image) => {
              const url = typeof image === "string" ? image : image.url;
              return (
                <Image
                  key={url}
                  src={url}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                  alt={`${url}`}
                  width={500}
                  height={300}
                />
              );
            })}
          </Carousel>
          <Typography variant="h5" fontWeight={500}>
            {parkingLocation.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              padding: "0px 10px",
            }}
          >
            {parkingLocation.address}
          </Typography>
          <Paper
            sx={{
              padding: "10px",
            }}
          >
            <Typography variant="body1" fontWeight={500}>
              {t("aboutUs")}:
            </Typography>
            <Typography variant="body2" ml={1}>
              {parkingLocation.description}
            </Typography>
          </Paper>
          <Paper>
            <Stack sx={{
              flexDirection: {
                xs: "column",
                md: "row",
              },
              textAlign: {
                xd: "center",
                md: "left"
              }
            }} p={2} gap={2} justifyContent="space-around">
              {directionMeta && (
                <>
                  <Stack sx={{
                    flexDirection: {
                      xs: "row",
                      md: "column",
                    }
                  }}>
                    <Typography variant="h6" fontWeight={500}>
                      {t("distance")}:
                    </Typography>
                    <Typography>{(directionMeta.lengthInMeters / 1000).toFixed(2)} km</Typography>
                  </Stack>
                  <Divider
                    sx={{
                      borderColor: "inherit",
                      borderWidth: "1px",
                    }}
                  />
                  <Stack sx={{
                    flexDirection: {
                      xs: "row",
                      md: "column",
                    }
                  }}>
                    <Typography variant="h6" fontWeight={500}>
                      {t("departureTime")}:
                    </Typography>
                    <Typography>{directionMeta.departureTime.format("hh:mm A")}</Typography>
                  </Stack>
                  <Divider
                    sx={{
                      borderColor: "inherit",
                      borderWidth: "1px",
                    }}
                  />
                  <Stack sx={{
                    flexDirection: {
                      xs: "row",
                      md: "column",
                    }
                  }}>
                    <Typography variant="h6" fontWeight={500}>
                      {t("arrivalTime")}:
                    </Typography>
                    <Typography>{directionMeta.arrivalTime.format("hh:mm A")}</Typography>
                  </Stack>
                </>
              )}
            </Stack>
          </Paper>
          {buildOwnerSection()}
          <Button
            variant="contained"
            sx={{
              position: "fixed",
              bottom: "10px",
              width: "200px",
            }}
            onClick={() => onBook && onBook(parkingLocation)}
          >
            {t("preview")}
          </Button>
        </Stack>
      )}
    </>
  );
};

export default ParkingLocationPanel;

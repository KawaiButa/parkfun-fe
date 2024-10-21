"use client";
import { useEffect, useState } from "react";

import { Close } from "@mui/icons-material";
import { Stack, Typography, IconButton, Paper, Box, Button, CircularProgress, Divider } from "@mui/material";
import Image from "next/image";
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
          <Typography>{"Error when fetch data of this location's owner"}</Typography>
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
            Owner:
          </Typography>
          <Typography ml={1}>{parkingLocation.partner?.user.name}</Typography>
        </Typography>
        <Typography variant="body2">
          <Typography variant="h6" fontWeight={500}>
            Description:
          </Typography>
          <Typography ml={1}>{parkingLocation.partner?.description}</Typography>
        </Typography>
        <Typography variant="body2">
          <Typography variant="h6" fontWeight={500}>
            Location:
          </Typography>
          <Typography ml={1}>{parkingLocation.partner?.location}</Typography>
        </Typography>
        <Typography variant="body2">
          <Typography variant="h6" fontWeight={500}>
            Contact:
          </Typography>
          <Box ml={1}>
            {`Email: ${parkingLocation.partner?.user.email} `}
            <br />
            {`Phone number: ${parkingLocation.partner?.user.phoneNumber}`}
          </Box>
        </Typography>
      </Paper>
    );
  };
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" position="relative">
        <Typography variant="h3" fontWeight={600} color="primary">
          Parking details:
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
              About us:
            </Typography>
            <Typography variant="caption" ml={1}>
              {parkingLocation.description}
            </Typography>
          </Paper>
          <Paper>
            <Stack direction="row" p={2} gap={2} justifyContent="space-around">
              {directionMeta && (
                <>
                  <Box>
                    <Typography variant="h6" fontWeight={500}>
                      Distance:
                    </Typography>
                    <Typography>{(directionMeta.lengthInMeters / 1000).toFixed(2)} km</Typography>
                  </Box>
                  <Divider
                    sx={{
                      borderColor: "inherit",
                      borderWidth: "1px",
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={500}>
                      Departure time:
                    </Typography>
                    <Typography>{directionMeta.departureTime.format("hh:mm A")}</Typography>
                  </Box>
                  <Divider
                    sx={{
                      borderColor: "inherit",
                      borderWidth: "1px",
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={500}>
                      Arrive time:
                    </Typography>
                    <Typography>{directionMeta.arrivalTime.format("hh:mm A")}</Typography>
                  </Box>
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
            Preview
          </Button>
        </Stack>
      )}
    </>
  );
};

export default ParkingLocationPanel;

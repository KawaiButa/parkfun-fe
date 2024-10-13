"use client";
import { useEffect, useState } from "react";

import { Close } from "@mui/icons-material";
import { Stack, Typography, IconButton, Paper, Box, Button, CircularProgress } from "@mui/material";
import Carousel from "react-material-ui-carousel";

import { usePartner } from "@/hooks/usePartner";
import { ParkingLocation } from "@/interfaces";

const ParkingLocationPanel = (props: {
  parkingLocation: ParkingLocation;
  onClose?: (value: ParkingLocation) => void;
  onBook?: (value: ParkingLocation) => void;
}) => {
  const { onClose, onBook } = props;
  const [parkingLocation, setParkingLocation] = useState<ParkingLocation>(props.parkingLocation);
  const { fetchOnePartner } = usePartner();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetchOnePartner(props.parkingLocation.id)
      .then((value) => {
        if (value) setParkingLocation({ ...parkingLocation, partner: value });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props]);

  const buildOwnerSection = () => {
    if (loading) return <CircularProgress />;
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
          onClick={() => onClose && onClose(parkingLocation)}
        >
          <Close color="primary" />
        </IconButton>
      </Stack>
      {parkingLocation && (
        <>
          <Carousel
            sx={{
              width: "100%",
              minHeight: "300px",
              padding: "0px 10px",
            }}
            height={"300px"}
          >
            {parkingLocation.images.map((image) => (
              <img
                key={image.id}
                src={image.url}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // or cover, scale-down, etc.
                  borderRadius: "5px",
                }}
                alt={`Image ${image.id}`}
              />
            ))}
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
            Book
          </Button>
        </>
      )}
    </>
  );
};

export default ParkingLocationPanel;

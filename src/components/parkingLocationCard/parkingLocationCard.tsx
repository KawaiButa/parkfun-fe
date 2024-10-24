import React from "react";

import { Delete } from "@mui/icons-material";
import { Box, BoxProps, IconButton, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";

import { ParkingLocation } from "@/interfaces";

interface ParkingLocationCardProps extends BoxProps {
  data: ParkingLocation;
}
const ParkingLocationCard = (props: ParkingLocationCardProps) => {
  const { data, ...boxProps } = props;
  return (
    <Box
      sx={{
        width: "280px",
        height: "350px",
        borderRadius: "10px",
        backgroundColor: "white",
        overflow: "hidden",
        position: "relative",
        border: "1px solid grey",
      }}
      {...boxProps}
    >
      <Carousel sx={{ width: "100%", height: "60%" }} autoPlay={false} indicators={false}>
        {data.images &&
          data.images.map((image) => (
            <Box
              key={image.id}
              sx={{
                width: "100%",
                height: "100%",
              }}
            >
              <img
                src={image.url}
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  height: "220px",
                }}
              />
            </Box>
          ))}
      </Carousel>
      <Box sx={{ height: "40%", padding: "10px" }}>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            {data.name}
          </Typography>
        </Box>
        <Typography variant="body1">{data.address}</Typography>
        <Typography variant="caption">{data.description}</Typography>
      </Box>
      <IconButton
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: "white",
          opacity: 0.5,
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          cursor: "pointer",
          zIndex: 12,
          "&:hover": {
            opacity: 1,
          },
        }}
      >
        <Delete />
      </IconButton>
    </Box>
  );
};

export default ParkingLocationCard;

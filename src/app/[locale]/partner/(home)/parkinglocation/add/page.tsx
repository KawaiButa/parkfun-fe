"use client";
import { ArrowBackIos } from "@mui/icons-material";
import { Button, Container } from "@mui/material";
import { useRouter } from "next/navigation";

import ParkingLocationForm from "@/components/parkingLocationForm/parkingLocationFrom";

const Parking = () => {
  const router = useRouter();
  return (
    <Container
      sx={{
        backgroundColor: "background.default",
        borderRadius: "10px",
        position: "relative",
      }}
    >
      <Button
        variant="contained"
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
        }}
        onClick={() => {
          router.back();
        }}
        startIcon={<ArrowBackIos />}
      >
        Back
      </Button>
      <ParkingLocationForm />
    </Container>
  );
};

export default Parking;

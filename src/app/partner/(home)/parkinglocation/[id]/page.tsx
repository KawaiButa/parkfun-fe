"use client";
import React, { useEffect, useState } from "react";

import { ArrowBackIos } from "@mui/icons-material";
import { Button, Container } from "@mui/material";
import { redirect, useRouter } from "next/navigation";

import ParkingLocationForm from "@/components/parkingLocationForm/parkingLocationFrom";
import { useParkingLocation } from "@/hooks/useParkingLocation";
import { ParkingLocation } from "@/interfaces";

const EditPage = ({ params }: { params: { id: number } }) => {
  const { fetchOneParkingLocation } = useParkingLocation();
  const [parkingLocation, setParkingLocation] = useState<ParkingLocation | null>(null);
  const router = useRouter();
  useEffect(() => {
    fetchOneParkingLocation(params.id)
      .then((value) => {
        setParkingLocation(value);
      })
      .catch(() => {
        redirect("/partner/parkingLocation");
      });
  }, []);
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
        startIcon={<ArrowBackIos/>}
        onClick={() => {
          router.back();
        }}
      >
        Back
      </Button>
      <ParkingLocationForm initValue={parkingLocation} />
    </Container>
  );
};

export default EditPage;

"use client";

import { useEffect } from "react";

import { Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import ContainerFlexColumn from "@/components/containerFlexColumn/containerFlexColumn";
import ParkingSlotForm from "@/components/parkingSlotForm/parkingSlotForm";
import { useParkingLocation } from "@/hooks/useParkingLocation";

const Page = () => {
  const { parkingLocationList, fetchParkingLocation } = useParkingLocation();
  const router = useRouter();
  useEffect(() => {
    fetchParkingLocation();
  }, []);
  if (!parkingLocationList || parkingLocationList!.length == 0)
    return (
      <ContainerFlexColumn
        sx={{
          justifyContent: "center",
          backgroundColor: "background.default",
          height: "50vh",
          mt: "100px",
          borderRadius: "10px",
        }}
      >
        <Typography textAlign="center">{"You haven't registered any parking location."}</Typography>
        <Typography textAlign="center">
          {"You need to have at least one parking location to start create parking slot"}
        </Typography>
        <Button onClick={() => router.push("/partner/parkinglocation/add")}>
          Click here to create parking location
        </Button>
      </ContainerFlexColumn>
    );
  return <ParkingSlotForm parkingLocationList={parkingLocationList!}/>;
};

export default Page;

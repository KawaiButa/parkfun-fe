"use client";
import React, { useEffect } from "react";

import { Search } from "@mui/icons-material";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { PageContainer } from "@toolpad/core";
import { useRouter } from "next/navigation";

import ParkingLocationCard from "@/components/parkingLocationCard/parkingLocationCard";
import { useParkingLocation } from "@/hooks/useParkingLocation";
const ParkLocPage = () => {
  const { parkingLocationList, fetchParkingLocation } = useParkingLocation();
  useEffect(() => {
    fetchParkingLocation();
  }, []);
  return (
    <PageContainer
      title="PARKING LOCATION"
      sx={{
        backgroundColor: "background.default",
        padding: "10px",
        borderRadius: "10px",
        mt: "20px",
      }}
      slots={{
        toolbar: PageToolBar,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignSelf: "flex-end",
          pl: "50%",
          mb: "20px",
        }}
      >
        <TextField
          size="small"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
          fullWidth
          label="Search Parking Location"
          variant="standard"
          placeholder="Enter a location"
        />
      </Box>
      <Grid container spacing={2}>
        {parkingLocationList &&
          parkingLocationList.map((value) => (
            <Grid key={value.id}>
              <ParkingLocationCard data={value}/>
            </Grid>
          ))}
      </Grid>
    </PageContainer>
  );
};

const PageToolBar = () => {
  const router = useRouter();
  return (
    <Button
      variant="contained"
      onClick={() => {
        router.push("add");
      }}
      sx={{
        alignSelf: "flex-end",
      }}
    >
      Create
    </Button>
  );
};
export default ParkLocPage;

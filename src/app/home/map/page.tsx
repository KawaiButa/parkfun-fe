"use client";
import { useEffect, useState } from "react";

import { Sort } from "@mui/icons-material";
import { Autocomplete, Box, IconButton, Stack } from "@mui/material";
import dynamic from "next/dynamic";
import { AzureMapFeature, AzureMapsProvider } from "react-azure-maps";
import { useForm } from "react-hook-form";

import { FormTextInput } from "@/components/formTextInput/formTextInput";
import { useParkingLocation } from "@/hooks/useParkingLocation";
import { ParkingLocation } from "@/interfaces";

const AzureMapWithoutSSR = dynamic(() => import("@/components/azureMap/azureMapComponent"), {
  loading: () => <p>Loading React azure maps ...</p>,
  ssr: false,
});
const MapPage = () => {
  const { searchParkingLocation } = useParkingLocation();
  const [parkingLocationList, setParkingLocation] = useState<ParkingLocation[]>([]);
  const { control } = useForm({
    defaultValues: {
      param: "",
    },
  });
  useEffect(() => {
    searchParkingLocation({
      lat: 21.03,
      lng: 105.855,
      radius: 10,
      priceStartAt: 10,
      priceEndAt: 30,
      services: "0-1",
    }).then((value) => {
      setParkingLocation(value ?? []);
    });
  }, []);
  return (
    <div>
      <AzureMapsProvider>
        <Box
          sx={{
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "500px",
              height: "100%",
              backgroundColor: "background.default",
              zIndex: 1000,
              display: "flex",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <Stack direction="row" width={"100%"}>
              <Autocomplete
                sx={{
                  width: "100%",
                }}
                renderInput={(params) => (
                  <FormTextInput
                    name="param"
                    control={control}
                    {...params}
                    size="small"
                    fullWidth
                    autoComplete="true"
                  />
                )}
                options={parkingLocationList.map(({ name }) => name)}
              />
              <IconButton sx={{
                height: "fit-content"
              }}>
                <Sort/>
              </IconButton>
            </Stack>
          </Box>
          <AzureMapWithoutSSR
            data={parkingLocationList}
            iconOptions={{
              image: "pin-blue",
            }}
            render={(value) => (
              <AzureMapFeature
                id={"" + (value as ParkingLocation).id}
                type="Point"
                coordinate={[(value as ParkingLocation).lng ?? 0, (value as ParkingLocation).lat ?? 0]}
                properties={{
                  ...(value as ParkingLocation),
                }}
              />
            )}
            renderPopUp={(value) => {
              return (
                <div style={{ padding: "10px 20px" }}>
                  <h3>{(value as ParkingLocation).name}</h3>
                  <p>{(value as ParkingLocation).address}</p>
                </div>
              );
            }}
          />
        </Box>
      </AzureMapsProvider>
    </div>
  );
};

export default MapPage;

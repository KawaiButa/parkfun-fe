/* eslint-disable @next/next/no-img-element */
"use client";
import { MouseEvent, useEffect, useRef, useState } from "react";

import { Close, DirectionsWalk, NavigationOutlined, Sort } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { isNumber } from "lodash";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { AzureMapFeature, useAzureMaps } from "react-azure-maps";
import { Controller, useForm } from "react-hook-form";
import Carousel from "react-material-ui-carousel";

import BookingTimePicker from "@/components/bookingForm/bookingTimePicker/bookingTimePicker";
import BookingModal from "@/components/bookingModal/bookingModal";
import FilterForm from "@/components/filterForm/filterForm";
import { AzureRoute } from "@/hooks/azureRoute";
import { useSearchMapAPI } from "@/hooks/useMapApi";
import { useParkingLocation } from "@/hooks/useParkingLocation";
import { useParkingService } from "@/hooks/useParkingService";
import { useParkingSlotType } from "@/hooks/useParkingSlotType";
import { ParkingLocation } from "@/interfaces";
import { ParkingService } from "@/interfaces/parkingService";
import { ParkingSlotType } from "@/interfaces/parkingSlotType";
import { SearchParkingLocationData } from "@/interfaces/searchParkingLocationData";
import { AzureAPI } from "@/utils/azureAPI";
import { getNearestRoundTime, secondToDayTime, timeToSeconds } from "@/utils/utils";

const AzureMapWithoutSSR = dynamic(() => import("@/components/azureMap/azureMapComponent"), {
  loading: () => <p>Loading React azure maps ...</p>,
  ssr: false,
});
const MapPage = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const searchParam = useSearchParams();
  const { searchParkingLocation } = useParkingLocation();
  const [parkingLocationList, setParkingLocation] = useState<ParkingLocation[]>([]);
  const [selectedParkingLocation, setSelectedParkingLocation] = useState<ParkingLocation | null>(null);
  const [openFilter, setOpenFilter] = useState(false);
  const { parkingServiceList, fetchParkingService } = useParkingService();
  const { parkingSlotTypeList, fetchParkingSlotType } = useParkingSlotType();
  const { mapRef } = useAzureMaps();
  const [center, setCenter] = useState<number[]>([0, 0]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("distance");
  const filterFormData = [
    { name: "width", type: "slider", label: "Width", max: "500"},
    { name: "height", type: "slider", label: "Height", max: "500"},
    { name: "length", type: "slider", label: "Length", max: "500"},
    { name: "radius", type: "slider", label: "Radius" },
    { name: "price", type: "slider", label: "Price" },
    {
      name: "services",
      type: "checkbox",
      options: parkingServiceList ?? [],
      label: "Services",
      transformLabel: (value: ParkingService) => value.name,
      transformValue: (value: ParkingService) => value.id,
    },
    {
      name: "type",
      type: "radio",
      options: parkingSlotTypeList ?? [],
      label: "Parking type",
      transformLabel: (value: ParkingSlotType) => value.name,
      transformValue: (value: ParkingSlotType) => value.id,
    },
  ];
  const { control, handleSubmit, setValue } = useForm<SearchParkingLocationData>({
    defaultValues: {
      position: [0, 0],
      type: "All",
      price: [10, 1000],
      time: [timeToSeconds(getNearestRoundTime(dayjs())), timeToSeconds(dayjs()) + 3600],
      radius: 10,
      width: 90,
      height: 200,
      length: 300,
      services: [],
    },
  });
  const { setParam, locations } = useSearchMapAPI();
  useEffect(() => {
    searchParam.forEach((value, key) => setValue(key as keyof SearchParkingLocationData, +value));
    if (!searchParam.get("lat") && !searchParam.get("lng") && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter([position.coords.longitude, position.coords.latitude]);
      });
    }
    fetchParkingSlotType();
    fetchParkingService();
  }, []);
  useEffect(() => {
    if (mapRef && selectedParkingLocation && selectedParkingLocation.lat && selectedParkingLocation.lng) {
      const center = [+selectedParkingLocation.lng, +selectedParkingLocation.lat];
      mapRef.setCamera({ center: center, zoom: 16 });
    }
  }, [mapRef, selectedParkingLocation]);
  const buildParkingLocationList = () => {
    if (isLoading) return <CircularProgress />;
    if (!parkingLocationList.length)
      return (
        <Stack
          sx={{
            margin: "5px",
          }}
          justifyContent="center"
        >
          <Typography textAlign="center">There is no availabal parking slot near you</Typography>
        </Stack>
      );
    const sortedArray = parkingLocationList.sort(
      (a, b) => (a[sortBy as keyof ParkingLocation] as number) - (b[sortBy as keyof ParkingLocation] as number)
    );
    return sortedArray.map((parkingLocation) => {
      return (
        <ParkingLocationCard
          key={parkingLocation.id}
          parkingLocation={parkingLocation}
          onClick={(e, value) => setSelectedParkingLocation(value)}
          origin={center}
        />
      );
    });
  };
  const onSubmit = (formData: SearchParkingLocationData) => {
    setIsLoading(true);
    mapRef?.setCamera(formData.position);
    const { type, ...data } = formData;
    (isNumber(type) ? searchParkingLocation({ ...data, type }) : searchParkingLocation(data))
      .then((result) => {
        setParkingLocation(result ?? []);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
        }}
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
      >
        <Stack
          className="list-panel"
          direction="column"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: {
              xs: "100%",
              md: "500px",
            },
            height: "100%",
            backgroundColor: "background.default",
            color: "secondary.contrastText",
            zIndex: 1,
            justifyContent: "flex-start",
            padding: "20px 10px",
            overflow: "auto",
          }}
        >
          <Stack direction="row" width={"100%"} alignItems="center">
            <Autocomplete
              fullWidth
              options={locations}
              getOptionLabel={(location) => location.properties?.address?.formattedAddress ?? ""}
              slotProps={{
                popper: {
                  color: "white",
                },
              }}
              onChange={(_, value) => {
                setValue("position", value?.geometry.coordinates ?? []);
                handleSubmit(onSubmit)();
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
                    fullWidth
                    onChange={(e) => {
                      setParam(e.target.value);
                    }}
                    size="small"
                  />
                );
              }}
            />
            <IconButton
              sx={{
                height: "fit-content",
              }}
              onClick={() => setOpenFilter(!openFilter)}
            >
              <Sort color="primary" />
            </IconButton>
          </Stack>
          <Stack
            sx={{
              flexDirection: {
                xs: "column",
                md: "row",
              },
              justifyContent: {
                xs: "flex-start",
                md: "space-between",
              },
            }}
            alignItems="center"
            mb={2}
          >
            <Typography
              variant="caption"
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
              }}
            >
              {`Showing ${parkingLocationList.length} from total ${100} near you`}
            </Typography>
            <FormControl>
              <Stack direction="row" sx={{ padding: "0 10px" }}>
                <RadioGroup row value={sortBy}>
                  {["Distance", "Price"].map((option) => {
                    return (
                      <FormControlLabel
                        key={option}
                        value={option.toLowerCase()}
                        control={<Radio />}
                        label={option}
                        onChange={() => setSortBy(option.toLowerCase())}
                      />
                    );
                  })}
                </RadioGroup>
              </Stack>
            </FormControl>
          </Stack>

          <Controller
            control={control}
            name="time"
            render={({ field: { onChange, value } }) => {
              return (
                <BookingTimePicker
                  defaultStartTime={secondToDayTime(value[0])}
                  defaultEndTime={secondToDayTime(value[1])}
                  onStartChange={(e) => onChange([e, value[1]])}
                  onEndChange={(e) => onChange([value[0], e])}
                />
              );
            }}
          />
          {buildParkingLocationList()}
        </Stack>
        <Stack
          className="detail-panel"
          sx={{
            position: "absolute",
            zIndex: 3,
            width: {
              xs: "100%",
              md: "500px",
            },
            height: "100%",
            overflow: "hidden",
            transition: "left 0.3s ease-in-out",
            top: 0,
            gap: "10px",
            color: "secondary.contrastText",
            left: selectedParkingLocation ? 0 : "-600px",
            backgroundColor: "background.default",
            justifyContent: "flex-start",
            padding: "10px",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" position="relative">
            <Typography variant="h3" fontWeight={600} color="primary">
              Parking details:
            </Typography>
            <IconButton
              sx={{
                width: "fit-content",
              }}
              onClick={() => setSelectedParkingLocation(null)}
            >
              <Close color="primary" />
            </IconButton>
          </Stack>
          {selectedParkingLocation && (
            <>
              <Carousel
                sx={{
                  width: "100%",
                  minHeight: "300px",
                  padding: "0px 10px",
                }}
              >
                {selectedParkingLocation.images.map((image) => (
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
                {selectedParkingLocation.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  padding: "0px 10px",
                }}
              >
                {selectedParkingLocation.address}
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
                  {selectedParkingLocation.description}
                </Typography>
              </Paper>
              <Paper
                sx={{
                  padding: "10px",
                }}
              >
                <Typography variant="body2">
                  <Typography variant="h6" fontWeight={500}>
                    Owner:
                  </Typography>
                  <Typography ml={1}>{selectedParkingLocation.partner?.user.name}</Typography>
                </Typography>
                <Typography variant="body2">
                  <Typography variant="h6" fontWeight={500}>
                    Description:
                  </Typography>
                  <Typography ml={1}>{selectedParkingLocation.partner?.description}</Typography>
                </Typography>
                <Typography variant="body2">
                  <Typography variant="h6" fontWeight={500}>
                    Location:
                  </Typography>
                  <Typography ml={1}>{selectedParkingLocation.partner?.location}</Typography>
                </Typography>
                <Typography variant="body2">
                  <Typography variant="h6" fontWeight={500}>
                    Contact:
                  </Typography>
                  <Box ml={1}>
                    {`Email: ${selectedParkingLocation.partner?.user.email} `}
                    <br />
                    {`Phone number: ${selectedParkingLocation.partner?.user.phoneNumber}`}
                  </Box>
                </Typography>
              </Paper>

              <Button
                variant="contained"
                sx={{
                  position: "fixed",
                  bottom: "10px",
                  width: "200px",
                }}
                onClick={() => {
                  setOpen(true);
                }}
              >
                Book
              </Button>
            </>
          )}
        </Stack>
        <Stack
          className="filter-panel"
          sx={{
            position: "absolute",
            color: "secondary.contrastText",
            zIndex: 2,
            width: {
              xs: "100%",
              md: "500px",
            },
            height: "80%",
            overflow: "hidden",
            transition: "bottom 0.3s ease-in-out",
            bottom: openFilter ? "0px" : "-100%",
            gap: "10px",
            backgroundColor: "background.paper",
            justifyContent: "flex-start",
            padding: "20px 10px",
          }}
        >
          <Typography variant="h3" fontWeight={600} color="primary">
            Filter by:
          </Typography>
          <Box sx={{ padding: "0 10px" }}>
            <FilterForm control={control} data={filterFormData}></FilterForm>
          </Box>
          <Button fullWidth variant="contained" color="primary" type="submit">
            Filter
          </Button>
        </Stack>
        <AzureMapWithoutSSR
          data={parkingLocationList}
          iconOptions={{
            image: "pin-blue",
          }}
          onClick={(e) => setSelectedParkingLocation(e as ParkingLocation)}
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
        />
        <Button
          startIcon={<NavigationOutlined />}
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "secondary.main",
            color: "white",
            borderRadius: "5px",
            padding: "10px",
            "&:hover": {
              backgroundColor: "secondary.dark",
            },
          }}
          onClick={() => {
            if (mapRef) {
              navigator.geolocation.getCurrentPosition((position) => {
                mapRef.setCamera({
                  center: [position.coords.longitude, position.coords.latitude],
                  zoom: 16,
                });
              });
            }
          }}
        >
          Center
        </Button>
      </Box>
      {open && selectedParkingLocation && (
        <BookingModal
          open={open}
          parkingSlotList={selectedParkingLocation.parkingSlots.map(({ id }) => id)}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

const ParkingLocationCard = (props: {
  parkingLocation: ParkingLocation;
  onClick: (e: MouseEvent, value: ParkingLocation) => void;
  origin: number[];
}) => {
  const { parkingLocation, origin, onClick } = props;
  const [routingSummary, setRoutingSummary] = useState<AzureRoute | null>(null);
  useEffect(() => {
    const { lat, lng } = parkingLocation;
    if (lat && lng)
      AzureAPI.routing(origin, [lng, lat]).then((value) => {
        setRoutingSummary(value[0]);
      });
  }, []);
  return (
    <Stack
      component={"button"}
      key={parkingLocation.id}
      sx={{
        margin: "10px",
        cursor: "pointer",
        borderRadius: "5px",
        backgroundColor: "background.paper",
        color: "secondary.contrastText",
        padding: " 10px",
        height: "110px",
        gap: "10px",
        border: "none",
        "&:hover": {
          border: "1.5px solid",
          borderColor: "primary.main",
        },
      }}
      onClick={(e) => {
        onClick(e, parkingLocation);
      }}
      direction="row"
    >
      <Carousel
        sx={{
          width: "160px",
          height: "100%",
        }}
        indicators={false}
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
      <Stack color="secondary" justifyContent={"space-between"}>
        <Box>
          <Typography variant="body1" fontWeight={500}>
            {parkingLocation.name}
          </Typography>
          <Typography variant="caption">{parkingLocation.address}</Typography>
        </Box>
        {routingSummary && (
          <Stack direction="row" justifyContent="space-between">
            <Typography fontSize="13px">
              <DirectionsWalk sx={{ fontSize: "16px" }} />
              {" " + routingSummary.lengthInMeters / 1000} km
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default MapPage;

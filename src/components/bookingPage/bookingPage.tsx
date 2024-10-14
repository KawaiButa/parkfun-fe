"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { MouseEvent, useEffect, useReducer, useRef, useState } from "react";

import { Close, DirectionsWalk, NavigationOutlined, Sort } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNotifications } from "@toolpad/core";
import atlas, { source } from "azure-maps-control";
import dayjs from "dayjs";
import { isNumber } from "lodash";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import Carousel from "react-material-ui-carousel";

import BookingTimePicker from "@/components/bookingForm/bookingTimePicker/bookingTimePicker";
import BookingModal from "@/components/bookingModal/bookingModal";
import FilterForm from "@/components/filterForm/filterForm";
import ParkingLocationPanel from "@/components/parkingLocationPanel/parkingLocationPanel";
import { useSearchMapAPI } from "@/hooks/useMapApi";
import { useParkingLocation } from "@/hooks/useParkingLocation";
import { useParkingService } from "@/hooks/useParkingService";
import { useParkingSlotType } from "@/hooks/useParkingSlotType";
import { ParkingLocation } from "@/interfaces";
import { AzureRoute } from "@/interfaces/azureRoute";
import { ParkingService } from "@/interfaces/parkingService";
import { ParkingSlotType } from "@/interfaces/parkingSlotType";
import { SearchParkingLocationData } from "@/interfaces/searchParkingLocationData";
import { AzureAPI } from "@/utils/azureAPI";
import { getNearestRoundTime, secondToDayTime, timeToSeconds } from "@/utils/utils";



const AzureMapComponentWithoutSSR = dynamic(() => import("@/components/azureMap/azureMapComponent"), {
  loading: () => <p>Loading React azure maps ...</p>,
  ssr: false,
});
const MapPage = () => {
  const reactMapRef = useRef<any | null>(null);
  const searchParam = useSearchParams();
  const { searchParkingLocation } = useParkingLocation();
  const [parkingLocationList, setParkingLocation] = useState<ParkingLocation[]>([]);
  const [selectedParkingLocation, setSelectedParkingLocation] = useState<ParkingLocation | null>(null);
  const [openFilter, setOpenFilter] = useState(false);
  const { parkingServiceList, fetchParkingService } = useParkingService();
  const { parkingSlotTypeList, fetchParkingSlotType } = useParkingSlotType();
  const { mapRef, isMapReady } = reactMapRef.current ? reactMapRef.current.useAzureMaps(): {mapRef: null, isMapReady: null};

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("distance");
  const notifications = useNotifications();
  const filterFormData = [
    { name: "width", type: "slider", label: "Width", max: "500" },
    { name: "height", type: "slider", label: "Height", max: "500" },
    { name: "length", type: "slider", label: "Length", max: "500" },
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
      time:
        searchParam.get("startAt") && searchParam.get("endAt")
          ? [+searchParam.get("startAt")!, +searchParam.get("endAt")!]
          : [timeToSeconds(getNearestRoundTime(dayjs())), timeToSeconds(dayjs()) + 3600],
      radius: 10000,
      width: 90,
      height: 200,
      length: 300,
      services: [],
    },
  });
  const { setParam, locations } = useSearchMapAPI();
  const setCenter = (point: number[]) => {
    if (mapRef) {
      const dataSource = mapRef.sources.getById("center AzureMapDataSourceProvider") as source.DataSource;
      if (!dataSource) return;
      const centerShape = dataSource.getShapeById("center");
      if (!centerShape) {
        dataSource.add(
          new atlas.data.Feature(
            new atlas.data.Point(point),
            {
              id: "center",
              type: "Point",
            },
            "center"
          )
        );
      } else centerShape.setCoordinates(point);
      mapRef.setCamera({ center: point, zoom: 16 });
    }
  };
  const forceUpdate = useReducer(() => ({}), {})[1];
  useEffect(() => {
    import("react-azure-maps").then((module) => {
      reactMapRef.current = module;
      forceUpdate();
    });
  }, []);
  useEffect(() => {
    if (isMapReady) {
      let point = [0, 0];
      if (searchParam.get("lat") && searchParam.get("lng")) {
        point = [+searchParam.get("lng")!, +searchParam.get("lat")!];
      } else {
        navigator.geolocation.getCurrentPosition((position) => {
          point = [position.coords.longitude, position.coords.latitude];
        });
      }
      setValue("position", point);
      fetchParkingSlotType();
      fetchParkingService();
      handleSubmit(onSubmit)();
    }
  }, [mapRef, isMapReady]);
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
          onClick={(e, value) => {
            setSelectedParkingLocation(value);
            if (value.lat && value.lng && mapRef) mapRef.setCamera({ center: [+value.lng, +value.lat], zoom: 16 });
          }}
        />
      );
    });
  };
  const getRoute = async (parkingLocationList: ParkingLocation[]): Promise<ParkingLocation[]> => {
    if (parkingLocationList.length == 0) return [];
    const destinations = parkingLocationList.filter(({ lat, lng }) => lat && lng).map(({ lat, lng }) => [lng!, lat!]);
    try {
      const res = await AzureAPI.routing([0, 0], destinations);
      const locationWithRoute = parkingLocationList.map((location, index) => ({ ...location, route: res[index] }));
      return locationWithRoute;
    } catch (e) {
      notifications.show((e as Error).message, {
        severity: "error",
        autoHideDuration: 5000,
      });
      return parkingLocationList;
    }
  };
  const onSubmit = (formData: SearchParkingLocationData) => {
    setIsLoading(true);
    setCenter(formData.position);
    const { type, ...data } = formData;
    (isNumber(type) ? searchParkingLocation({ ...data, type }) : searchParkingLocation(data))
      .then((result) => {
        const typeSafedResult = result ?? [];
        setParkingLocation(typeSafedResult);
        getRoute(typeSafedResult).then((value) => {
          if (mapRef) {
            const dataSource = mapRef.sources.getById(
              "parkingLocation AzureMapDataSourceProvider"
            ) as source.DataSource;
            dataSource.clear();
            dataSource.add(
              value
                .filter(({ lat, lng }) => lat && lng)
                .map((location) => {
                  const { lat, lng } = location;
                  return new atlas.data.Feature(new atlas.data.Point([lng!, lat!]), location);
                })
            );
          }
        });
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
                const point = value?.geometry.coordinates;
                if (point) setValue("position", point);
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
          <Stack
            sx={{
              width: "100%",
              overflow: "auto",
            }}
          >
            {buildParkingLocationList()}
          </Stack>
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
          {selectedParkingLocation && (
            <ParkingLocationPanel
              parkingLocation={selectedParkingLocation}
              onBook={() => setOpen(true)}
              onClose={() => setSelectedParkingLocation(null)}
            />
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
              md: "490px",
            },
            height: "80%",
            overflow: "scroll",
            transition: "bottom 0.3s ease-in-out",
            bottom: openFilter ? "0px" : "-100%",
            gap: "10px",
            borderRadius: "5px",
            backgroundColor: "background.paper",
            justifyContent: "flex-start",
            padding: "20px 10px",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h3" fontWeight={600} color="primary">
              Filter by:
            </Typography>
            <IconButton>
              <Close onClick={() => setOpenFilter(false)} />
            </IconButton>
          </Stack>
          <Box sx={{ padding: "0 10px" }}>
            <FilterForm control={control} data={filterFormData}></FilterForm>
          </Box>
          <Button fullWidth variant="contained" color="primary" type="submit">
            Filter
          </Button>
        </Stack>
          <AzureMapComponentWithoutSSR
            data={parkingLocationList}
            iconOptions={{
              image: "pin-blue",
            }}
            onClick={(e) => setSelectedParkingLocation(e as ParkingLocation)}
            render={() => (
              <>
                {reactMapRef.current && (
                  <reactMapRef.current.AzureMapLayerProvider
                    id="parkingLocation AuzureLayerProvider"
                    type="SymbolLayer"
                    options={{
                      iconOptions: {
                        image: "blue-red",
                      },
                    }}
                  />
                )}
              </>
            )}
            renderCenter={() =>
              reactMapRef.current && (
                <reactMapRef.current.AzureMapLayerProvider
                  id="center AuzureLayerProvider"
                  type="SymbolLayer"
                  options={{
                    iconOptions: {
                      image: "pin-red",
                    },
                  }}
                />
              )
            }
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
              const dataSource = mapRef.sources.getById("center AzureMapDataSourceProvider") as source.DataSource;
              if (!dataSource) return;
              const centerShape = dataSource.getShapeById("center");
              if (centerShape) mapRef?.setCamera({ center: centerShape.getCoordinates(), zoom: 16 });
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
  route?: AzureRoute;
}) => {
  const { parkingLocation, route, onClick } = props;
  return (
    <Stack
      component={"button"}
      type="button"
      key={parkingLocation.id}
      sx={{
        margin: "10px",
        cursor: "pointer",
        borderRadius: "5px",
        backgroundColor: "background.paper",
        color: "secondary.contrastText",
        padding: " 10px",
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
          // height: "100%",
        }}
        indicators={false}
        navButtonsAlwaysInvisible
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
        {route && (
          <Stack direction="row" justifyContent="space-between">
            <Typography fontSize="13px">
              <DirectionsWalk sx={{ fontSize: "16px" }} />
              {" " + route.lengthInMeters / 1000} km
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default MapPage;

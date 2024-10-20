"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { MouseEvent, useEffect, useReducer, useRef, useState } from "react";

import { FeaturesItemOutput } from "@azure-rest/maps-search";
import { Close, DirectionsWalk, Menu, NavigationOutlined, Search, Sort } from "@mui/icons-material";
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
import { useDialogs, useNotifications } from "@toolpad/core";
import atlas, { source } from "azure-maps-control";
import dayjs from "dayjs";
import { isNumber } from "lodash";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import Carousel from "react-material-ui-carousel";

import BookingTimePicker from "@/components/bookingForm/bookingTimePicker/bookingTimePicker";
import FilterForm from "@/components/filterForm/filterForm";
import ParkingLocationPanel from "@/components/parkingLocationPanel/parkingLocationPanel";
import { constants } from "@/constants";
import { useSearchMapAPI } from "@/hooks/useMapApi";
import { SearchedParkingLocation, useParkingLocation } from "@/hooks/useParkingLocation";
import { useParkingService } from "@/hooks/useParkingService";
import { useParkingSlotType } from "@/hooks/useParkingSlotType";
import { ParkingLocation } from "@/interfaces";
import { ParkingService } from "@/interfaces/parkingService";
import { ParkingSlotType } from "@/interfaces/parkingSlotType";
import { SearchParkingLocationData } from "@/interfaces/searchParkingLocationData";
import { AzureAPI } from "@/utils/azureAPI";
import { calculateZoomLevel, getNearestRoundTime } from "@/utils/utils";

import BookingModal from "../bookingModal/bookingModal";
import { useLocation } from "@/context/locationContext";
import { DirectionMeta } from "@/interfaces/directionMeta";

type MapParkingLocation = SearchedParkingLocation | ParkingLocation;
const AzureMapComponentWithoutSSR = dynamic(() => import("@/components/azureMap/azureMapComponent"), {
  loading: () => <p>Loading React azure maps ...</p>,
  ssr: false,
});
const MapPage = () => {
  const reactMapRef = useRef<any | null>(null);
  const searchParam = useSearchParams();
  const { searchParkingLocation, hasNextPage } = useParkingLocation();
  const [parkingLocationList, setParkingLocation] = useState<SearchedParkingLocation[]>([]);
  const [selectedParkingLocation, setSelectedParkingLocation] = useState<MapParkingLocation | null>(null);
  const [openFilter, setOpenFilter] = useState(false);
  const { parkingServiceList, fetchParkingService } = useParkingService();
  const { parkingSlotTypeList, fetchParkingSlotType } = useParkingSlotType();
  const { mapRef, isMapReady } = reactMapRef.current
    ? reactMapRef.current.useAzureMaps()
    : { mapRef: null, isMapReady: null };
  const dialogs = useDialogs();
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("distance");
  const notifications = useNotifications();
  const [directionMetaData, setDirectionMetaData] = useState<DirectionMeta | null>(null);
  const { location } = useLocation();
  const [showFullMap, setShowFullMap] = useState(false);
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
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SearchParkingLocationData>({
    defaultValues: {
      position: [0, 0],
      type: "All",
      price: [10, 1000],
      time:
        searchParam.get("startAt") && searchParam.get("endAt")
          ? [dayjs(searchParam.get("startAt")), dayjs(searchParam.get("endAt"))]
          : [getNearestRoundTime(dayjs()), getNearestRoundTime(dayjs()).add(30, "minutes")],
      radius: 10,
      width: 200,
      height: 200,
      length: 300,
      services: [],
    },
  });
  const position = useWatch({ control, name: "position" });
  const radius = useWatch({ control, name: "radius" });
  const { setParam, locations, isLoading: isSearchLocationLoading } = useSearchMapAPI();
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
      mapRef.setCamera({ center: point, zoom: constants.DEFAULT_ZOOM_LEVEL });
    }
  };
  const time = useWatch({ control, name: "time" });
  const forceUpdate = useReducer(() => ({}), {})[1];
  const checkAndRequestUnresolvedBooking = async () => {
    const unresolvedBooking = localStorage.getItem("booking");

    if (unresolvedBooking) {
      const booking = JSON.parse(unresolvedBooking);
      const { startAt, endAt } = booking;
      const continueBooking = await dialogs.confirm("You have an unresolved booking. Do you want to continue?");
      if (continueBooking) {
        dialogs.open(BookingModal, {
          startAt: time[0],
          endAt: time[1],
          initialValue: { ...booking, time: [dayjs(startAt), dayjs(endAt)] },
        });
        localStorage.removeItem("booking");
      }
    }
  };

  useEffect(() => {
    import("react-azure-maps").then((module) => {
      reactMapRef.current = module;
      forceUpdate();
    });
    checkAndRequestUnresolvedBooking();
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
  const handleChangeSelectedParkingLocation = async (parkingLocation: MapParkingLocation | null) => {
    if (!mapRef) return;
    const dataSource = mapRef.sources.getById("direction AzureMapDataSourceProvider") as source.DataSource;
    if (!dataSource) return;
    dataSource.clear();
    if (!parkingLocation) {
      setSelectedParkingLocation(null);
      return;
    }
    setSelectedParkingLocation(parkingLocation);
    try {
      const direction = await AzureAPI.directions(
        [position[1], position[0]],
        [parkingLocation.lat, parkingLocation.lng]
      );
      if (direction) {
        const { featuresCollection, meta } = direction;
        dataSource.setShapes(featuresCollection);
        setDirectionMetaData(meta);
      }
    } catch (err) {
      notifications.show((err as Error).message, {
        severity: "error",
        autoHideDuration: 5000,
      });
    }
  };
  const buildParkingLocationList = () => {
    if (isLoading)
      return (
        <Stack justifyContent="center" pt={2}>
          <CircularProgress
            sx={{
              margin: "auto",
            }}
          />
        </Stack>
      );
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
      (a, b) =>
        (a[sortBy as keyof SearchedParkingLocation] as number) - (b[sortBy as keyof SearchedParkingLocation] as number)
    );
    return sortedArray.map((parkingLocation) => {
      return (
        <ParkingLocationCard
          key={parkingLocation.id}
          parkingLocation={parkingLocation}
          onClick={(e, value) => handleChangeSelectedParkingLocation(value)}
        />
      );
    });
  };
  const onSubmit = (formData: SearchParkingLocationData) => {
    setIsLoading(true);
    setCenter(formData.position);
    setOpenFilter(false);
    const { type, ...data } = formData;
    (isNumber(type) ? searchParkingLocation({ ...data, type }) : searchParkingLocation(data))
      .then((result) => {
        const finalData = result ?? [];
        if (mapRef) {
          const dataSource = mapRef.sources.getById("parkingLocation AzureMapDataSourceProvider") as source.DataSource;
          if (!dataSource) return;
          dataSource.clear();
          dataSource.add(
            finalData
              .map((parkingLocation) => {
                const { lat, lng } = parkingLocation;
                if (!lat || !lng) return null;
                return new atlas.data.Feature(new atlas.data.Point([lng, lat]), {
                  id: parkingLocation.id,
                  type: "Point",
                  properties: {
                    ...parkingLocation,
                    lat,
                    lng,
                  },
                });
              })
              .filter((a) => a != null)
          );
          const zoomLevel = calculateZoomLevel(
            finalData
              .map(({ lat, lng }) => {
                if (!lat || !lng) return null;
                return {
                  lat,
                  lng,
                };
              })
              .filter((a) => a != null),
            window.screen.width * 0.8,
            window.screen.height
          );
          const center = mapRef.getCamera().center;
          if (zoomLevel !== 0 && typeof center[0] === "number") {
            mapRef.setCamera({ center: center, zoom: zoomLevel });
          }
        }
        setParkingLocation(finalData);
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
        <IconButton
          onClick={() => setShowFullMap(false)}
          sx={{
            top: 10,
            left: 10,
            zIndex: 1,
            position: "absolute",
            backgroundColor: "secondary.main",
          }}
          color="primary"
        >
          <Menu />
        </IconButton>
        <Stack
          className="list-panel"
          direction="column"
          sx={{
            position: "absolute",
            top: 10,
            left: selectedParkingLocation || showFullMap ? "-50%" : 10,
            width: {
              xs: "100%",
              md: "500px",
            },
            borderRadius: 2,
            maxHeight: "100%",
            backgroundColor: "background.default",
            color: "secondary.contrastText",
            zIndex: 1,
            justifyContent: "flex-start",
            padding: "20px 10px",
            transition: "left 0.3s ease-in-out",
          }}
        >
          <Stack direction="row" width={"100%"} alignItems="center">
            <IconButton onClick={() => setShowFullMap(true)}>
              <Close color="primary" />
            </IconButton>
            <Autocomplete
              fullWidth
              loading={isSearchLocationLoading}
              options={[...locations, location]}
              getOptionLabel={(location) => {
                if (location instanceof Array) return "Find parking location arount my location.";
                return (location as FeaturesItemOutput).properties?.address?.formattedAddress ?? "";
              }}
              slotProps={{
                popper: {
                  color: "white",
                },
              }}
              onChange={(_, value) => {
                if (value) {
                  const point =
                    value instanceof Array ? [value[0], value[1]] : (value as FeaturesItemOutput).geometry.coordinates;
                  if (point) setValue("position", point);
                  handleSubmit(onSubmit)();
                }
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
            <Stack direction="row">
              <IconButton onClick={() => handleSubmit(onSubmit)()}>
                <Search color="primary" />
              </IconButton>
              <IconButton
                sx={{
                  height: "fit-content",
                  color: openFilter ? "primary.main" : "secondary.contrastText",
                }}
                onClick={() => setOpenFilter(!openFilter)}
              >
                <Sort color="primary" />
              </IconButton>
            </Stack>
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
                  {[
                    { label: "Distance", key: "distance" },
                    { label: "Price", key: "minPrice" },
                  ].map(({ label, key }) => {
                    return (
                      <FormControlLabel
                        key={key}
                        value={key}
                        control={<Radio />}
                        label={label}
                        onChange={() => setSortBy(key)}
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
                  defaultStartTime={value[0]}
                  defaultEndTime={value[1]}
                  onStartChange={(e) => onChange([e, value[1]])}
                  onEndChange={(e) => onChange([value[0], e])}
                  slotProps={{
                    leftTimePicker: {
                      sx: {
                        "& fieldset": {
                          borderColor: "secondary.contrastText",
                        },
                        "&:hover": {
                          "& fieldset": {
                            borderColor: "primary",
                          },
                        },
                        "& svg": {
                          color: "secondary.contrastText",
                        },
                      },
                    },
                    rightTimePicker: {
                      sx: {
                        width: "200px",
                        "& fieldset": {
                          borderColor: "secondary.contrastText",
                        },
                        "& svg": {
                          color: "secondary.contrastText",
                        },
                      },
                    },
                  }}
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
            {Object.values(errors).length ? Object.values(errors)[0].message : buildParkingLocationList()}
            {!isLoading && (
              <Button
                onClick={() => {
                  if (!hasNextPage) setValue("radius", (radius ?? 5) + 5);
                  handleSubmit(onSubmit)();
                }}
              >
                Load more
              </Button>
            )}
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
              onBook={() =>
                dialogs.open(BookingModal, {
                  parkingSlotList: (selectedParkingLocation as SearchedParkingLocation).parkingSlotIds,
                  startAt: time[0],
                  endAt: time[1],
                })
              }
              directionMeta={directionMetaData}
              onClose={() => handleChangeSelectedParkingLocation(null)}
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
              <Close onClick={() => setOpenFilter(false)} color="primary" />
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
          onClick={(e) => handleChangeSelectedParkingLocation(e as MapParkingLocation)}
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
    </>
  );
};

const ParkingLocationCard = (props: {
  parkingLocation: SearchedParkingLocation;
  onClick: (e: MouseEvent, value: SearchedParkingLocation | ParkingLocation) => void;
}) => {
  const { parkingLocation, onClick } = props;
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
        }}
        indicators={false}
        navButtonsAlwaysInvisible
      >
        {(parkingLocation.images as unknown as string[]).map((image) => (
          <img
            key={image}
            src={image}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // or cover, scale-down, etc.
              borderRadius: "5px",
            }}
            alt={`${image}`}
          />
        ))}
      </Carousel>
      <Stack color="secondary" justifyContent={"space-between"} flexGrow={1}>
        <Box>
          <Typography variant="body1" fontWeight={500}>
            {parkingLocation.name}
          </Typography>
          <Typography variant="caption">{parkingLocation.address}</Typography>
        </Box>

        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize="13px">
            <DirectionsWalk sx={{ fontSize: "16px" }} />
            {" " + parkingLocation.distance.toFixed(2)} km
          </Typography>
          <Typography ml={"auto"} width={"fit-content"} fontSize="13px">
            {"$" + parkingLocation.minPrice.toFixed(2) + "/hr"}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MapPage;

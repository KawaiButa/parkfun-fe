"use client";
import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Close } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, CircularProgress, Dialog, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import { DialogProps, useDialogs, useNotifications } from "@toolpad/core";
import { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import Carousel from "react-material-ui-carousel";

import { useSession } from "@/context/authenticationContext";
import { useParkingSlot } from "@/hooks/useParkingSlot";
import { BookingFormData } from "@/interfaces/bookingFormData";
import { ParkingSlot } from "@/interfaces/parkingSlot";
import { bookParkingLocation } from "@/utils/booking";
import { getDuration, getFee, getNearestRoundTime, timeToSeconds } from "@/utils/utils";

import { bookingValidationSchema } from "./validationSchema";
import { noImage } from "../../../public/images";
import BookingTimePicker from "../bookingForm/bookingTimePicker/bookingTimePicker";
import FormCheckboxInput from "../formCheckboxInput/formCheckboxInput";

export interface BookingModalProps {
  parkingSlotList?: number[];
  startAt?: Dayjs;
  endAt?: Dayjs;
}

const BookingModal = (
  props: DialogProps<
    BookingModalProps & { initialValue?: { parkingSlotId: number; time: Dayjs[]; serviceIds: number[] } }
  >
) => {
  const { payload } = props;
  const { startAt, endAt, initialValue } = payload;
  const [parkingSlotList, setParkingSlotList] = useState<ParkingSlot[] | null>(null);
  const { fetchOneParkingSlot } = useParkingSlot();
  const [fee, setFee] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [selectedParkingSlot, setSelectedParkingSlot] = useState<ParkingSlot | null>(null);
  const notifcations = useNotifications();
  const session = useSession();
  const dialogs = useDialogs();
  const router = useRouter();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      parkingSlotId: payload.parkingSlotList ? payload.parkingSlotList[0] : -1,
      time:
        startAt && endAt
          ? [startAt, endAt]
          : [getNearestRoundTime(dayjs()), getNearestRoundTime(dayjs()).add(30, "minutes")],
      serviceIds: [],
    },
    resolver: yupResolver(bookingValidationSchema),
  });
  const time = useWatch({ control, name: "time" });
  useEffect(() => {
    if (!initialValue && !payload.parkingSlotList) {
      props.onClose();
    }
    if (payload.parkingSlotList && payload.parkingSlotList.length > 0) {
      Promise.all(payload.parkingSlotList.map((id) => fetchOneParkingSlot(id))).then((res) => {
        const filteredList = res.filter((parkingSlot) => parkingSlot != null);
        setParkingSlotList(filteredList);
        setSelectedParkingSlot(filteredList[0]);
      });
    }
    if (initialValue) {
      fetchOneParkingSlot(initialValue.parkingSlotId).then((res) => {
        setSelectedParkingSlot(res);
        reset((prev) => ({
          ...prev,
          parkingSlotId: initialValue.parkingSlotId,
          time: initialValue.time,
          serviceIds: initialValue.serviceIds,
        }));
      });
    }
    if (startAt && endAt) {
      reset((prev) => ({ ...prev, startAt, endAt }));
    }
  }, [endAt, startAt]);
  useEffect(() => {
    if (Object.keys(errors).length)
      notifcations.show(Object.values(errors)[0].message, {
        severity: "error",
        autoHideDuration: 1000,
      });
  }, [errors, notifcations]);
  const onSubmit = async (formData: BookingFormData) => {
    if (formData.time[0].isBefore(dayjs())) return;
    if (!session) {
      const isLogin = await dialogs.confirm("You need to login to book a parking slot");
      localStorage.setItem("booking", JSON.stringify(formData));
      if (isLogin) router.push("/auth/login?redirect=/home/map");
      return;
    }
    try {
      const price = (selectedParkingSlot!.price * getDuration(timeToSeconds(time[0]), timeToSeconds(time[1]))) / 3600;
      const res = await bookParkingLocation({ ...formData, amount: price });
      if (res) {
        dialogs.open(PaymentModal, res.clientSecret);
      }
    } catch (err) {
      if (err instanceof AxiosError)
        notifcations.show(err.response?.data.message, {
          severity: "error",
          autoHideDuration: 3000,
        });
      else
        notifcations.show((err as Error).message, {
          severity: "error",
          autoHideDuration: 3000,
        });
    }
  };
  useEffect(() => {
    if (selectedParkingSlot && selectedParkingSlot.price && selectedParkingSlot.price > 0) {
      setLoading(true);
      getFee(selectedParkingSlot.id)
        .then((fee) => setFee(fee))
        .finally(() => setLoading(false));
    } else {
      setFee(0);
    }
  }, [time, selectedParkingSlot]);
  return (
    <Dialog open={props.open} onClose={() => props.onClose()}>
      <DialogContent
        sx={{
          p: "0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            p: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {initialValue || parkingSlotList ? (
            <Box
              sx={{
                backgroundColor: "background.paper",
                p: 2,
                borderRadius: "5px",
                width: {
                  xs: "90%",
                  md: "700px",
                },
                height: {
                  xs: "fit-content",
                  md: "80vh",
                },
                overflow: "scroll",
                maxWidth: "100%",
                gap: "20px",
                padding: "20px",
              }}
              component={"form"}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  mb: "10px",
                }}
              >
                <Typography variant="h4" color="primary">
                  Booking - {selectedParkingSlot?.parkingLocation.name}
                </Typography>
                <IconButton>
                  <Close
                    color="primary"
                    onClick={() => {
                      props.onClose();
                    }}
                  />
                </IconButton>
              </Stack>
              <Stack
                direction="row"
                gap={initialValue ? 0 : "10px"}
                sx={{
                  borderRadius: "5px",
                  padding: "10px",
                  backgroundColor: "background.default",
                }}
              >
                <Box
                  sx={{
                    height: "fit-content",
                    overflow: "scroll",
                    maxHeight: "300px",
                  }}
                >
                  {parkingSlotList &&
                    parkingSlotList.map((parkingSlot) => {
                      return (
                        <Stack
                          component={"button"}
                          type="button"
                          mb={2}
                          key={parkingSlot.id}
                          sx={{
                            cursor: "pointer",
                            borderRadius: "5px",
                            backgroundColor: "background.paper",
                            overflow: "scroll",
                            border:
                              selectedParkingSlot && parkingSlot.id === selectedParkingSlot.id ? "2px solid" : "none",
                            borderColor: "primary.main",
                            "&:hover": {
                              border: "2px solid",
                              borderColor: "primary.main",
                            },
                          }}
                          onClick={() => {
                            setSelectedParkingSlot(parkingSlot);
                          }}
                          direction="row"
                        >
                          {parkingSlot.images.length ? (
                            <img
                              key={parkingSlot.images[0].url}
                              src={parkingSlot.images[0].url}
                              width={100}
                              height={100}
                              alt={`Image ${parkingSlot.images[0].url}`}
                            />
                          ) : (
                            <Image src={noImage.src} alt="No image provided" width={100} height={100} />
                          )}
                        </Stack>
                      );
                    })}
                </Box>
                <Stack flexGrow={1}>
                  <Carousel
                    indicators={false}
                    stopAutoPlayOnHover
                    sx={{
                      borderRadius: "5px",
                    }}
                    height={"300px"}
                  >
                    {selectedParkingSlot?.images.map((image) => (
                      <img
                        key={image.id}
                        src={image.url}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                        alt={`Image ${image.id}`}
                        onError={(e) => {
                          e.currentTarget.src = noImage.src;
                        }}
                      />
                    ))}
                  </Carousel>
                </Stack>
              </Stack>
              <Typography variant="h4" mt={2}>
                {selectedParkingSlot?.name}
              </Typography>
              <Stack m={2}>
                <Typography variant="h6">Access:</Typography>
                <Typography>{selectedParkingSlot?.parkingLocation.access}</Typography>
              </Stack>
              <Typography variant="h4" mt={2}>
                Options
              </Typography>
              <Stack m={2}>
                <Typography variant="h6">Services:</Typography>
                <FormCheckboxInput
                  control={control}
                  name="serviceIds"
                  options={selectedParkingSlot?.services ?? []}
                  transformLabel={({ name }) => name}
                  transformValue={({ id }) => id}
                />
                <Typography variant="h6">Time:</Typography>
                <Box mt={2}>
                  <Controller
                    control={control}
                    name="time"
                    render={({ field: { onChange, value } }) => (
                      <BookingTimePicker
                        defaultStartTime={value[0]}
                        defaultEndTime={value[1]}
                        onStartChange={(e) => {
                          if (e) onChange([e ?? new Dayjs(), value[1]]);
                        }}
                        onEndChange={(e) => {
                          if (e) onChange([value[0], e]);
                        }}
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
                    )}
                  />
                </Box>
              </Stack>
              <Stack direction="column" alignItems="flex-end" my={2} pr={2}>
                {selectedParkingSlot && (
                  <>
                    <Stack direction="row" justifyContent="space-between" width={"100%"}>
                      <Typography variant="body1">Fee:</Typography>
                      <Typography variant="body1"> ${fee}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" width={"100%"}>
                      <Typography variant="body1">Price:</Typography>
                      <Typography variant="body1">
                        $
                        {(
                          (selectedParkingSlot?.price * getDuration(timeToSeconds(time[0]), timeToSeconds(time[1]))) /
                          3600
                        ).toFixed(2)}{" "}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" width={"100%"}>
                      <Typography variant="h4">Total:</Typography>
                      <Typography variant="h4">
                        $
                        {(
                          (selectedParkingSlot?.price * getDuration(timeToSeconds(time[0]), timeToSeconds(time[1]))) /
                            3600 +
                          fee
                        ).toFixed(2)}
                      </Typography>
                    </Stack>
                  </>
                )}
              </Stack>
              <LoadingButton
                loading={isSubmitting || loading}
                variant="contained"
                fullWidth
                type="submit"
                loadingIndicator={<CircularProgress/>}
                disabled={loading}
              >
                Reserve
              </LoadingButton>
            </Box>
          ) : (
            <CircularProgress />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default BookingModal;

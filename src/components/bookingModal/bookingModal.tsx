"use client";
import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Close } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, CircularProgress, IconButton, Modal, ModalProps, Stack, Typography } from "@mui/material";
import { useNotifications } from "@toolpad/core";
import dayjs from "dayjs";
import Image from "next/image";
import { Controller, useForm, useWatch } from "react-hook-form";
import Carousel from "react-material-ui-carousel";

import { useParkingSlot } from "@/hooks/useParkingSlot";
import { ParkingSlot } from "@/interfaces/parkingSlot";
import { getNearestRoundTime, secondToDayTime, timeToSeconds } from "@/utils/utils";

import { bookingValidationSchema } from "./validationSchema";
import { noImage } from "../../../public/images";
import BookingTimePicker from "../bookingForm/bookingTimePicker/bookingTimePicker";
import FormCheckboxInput from "../formCheckboxInput/formCheckboxInput";

export interface BookingModalProps extends Omit<ModalProps, "children"> {
  parkingSlotList: number[];
  startAt?: number;
  endAt?: number;
}

const BookingModal = (props: BookingModalProps) => {
  const { startAt, endAt, onClose, ...modalProps } = props;
  const [parkingSlotList, setParkingSlotList] = useState<ParkingSlot[] | null>(null);
  const { fetchOneParkingSlot } = useParkingSlot();
  const [selectedParkingSlot, setSelectedParkingSlot] = useState<ParkingSlot | null>(null);
  const notifcations = useNotifications();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      parkingSlotId: props.parkingSlotList[0],
      time: [timeToSeconds(getNearestRoundTime(dayjs())), timeToSeconds(getNearestRoundTime(dayjs())) + 3600],
      serviceIds: [],
    },
    resolver: yupResolver(bookingValidationSchema),
  });
  const time = useWatch({ control, name: "time" });
  useEffect(() => {
    if (startAt && endAt) {
      reset((prev) => ({ ...prev, startAt, endAt }));
    }
    if (props.parkingSlotList && props.parkingSlotList.length > 0) {
      Promise.all(props.parkingSlotList.map((id) => fetchOneParkingSlot(id))).then((res) => {
        const filteredList = res.filter((parkingSlot) => parkingSlot != null);
        setParkingSlotList(filteredList);
        setSelectedParkingSlot(filteredList[0]);
      });
    }
  }, [endAt, startAt]);
  useEffect(() => {
    if (Object.keys(errors).length)
      notifcations.show(Object.values(errors)[0].message, {
        severity: "error",
        autoHideDuration: 1000,
      });
  }, [errors, notifcations]);
  const onSubmit = async () => {};
  return (
    <Modal
      {...modalProps}
      sx={{
        display: "flex",
        p: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {parkingSlotList ? (
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
              Booking
            </Typography>
            <IconButton>
              <Close
                color="primary"
                onClick={(e) => {
                  if (onClose) onClose(e, "escapeKeyDown");
                }}
              />
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            gap={"10px"}
            sx={{
              borderRadius: "5px",
              padding: "10px",
              backgroundColor: "background.default",
            }}
          >
            <Stack
              gap="10px"
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
                      key={parkingSlot.id}
                      sx={{
                        cursor: "pointer",
                        borderRadius: "5px",
                        backgroundColor: "background.paper",
                        overflow: "scroll",
                        border: selectedParkingSlot && parkingSlot.id === selectedParkingSlot.id ? "2px solid" : "none",
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
            </Stack>
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
                    defaultStartTime={secondToDayTime(value[0])}
                    defaultEndTime={secondToDayTime(value[1])}
                    onStartChange={(e) => onChange([e, value[1]])}
                    onEndChange={(e) => onChange([value[0], e])}
                  />
                )}
              />
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" my={2}>
            <Typography variant="h4" mr={3}>
              Total fee:
            </Typography>
            {selectedParkingSlot && (
              <Typography variant="h4">
                {((selectedParkingSlot?.price * (time[1] - time[0])) / 3600).toFixed(2)}
              </Typography>
            )}
          </Stack>
          <LoadingButton variant="contained" fullWidth type="submit">
            Book
          </LoadingButton>
        </Box>
      ) : (
        <CircularProgress />
      )}
    </Modal>
  );
};
export default BookingModal;

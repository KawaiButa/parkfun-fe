import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Close } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  ModalProps,
  Stack,
  Typography,
} from "@mui/material";
import { DialogProps, useDialogs, useNotifications } from "@toolpad/core";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import Carousel from "react-material-ui-carousel";

import { useSession } from "@/context/authenticationContext";
import { useParkingSlot } from "@/hooks/useParkingSlot";
import { BookingFormData } from "@/interfaces/bookingFormData";
import { ParkingSlot } from "@/interfaces/parkingSlot";
import { bookParkingLocation } from "@/utils/booking";
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
  const session = useSession();
  const dialogs = useDialogs();
  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      time: [timeToSeconds(getNearestRoundTime(dayjs())), timeToSeconds(getNearestRoundTime(dayjs())) + 3600],
      services: [],
    },
    resolver: yupResolver(bookingValidationSchema),
  });

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
  }, [endAt, startAt, props.parkingSlotList]);
  const onSubmit = (formData: BookingFormData) => {
    if(!session) {
      dialogs.open(requestLoginDialog)
    }
    try {
      const result = bookParkingLocation(formData);
      notifcations.show(result, {
        severity: "success",
        autoHideDuration: 3000,
      });
    } catch (error) {
      if (error instanceof AxiosError)
        notifcations.show(error.response?.data.message, {
          severity: "error",
          autoHideDuration: 3000,
        });
      else
        notifcations.show((error as Error).message, {
          severity: "error",
          autoHideDuration: 3000,
        });
    }
  };
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
          <Stack direction="row" gap={"10px"}>
            <Box
              sx={{
                backgroundColor: "background.default",
                borderRadius: "5px",
                height: "300px",
                overflow: "auto",
                maxHeight: "300px",
              }}
            >
              {parkingSlotList &&
                parkingSlotList.map((parkingSlot) => {
                  return (
                    <Stack
                      component={"button"}
                      key={parkingSlot.id}
                      sx={{
                        margin: "10px",
                        cursor: "pointer",
                        borderRadius: "5px",
                        backgroundColor: "background.paper",
                        overflow: "scroll",
                        border: "none",
                        "&:hover": {
                          border: "1.5px solid",
                          borderColor: "primary.main",
                        },
                      }}
                      onClick={() => {
                        setSelectedParkingSlot(parkingSlot);
                      }}
                      direction="row"
                    >
                      {parkingSlot.images.length ? (
                        <Image
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
            Details
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
              name="services"
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

const requestLoginDialog = ({ open, onClose }: DialogProps) => {
  return (
    <Dialog open={open} onClose={() => onClose}>
      <DialogTitle>Want to book this slot?</DialogTitle>
      <DialogContent>
        Please login first in order to book this slot
      </DialogContent>
    </Dialog>
  );
};
export default BookingModal;

"use client";
import { useState } from "react";

import { ArrowRightAlt } from "@mui/icons-material";
import { Container, ContainerProps, IconProps } from "@mui/material";
import {
  DateTimePicker,
  DateTimePickerProps,
  LocalizationProvider,
  TimePicker,
  TimePickerProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import { getNearestRoundTime } from "@/utils/utils";
export interface BookingTImePickerPros extends Omit<TimePickerProps<Dayjs>, "slotProps"> {
  onStartChange?: (value: Dayjs | null) => void;
  onEndChange?: (value: Dayjs | null) => void;
  slotProps?: {
    container?: ContainerProps;
    leftTimePicker?: DateTimePickerProps<Dayjs>;
    rightTimePicker?: TimePickerProps<Dayjs>;
    arrowButton?: IconProps;
  };
  defaultStartTime?: Dayjs | null;
  defaultEndTime?: Dayjs | null;
}
const BookingTimePicker = (props: BookingTImePickerPros) => {
  const { onStartChange, onEndChange, slotProps, defaultStartTime, defaultEndTime } = props;
  const [startDate, setStartDate] = useState<Dayjs>(defaultStartTime ?? getNearestRoundTime(dayjs()));
  const [endDate, setEndDate] = useState<Dayjs>(startDate.add(30, "minutes"));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container
        className="timePicker"
        sx={{
          padding: 0,
          display: "flex",
          gap: "20px",
          color: "wheat",
          alignItems: "center",
        }}
        {...slotProps?.container}
      >
        <DateTimePicker
          {...slotProps?.leftTimePicker}
          label="From"
          ampm={false}
          value={startDate}
          reduceAnimations={true}
          minDateTime={dayjs()}
          sx={{
            fontWeight: "600",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "white"
            },
            "& svg": {
              color: "secondary.contrastText"
            }
          }}
          format="YYYY-MM-DD HH:mm"
          onChange={(value) => {
            if (value) {
              setStartDate(value);
              if (onStartChange) onStartChange(value);
            }
          }}
          />
        <ArrowRightAlt color="primary" />
        <TimePicker
          label={
            endDate.hour() >= startDate.hour()
            ? startDate.format("YYYY-MM-DD")
            : startDate.add(1, "day").format("YYYY-MM-DD")
          }
          ampm={false}
          value={endDate}
          reduceAnimations={true}
          defaultValue={defaultEndTime}
          sx={{
            fontWeight: "600",
          }}
          onChange={(value) => {
            if (value) {
              setEndDate(value);
              if (onEndChange) onEndChange(value);
            }
          }}
          {...slotProps?.rightTimePicker}
        />
      </Container>
    </LocalizationProvider>
  );
};

export default BookingTimePicker;

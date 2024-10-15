"use client";
import { ArrowRightAlt } from "@mui/icons-material";
import { Container, ContainerProps, IconProps } from "@mui/material";
import { LocalizationProvider, TimePicker, TimePickerProps } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
export interface BookingTImePickerPros extends Omit<TimePickerProps<Dayjs>, "slotProps"> {
  onStartChange?: (value: Dayjs | null) => void;
  onEndChange?: (value: Dayjs | null) => void;
  slotProps?: {
    container?: ContainerProps,
    leftTimePicker?: TimePickerProps<Dayjs>,
    rightTimePicker?: TimePickerProps<Dayjs>,
    arrowButton?: IconProps
  }
  defaultStartTime?:Dayjs | null;
  defaultEndTime?:Dayjs | null;
}
const BookingTimePicker = (props: BookingTImePickerPros) => {
  const { onStartChange, onEndChange,slotProps, defaultStartTime, defaultEndTime } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container
        className="timePicker"
        sx={{
          padding: 0,
          display: "flex",
          gap: "20px",
          color: 'wheat',
          alignItems: "center",
        }}
        {...slotProps?.container}
      >
        <TimePicker
          label="From"
          ampm={false}
          reduceAnimations={true}
          defaultValue={defaultStartTime}
          sx={{
            fontWeight: "600",
            color: "white"
          }}
          
          onChange={(value) => {
            if (onStartChange) onStartChange(value);
          }}
          {...slotProps?.leftTimePicker}
        />
        <ArrowRightAlt color="primary" />
        <TimePicker
          label="Until"
          ampm={false}
          reduceAnimations={true}
          defaultValue={defaultEndTime}
          sx={{
            fontWeight: "600",
          }}
          onChange={(value) => {
            if (onEndChange) onEndChange(value);
          }}
          {...slotProps?.rightTimePicker}
        />
      </Container>
    </LocalizationProvider>
  );
};

export default BookingTimePicker;

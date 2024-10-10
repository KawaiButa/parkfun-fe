"use client";
import { ArrowRightAlt } from "@mui/icons-material";
import { Container } from "@mui/material";
import { LocalizationProvider, TimePicker, TimePickerProps } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
export interface BookingTImePickerPros extends TimePickerProps<Dayjs> {
  onStartChange?: (value: Dayjs | null) => void;
  onEndChange?: (value: Dayjs | null) => void;
  defaultStartTime?:Dayjs | null;
  defaultEndTime?:Dayjs | null;
}
const BookingTimePicker = (props: BookingTImePickerPros) => {
  const { onStartChange, onEndChange, defaultStartTime, defaultEndTime } = props;
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
      >
        <TimePicker
          label="From"
          ampm={false}
          reduceAnimations={true}
          defaultValue={defaultStartTime}
          sx={{
            fontWeight: "600",
          }}
          
          onChange={(value) => {
            if (onStartChange) onStartChange(value);
          }}
        />
        <ArrowRightAlt color="secondary" />
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
        />
      </Container>
    </LocalizationProvider>
  );
};

export default BookingTimePicker;

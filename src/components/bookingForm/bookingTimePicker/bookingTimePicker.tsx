"use client";
import { ArrowRightAlt } from "@mui/icons-material";
import { Container } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const BookingTimePicker = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container
        className="timePicker"
        sx={{
          padding: 0,
          display: "flex",
          gap: "20px",
          
          alignItems: "center",
        }}
      >
        <TimePicker
          label="From"
          ampm={false}
          reduceAnimations={true}
          sx={{
            fontWeight: "600",
          }}
        />
        <ArrowRightAlt color="secondary" />
        <TimePicker
          label="Until"
          ampm={false}
          reduceAnimations={true}
          sx={{
            fontWeight: "600",
          }}
        />
      </Container>
    </LocalizationProvider>
  );
};

export default BookingTimePicker;

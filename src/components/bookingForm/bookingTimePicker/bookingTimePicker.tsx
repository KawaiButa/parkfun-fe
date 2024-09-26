"use client";
import { ArrowRightAlt } from "@mui/icons-material";
import { Container } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const BookingTimePicker = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container sx={{
        padding: 0,
        display: "flex",
        gap: "20px",
        alignContent: "center"
      }}>
        <TimePicker label="From" ampm={false} reduceAnimations={true} sx={{
          fontWeight: "bold",
        }}/>
        <ArrowRightAlt color="secondary"/>
        <TimePicker label="Until" ampm={false} reduceAnimations={true} sx={{
          fontWeight: "bold",
        }}/>
      </Container>
    </LocalizationProvider>
  );
};

export default BookingTimePicker;

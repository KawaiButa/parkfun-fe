"use client";
import { ArrowRightAlt } from "@mui/icons-material";
import { Container } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const BookingTimePicker = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container className="timePicker" sx={{
        padding: 0,
        display: "flex",
        gap: "20px",
        alignContent: "center"
      }}>
        <DateTimePicker label="From" ampm={false} reduceAnimations={true} sx={{
          fontWeight: "600",
        }}/>
        <ArrowRightAlt color="secondary"/>
        <DateTimePicker label="Until" ampm={false} reduceAnimations={true} sx={{
          fontWeight: "600",
        }}/>
      </Container>
    </LocalizationProvider>
  );
};

export default BookingTimePicker;

"use client";

import React, { useEffect, useState } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Divider,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import { DialogProps, PageContainer, useDialogs } from "@toolpad/core";
import { AxiosError } from "axios";
import dayjs from "dayjs";

import { Booking } from "@/interfaces/booking";
import AxiosInstance from "@/utils/axios";

function RejectDialog({ open, onClose }: DialogProps<undefined, string | null>) {
  const [result, setResult] = useState("");
  return (
    <Dialog fullWidth open={open} onClose={() => onClose(null)}>
      <DialogTitle>Reject detail</DialogTitle>
      <DialogContent>
        <DialogContentText>Can you provide the reason why you reject this booking?</DialogContentText>
        <TextField
          label="Reason"
          sx={{ mt: 2 }}
          fullWidth
          value={result}
          onChange={(event) => setResult(event.currentTarget.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose("")}>{"No, I don't want to"}</Button>
        <Button onClick={() => onClose(result)}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
export default function PartnerBookingPage({ params }: { params: { bookingId: number } }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const dialogs = useDialogs();
  const [loading, setLoading] = useState(false);
  const handleAcceptBooking = async () => {
    setLoading(true);
    AxiosInstance.get(`/booking/${params.bookingId}/accept`)
      .then(() => dialogs.alert("Booking accepted"))
      .catch((err) => {
        if (err instanceof AxiosError) dialogs.alert(err.response?.data.message);
        else dialogs.alert("Error accepting booking: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRejectBooking = async () => {
    setLoading(true);
    await dialogs.open(RejectDialog);
    AxiosInstance.get(`/booking/${params.bookingId}/reject`)
      .then(() => dialogs.alert("Booking reject"))
      .catch((err) => {
        if (err instanceof AxiosError) dialogs.alert(err.response?.data.message);
        else dialogs.alert("Error accepting booking: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCheckoutBooking = async () => {
    const isSure = await dialogs.confirm("Are you sure you want to checkout and close this booking?");
    if (!isSure) return;
    setLoading(true);
    AxiosInstance.get(`/payment/${params.bookingId}/complete`)
      .then(() => dialogs.alert("Booking checkout success"))
      .catch((err) => {
        if (err instanceof AxiosError) dialogs.alert(err.response?.data.message);
        else dialogs.alert("Error accepting booking: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const { bookingId } = params;
    AxiosInstance.get("/booking/" + bookingId)
      .then((res) => {
        setBooking(res.data);
      })
      .catch((err) => alert(err));
  }, []);
  const getActionBar = (status: string) => {
    switch (status) {
      case "request_complete":
        return (
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="contained" color="success" size="large" onClick={handleCheckoutBooking}>
                Checkout
              </Button>
            </Stack>
          </Grid>
        );
      case "holding":
        return (
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  <Button variant="contained" color="error" size="large" onClick={handleRejectBooking}>
                    Reject
                  </Button>
                  <Button variant="contained" color="success" size="large" onClick={handleAcceptBooking}>
                    Accept
                  </Button>
                </>
              )}
            </Stack>
          </Grid>
        );
    }
  };
  if (!booking) return <></>;
  return (
    <PageContainer
      sx={{
        backgroundColor: "background.paper",
        borderRadius: "10px",
        mt: "20px",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="h6">User Information</Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography color="textSecondary" fontWeight="bold">
                      Name:
                    </Typography>
                    <Typography>{booking.user.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography color="textSecondary" fontWeight="bold">
                      Email:
                    </Typography>
                    <Typography>{booking.user.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography color="textSecondary" fontWeight="bold">
                      Phone:
                    </Typography>
                    <Typography>{booking.user.phoneNumber}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Avatar>
                    <LocalParkingIcon />
                  </Avatar>
                  <Typography variant="h6">Booking Details</Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOnIcon color="primary" />
                      <div>
                        <Typography color="textSecondary" fontWeight="bold">
                          Location:
                        </Typography>
                        <Typography>{booking.parkingSlot.parkingLocation.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {booking.parkingSlot.parkingLocation.address}
                        </Typography>
                      </div>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={2}>
                      <div>
                        <Typography color="textSecondary" fontWeight="bold">
                          Parking Slot:
                        </Typography>
                      </div>
                      <Stack direction="row" spacing={2}>
                        <div>
                          <Typography color="textSecondary" display="flex" alignItems="center">
                            <AccessTimeIcon sx={{ mr: 1 }} fontSize="small" />
                            Start:
                          </Typography>
                          <Typography>{dayjs(booking.startAt).format("DD-MM-YYYY HH:mm A")}</Typography>
                        </div>
                        <Divider
                          sx={{
                            borderWidth: 1,
                          }}
                        />
                        <div>
                          <Typography color="textSecondary" display="flex" alignItems="center">
                            <AccessTimeIcon sx={{ mr: 1 }} fontSize="small" />
                            End:
                          </Typography>
                          <Typography>{dayjs(booking.endAt).format("DD-MM-YYYY HH:mm A")}</Typography>
                        </div>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {getActionBar(booking.status)}
        </Grid>
      </Box>
    </PageContainer>
  );
}

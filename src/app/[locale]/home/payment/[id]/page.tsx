"use client";
import React, { useEffect, useState } from "react";

import { Error, Pending } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Link,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import { usePaymentRecord } from "@/hooks/usePaymentRecord";
import { PaymentRecord } from "@/interfaces/paymentRecord";
import { getDuration, timeToSeconds } from "@/utils/utils";

const PaymentSummaryPage = ({ params }: { params: { id: number } }) => {
  const { id: bookingId } = params;
  const { fetchOnePaymentRecord } = usePaymentRecord();
  const router = useRouter();
  const [paymentRecord, setPaymentRecord] = useState<PaymentRecord | null>(null);
  useEffect(() => {
    fetchOnePaymentRecord(bookingId).then((paymentRecord) => setPaymentRecord(paymentRecord));
  }, []);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Box
            sx={{
              backgroundColor: "background.paper",
              color: "white",
              borderRadius: "50%",
              marginX: "auto",
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 120, mb: 2 }} color="primary" />
          </Box>
        );
      case "holding":
        return (
          <Box
            sx={{
              backgroundColor: "background.paper",
              color: "white",
              borderRadius: "50%",
              marginX: "auto",
            }}
          >
            <Pending sx={{ fontSize: 120, mb: 2 }} color="primary" />
          </Box>
        );
      case "cancelled":
        return (
          <Box
            sx={{
              backgroundColor: "background.paper",
              color: "white",
              borderRadius: "50%",
              marginX: "auto",
            }}
          >
            <Error sx={{ fontSize: 120, mb: 2 }} color="error" />
          </Box>
        );
      default:
        return null;
    }
  };
  const getPaymentDescription = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <CheckCircleIcon sx={{ color: "success.main", mr: 1 }} />
            <Typography variant="h6" sx={{ color: "success.main" }}>
              Payment completed!
            </Typography>
          </Box>
        );
      case "holding":
        return (
          <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <Pending sx={{ color: "info.main", mr: 1 }} />
              <Typography variant="h6" sx={{ color: "info.main" }}>
                Payment holded!
              </Typography>
            </Box>
            <Typography variant="body2" textAlign="center">
              {"Your money will be refunded to you if the location's owner reject your booking."}
            </Typography>
          </>
        );
      case "cancelled":
        return (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <Error sx={{ color: "error.main", mr: 1 }} />
            <Typography variant="h6" sx={{ color: "error.main" }}>
              Payment failed!
            </Typography>
          </Box>
        );
    }
  };
  if (!paymentRecord) return <></>;
  return (
    <Box sx={{ minHeight: "100vh", p: 3 }}>
      <Card
        sx={{
          maxWidth: "500px",
          mx: "auto",
          borderRadius: 5,
          boxShadow: "none",
          backgroundColor: "transparent",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -30,
            transform: "translateX(-50%)",
            left: "50%",
            padding: 5,
            borderRadius: 5,
          }}
        >
          {getStatusIcon(paymentRecord.booking.status)}
        </Box>
        <CardContent>
          <Box
            sx={{
              backgroundColor: "background.paper",
              padding: 2,
              borderRadius: 3,
              paddingTop: 10,
              marginTop: 7,
            }}
          >
            <Typography variant="h4" color="primary" textAlign="center">
              ${(paymentRecord.amount).toFixed(2)}
            </Typography>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1" fontWeight={500}>
                Parking Location
              </Typography>
              <Typography>{paymentRecord.booking.parkingSlot.parkingLocation.name}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1" fontWeight={500}>
                Parking Slot
              </Typography>
              <Typography>{paymentRecord.booking.parkingSlot.name}</Typography>
            </Stack>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>NAME</TableCell>
                    <TableCell align="right">QTY</TableCell>
                    <TableCell align="right">PRICE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={"base"}>
                    <TableCell>
                      {paymentRecord.booking.parkingSlot.name}
                      <Typography variant="caption" display="block">
                        ${paymentRecord.booking.parkingSlot.price.toFixed(2)} / hrs
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {getDuration(
                        timeToSeconds(dayjs(paymentRecord.booking.startAt)),
                        timeToSeconds(dayjs(paymentRecord.booking.endAt))
                      ) / 3600}
                    </TableCell>
                    <TableCell align="right">${paymentRecord.booking.amount.toFixed(2)}</TableCell>
                  </TableRow>
                  {paymentRecord.booking.services.map(({ name }) => (
                    <TableRow key={name}>
                      <TableCell component="th" scope="row">
                        {name}
                      </TableCell>
                      <TableCell align="right">{1}</TableCell>
                      <TableCell align="right">$ {(0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Stack>
                        <Typography variant="caption" textAlign="right">
                          Fee:
                        </Typography>
                        <Typography variant="body1" fontWeight={500} textAlign="right">
                          Total:
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Stack>
                        <Typography variant="caption">${paymentRecord.booking.fee.toFixed(2)}</Typography>
                        <Typography>
                          ${(paymentRecord.booking.amount + paymentRecord.booking.fee).toFixed(2)}
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {getPaymentDescription(paymentRecord.status)}

            <Typography variant="body2" align="center" sx={{ mb: 2 }}>
              An automated{" "}
              <Link component="a" target="blank" href={paymentRecord.receiptUrl} color="primary">
                receipt{" "}
              </Link>
              will be sent to your email.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2" fontWeight={500}>
                Transaction Reference
              </Typography>
              <Typography variant="body2">{paymentRecord.transactionId}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="body2" fontWeight={500}>
                Transaction Date
              </Typography>
              <Typography variant="body2">{dayjs(paymentRecord.createAt).format("YYYY-MM-DD HH:mm")}</Typography>
            </Box>

            <Button variant="contained" fullWidth onClick={() => router.push("/home/profile")}>
              Back to user
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentSummaryPage;

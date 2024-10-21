"use client";
import { useEffect } from "react";

import { ArrowForwardIos } from "@mui/icons-material";
import { Box, Button, Card, Container, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import ProfileForm from "@/components/profileForm/profileForm";
import { useBooking } from "@/hooks/useBooking";

const Page = () => {
  const { bookingList, fetchBooking } = useBooking();
  useEffect(() => {
    fetchBooking();
  }, []);
  const router = useRouter();
  return (
    <Stack direction="column" gap={2} color="secondary.main">
      <ProfileForm />
      <Container
        sx={{
          backgroundColor: "white",
          borderRadius: "5px",
          p: 2,
        }}
      >
        <Typography variant="h5" mb={2}>
          Booking history
        </Typography>
        <Stack gap={1} overflow="scroll">
          {bookingList?.map(({ id, status, createAt, startAt, endAt, amount }) => (
            <Box key={id}>
              <Card
                sx={{ p: 2, cursor: "pointer" }}
                component={"div"}
                onClick={() => {
                  if(status === "pending") {
                    
                  }
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">
                    Booking ID: {id} - ${amount.toFixed(2)}
                  </Typography>
                  <Button
                    variant="outlined"
                    color={`${getColorFromStatus(status)}`}
                    onClick={() => router.push("/home/payment/" + id)}
                  >
                    {status}
                  </Button>
                </Stack>
                <Stack direction="row" alignItems="center">
                  <Typography>
                    <Typography fontWeight="500">Start at:</Typography> {dayjs(startAt).format("YY/MM/DD hh:mm")}
                  </Typography>
                  <ArrowForwardIos sx={{ fontSize: "13px", mx: 2 }} />
                  <Typography>
                    <Typography fontWeight="500">End at:</Typography> {dayjs(endAt).format("YY/MM/DD hh:mm")}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-end">
                  <Typography fontWeight={500} mr={1}>
                    Create at:
                  </Typography>
                  <Typography>{dayjs(createAt).format("YY/MM/DD hh:mm")}</Typography>
                </Stack>
              </Card>
            </Box>
          ))}
        </Stack>
      </Container>
    </Stack>
  );
};

const getColorFromStatus = (
  status: string
): "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" => {
  switch (status) {
    case "pending":
      return "primary";
    case "completed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "inherit";
  }
};
export default Page;

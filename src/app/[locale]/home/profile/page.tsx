"use client";
import { useEffect } from "react";

import { ArrowForwardIos } from "@mui/icons-material";
import { Box, Button, Card, Container, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import ProfileForm from "@/components/profileForm/profileForm";
import { useBooking } from "@/hooks/useBooking";

dayjs.extend(utc)
const Page = () => {
  const t = useTranslations("profile");
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
          {t("bookingHistory")}
        </Typography>
        <Stack gap={1} overflow="scroll">
          {bookingList?.map(({ id, status, createAt, startAt, endAt, amount }) => (
            <Box key={id}>
              <Card
                sx={{ p: 2, cursor: "pointer" }}
                component={"div"}
                onClick={() => {
                  if (status === "pending") {
                  }
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">
                    ID: {id} - ${amount.toFixed(2)}
                  </Typography>
                  <Button
                    variant={status === "cancelled" ? "outlined" : "contained"}
                    color={`${getColorFromStatus(status)}`}
                    onClick={() => router.push("/home/payment/" + id)}
                  >
                    {t(status)}
                  </Button>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                  <Stack direction="row" alignItems="center">
                    <Typography>
                      <Typography fontWeight="500">{t("startAt")}:</Typography>{" "}
                      {dayjs(startAt).format("YY/MM/DD hh:mm A")}
                    </Typography>
                    <ArrowForwardIos sx={{ fontSize: "13px", mx: 2 }} />
                    <Typography>
                      <Typography fontWeight="500">{t("endAt")}:</Typography> {dayjs(endAt).format("YY/MM/DD hh:mm A")}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="flex-end">
                    <Typography fontWeight={500} mr={1}>
                      {t("createAt")}:
                    </Typography>
                    <Typography>{dayjs(createAt).utc().format("YY/MM/DD hh:mm A")}</Typography>
                  </Stack>
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

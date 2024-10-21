"use client";
import { useState, useEffect } from "react";

import { Box, Card, CardContent, Typography, Button, CircularProgress, Container } from "@mui/material";
import { redirect, useRouter, useSearchParams } from "next/navigation";

import AxiosInstance from "@/utils/axios";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  useEffect(() => {
    const token = searchParam.get("token");
    if (!token) redirect("/auth/login");
    setIsVerifying(true);
    AxiosInstance.get(`/auth/verify?token=${searchParam.get("token")}`)
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "background.default",
      }}
    >
      {(() => {
        if (isVerifying) {
          return (
            <Container maxWidth="xs">
              <CircularProgress size={60} />
            </Container>
          );
        }
        if (error) {
          return (
            <Box>
              <Typography variant="h5" component="div" gutterBottom>
                Error
              </Typography>
              <Typography variant="body1">{error}</Typography>
            </Box>
          );
        }
        return (
          <Card sx={{ minWidth: 300, maxWidth: 400, p: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Congratulations!
              </Typography>
              <Typography variant="body1">You have successfully signed up to ParkFun.</Typography>
              <Typography variant="body2" mt={2}>
                We will automatically redirect you to the login page so you can log in for the first time and start
                booking.
              </Typography>
              <Button fullWidth variant="contained" onClick={() => router.push("/auth/login")} sx={{
                mt: 4
              }}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        ); 
      })()}
    </Box>
  );
}

"use client";
import { useEffect, useState } from "react";

import { Error } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Typography, Button, CircularProgress, Container } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

import AxiosInstance from "@/utils/axios";

const VerificationSuccess = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const param = useSearchParams();
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    // Only redirect automatically on success
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 60000);

      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [router, isSuccess]);

  const handleRedirect = () => {
    router.push("/");
  };

  const handleTryAgain = () => {
    router.push("/verify");
  };

  useEffect(() => {
    const token = param.get("token");
    if (!token) {
      setIsSuccess(false);
      setErrorMessage("Invalid or expired verification link.");
      setLoading(false);
      return;
    }
    AxiosInstance.get("/auth/verify?token=" + token)
      .then(() => setIsSuccess(true))
      .catch(() => {
        setIsSuccess(false);
        setErrorMessage("Failed to verify your account. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "background.default",
          p: 2,
          borderRadius: 2,
          textAlign: "center",

        }}
      >
        {loading ? (
          <CircularProgress />
        ) : isSuccess ? (
          <>
            <CheckCircleIcon
              sx={{
                fontSize: 64,
                color: "success.main",
                mb: 2,
              }}
            />
            <Typography variant="h5" gutterBottom>
              Verification Successful!
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Your account has been successfully verified. You will be redirected to the homepage in {timeLeft} seconds.
            </Typography>
            <Box sx={{ position: "relative", display: "inline-flex", mb: 3 }}>
              <CircularProgress variant="determinate" value={(timeLeft / 60) * 100} size={40} />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {timeLeft}
                </Typography>
              </Box>
            </Box>
            <Button variant="contained" color="primary" onClick={handleRedirect} fullWidth>
              Go to Homepage
            </Button>
          </>
        ) : (
          <>
            <Error
              sx={{
                fontSize: 58,
                color: "error.main",
                mb: 2,
                m: "auto",
              }}
            />
            <Typography variant="h5" gutterBottom>
              Verification Failed
            </Typography>
            <Typography color="text.secondary" mb={3}>
              {errorMessage}
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" color="primary" onClick={handleTryAgain}>
                Try Again
              </Button>
              <Button variant="outlined" color="primary" onClick={handleRedirect}>
                Go to Homepage
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default VerificationSuccess;

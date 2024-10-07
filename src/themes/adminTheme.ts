"use client";
import { createTheme } from "@mui/material";

export const adminTheme = createTheme({
  palette: {
    primary: {
      main: "#e6d60f",
      light: "#ebe766",
      dark: "#e4b400",
      contrastText: "#000",
    },
    secondary: {
      main: "#171616",
      light: "#F5F7F8",
      contrastText: "#fff",
    },
    error: {
      main: "#A04747",
      contrastText: "#fff",
    },
    info: {
      main: "#41478c",
      contrastText: "#fff",
    },
    success: {
      main: "#409760",
      contrastText: "#fff",
    },
  },
});

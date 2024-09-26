"use client";

import { createTheme } from "@mui/material";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#e6d60f",
      light: "#ebe766",
      dark: "#e4b400",
      contrastText: "#000",
    },
    secondary: {
      main: "#171616",
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
export default defaultTheme;

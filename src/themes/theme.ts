"use client";

import { createTheme } from "@mui/material";

const defaultTheme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: "#EBCB00",
      light: "#EBD226",
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
    text: {
      primary: "#fff",
      secondary: "#fff",
      disabled: "#fff",
    },
  },
  typography: {
    fontFamily: "var(--font-poppins)"
  }
});
export default defaultTheme;

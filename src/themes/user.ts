"use client";
import { createTheme } from "@mui/material";

export const userTheme = createTheme({
  palette: {
    primary: {
      main: "#EBCB00",
      light: "#EBD226",
      dark: "#e4b400",
      contrastText: "#000",
    },
    secondary: {
      main: "#171616",
      light: "#3B3B3B",
      dark: "#121111",
      contrastText: "#fff",
    },
    error: {
      main: "#A04747",
      light: "#B86B6B",
      dark: "#7A3535",
      contrastText: "#fff",
    },
    warning: {
      main: "#FF9800",
      light: "#FFB74D",
      dark: "#F57C00",
      contrastText: "#fff",
    },
    info: {
      main: "#41478c",
      light: "#6168A9",
      dark: "#2E3266",
      contrastText: "#fff",
    },
    success: {
      main: "#409760",
      light: "#62B181",
      dark: "#2E704A",
      contrastText: "#fff",
    },
    text: {
      primary: "#fff",
      secondary: "#fff",
      disabled: "#9E9E9E",
    },
    divider: "rgba(0, 0, 0, 0.12)",
    background: {
      default: "#000000",
      paper: "#272624",
    },
  },
  typography: {
    fontFamily: "var(--font-poppins)",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1.05rem",
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.9rem",
      fontWeight: 400,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 400,
      textTransform: "uppercase",
    },
    
  },
  zIndex: {
    modal: 1000,
  }
});

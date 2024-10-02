import { createTheme } from '@mui/material/styles';

export const partnerTheme = createTheme({
  palette: {
    primary: {
      main: '#C07F00',
      light: '#FFE38B',
      dark: '#CCAE48',
      contrastText: '#FFF7D4',
    },
    secondary: {
      main: '#C07F00',
      light: '#D69F33',
      dark: '#9A6600',
      contrastText: '#FFF7D4',
    },
    error: {
      main: '#FF6B6B',
      light: '#FF9999',
      dark: '#CC5555',
      contrastText: '#FFF7D4',
    },
    warning: {
      main: '#FFA500',
      light: '#FFB733',
      dark: '#CC8400',
      contrastText: '#4C3D3D',
    },
    info: {
      main: '#4ECDC4',
      light: '#7EDCD6',
      dark: '#3EA49D',
      contrastText: '#4C3D3D',
    },
    success: {
      main: '#7CB342',
      light: '#9CCC65',
      dark: '#689F38',
      contrastText: '#FFF7D4',
    },
    background: {
      default: '#f7f3e6',
      paper: '#f7f3e6',
    },
    text: {
      primary: '#4C3D3D',
      secondary: '#6C5D5D',
    },
  },
  // You can add more theme customizations here, such as:
  // typography, spacing, breakpoints, components, etc.
});

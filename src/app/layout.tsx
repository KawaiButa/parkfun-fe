import { Menu } from "@mui/icons-material";
import { AppBar, Button, Container, IconButton, ThemeProvider, Toolbar, Typography } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import classNames from "classnames";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import defaultTheme from "@/themes/theme";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
export const metadata: Metadata = {
  title: "PARKFUN",
  description: "Park anytime",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={classNames(poppins.className)}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={defaultTheme}>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{
                    mr: {
                      xs: 0,
                      md: 2,
                    },
                  }}
                >
                  <Menu />
                </IconButton>{" "}
                <Typography
                  variant="h3"
                  component="div"
                  color="secondary"
                  sx={{
                    flexGrow: 1,
                    fontWeight: 700,
                    fontSize: {
                      xs: "30px",
                      md: "40px",
                    },
                  }}
                >
                  PARKFUN
                </Typography>
                <Container sx={{
                  width: "fit-content",
                  display: {
                    md: "flex",
                    xs: "none",
                    
                  },
                  gap: "10px",
                  paddingRight: "0"
                }}>
                  <Button
                    color="secondary"
                    variant="contained"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Sign-up
                  </Button>
                </Container>
              </Toolbar>
            </AppBar>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

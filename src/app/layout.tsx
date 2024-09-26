import { Menu } from "@mui/icons-material";
import { AppBar, Container, IconButton, ThemeProvider, Toolbar, Typography } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import SecondaryContainedButton from "@/components/secondaryContainedButton/secondaryContainedButton";
import { constants } from "@/constants";
import defaultTheme from "@/themes/theme";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});
export const metadata: Metadata = {
  title: constants.PROJECT_NAME,
  description: "Park anytime",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
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
                  {constants.PROJECT_NAME}
                </Typography>
                <Container
                  sx={{
                    width: "fit-content",
                    display: {
                      md: "flex",
                      xs: "none",
                    },
                    gap: "10px",
                    paddingRight: "0",
                  }}
                >
                  <SecondaryContainedButton
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Login
                  </SecondaryContainedButton>
                  <SecondaryContainedButton
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Sign-up
                  </SecondaryContainedButton>
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

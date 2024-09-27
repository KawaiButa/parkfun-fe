import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import NavigationBar from "@/components/NavigationBar/navigationBar";
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
              <NavigationBar/>
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
      </body>
    </html>
  );
}

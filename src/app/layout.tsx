import { ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import classNames from 'classnames';
import type { Metadata } from "next";
import {Poppins} from "next/font/google"

import defaultTheme from '@/themes/theme';

import "./globals.css";

const poppins = Poppins(
  {
    subsets: ["latin"],
    weight: ["400", "700"],
  },
  
)
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
        {children}
        </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

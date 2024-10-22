import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import {NextIntlClientProvider} from 'next-intl';
import { getMessages } from "next-intl/server";

import { constants } from "@/constants";
import { SessionProvider } from "@/context/authenticationContext";
import { ProfileContextProvider } from "@/context/profileContext";
import { routing } from "@/i18n/routing";
import { userTheme } from "@/themes/user";

import "./globals.css";
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});
export const metadata: Metadata = {
  title: constants.PROJECT_NAME,
  description: "Park anytime",
};

export default async function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  if (!routing.locales.includes(locale as "en" | "vi")) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <AppRouterCacheProvider>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider theme={userTheme}>
            <SessionProvider>
              <ProfileContextProvider>
                
                {children}</ProfileContextProvider>
            </SessionProvider>
          </ThemeProvider>
          </NextIntlClientProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

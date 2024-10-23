import { decodeJwt, JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",]
};
const localeMiddleware =  createMiddleware(routing);
export function middleware(request: NextRequest) {
  const pathname = removeLocale(request.nextUrl.pathname, routing.locales.map((e) => e.toString()));
  // Redirect home
  if (["/", "/admin", "/partner"].includes(pathname)) request.nextUrl.pathname = redirectToDashboard(pathname.slice(1));
  // Role redirect
  const accessToken = request.cookies.get("accessToken");
  if (!accessToken && ["admin", "partner"].some((a) => pathname.includes(a)) && !pathname.includes("login"))
    request.nextUrl.pathname = redirectToLogin(pathname);
  if (accessToken) {
    const data = decodeJwt(accessToken!.value) as JWTPayload;
    //Invalid token
    if (!data || !data.id) request.nextUrl.pathname = redirectToLogin(pathname);
    if (data && pathname.startsWith("/logout")) {
      const response = NextResponse.redirect(new URL(`/${data.role}/login`, request.nextUrl.origin));
      response.cookies.delete("accessToken");
      return response;
    }
    //Valid token but the route and the role are not matched
    if (["admin", "/partner", "/"].some((a) => pathname.includes(a)) && !pathname.includes(`/${data.role}`))
      request.nextUrl.pathname = redirectToDashboard(data.role as string);
  }
  // Locale
  return localeMiddleware(request)
}
const redirectToLogin = (url: string) => {
  if (url.includes("/admin")) return "/admin/login";
  if (url.includes("/partner")) return "/partner/login";
  return "/auth/login";
};
const redirectToDashboard = (role: string) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "partner") return "/partner/dashboard";
  return "/home";
};

function removeLocale(pathname: string, locales: string[]): string {
  const result = locales.reduce((acc, locale) => acc.replace(`/${locale}`, ""), pathname);
  if(result === "") return "/"
  return result;
}

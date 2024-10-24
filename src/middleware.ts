import { decodeJwt, JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",]
};
const localeMiddleware =  createMiddleware(routing);
const routeToRedirectHome = ["/", "/admin", "/partner"]
const managerRoute = ["admin", "partner"]
export function middleware(request: NextRequest) {
  const pathname = removeLocale(request.nextUrl.pathname, routing.locales.map((e) => e.toString()));
  const href = request.nextUrl.href
  // Redirect home
  if (routeToRedirectHome.includes(pathname)) request.nextUrl.pathname = redirectToDashboard(pathname.slice(1));
  // Role redirect
  const accessToken = request.cookies.get("accessToken");
  if (!accessToken && managerRoute.some((a) => pathname.includes(a)) && !pathname.includes("login")){

    request.nextUrl.pathname = redirectToLogin(pathname);
    request.nextUrl.searchParams.append("redirect", href)
  }
  if (accessToken) {
    const data = decodeJwt(accessToken!.value) as JWTPayload;
    //Invalid token
    if (!data || !data.id) request.nextUrl.pathname = redirectToLogin(pathname);
    if (data && pathname.startsWith("/logout")) {
      request.nextUrl.pathname = redirectToLogin(request.nextUrl.pathname);
      const response = NextResponse.redirect(request.nextUrl.href)
      response.cookies.delete("accessToken");
      return response;
    }
    //Valid token but the route and the role are not matched
    if (pathname === "/" || managerRoute.some((a) => pathname.startsWith(a)) && !pathname.startsWith(`/${data.role}`))
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

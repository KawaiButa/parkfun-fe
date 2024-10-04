import {decodeJwt, JWTPayload} from 'jose';
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/partner/:path*", "/logout", "/"],
};

export function middleware(request: NextRequest) {
  if(request.nextUrl.pathname === "/"){
    console.log("Redirection")
    return NextResponse.redirect(new URL("/home", request.url));
  }
  if (request.nextUrl.pathname.includes("login")) return NextResponse.next();
  const accessToken = request.cookies.get("accessToken");
  if (!accessToken) return NextResponse.redirect(new URL(redirectToLogin(request.nextUrl.pathname), request.url));
  const data = decodeJwt(accessToken.value) as JWTPayload;
  if (request.nextUrl.pathname.startsWith("/logout")) {
    const logOutRoute = data.role == "user" ? "/home" : `/${data.role}/login`;
    const response = NextResponse.redirect(new URL(logOutRoute, request.url));
    response.cookies.delete("accessToken");
    return response;
  }
  if (!data || !data.id) return NextResponse.redirect(new URL(redirectToLogin(request.nextUrl.pathname), request.url));
  const isMatchRole = request.nextUrl.href.includes(data.role);
  if (isMatchRole) return NextResponse.next();
  const redirectRoute = data.role == "user" ? "/home" : `/${data.role}`;
  return NextResponse.redirect(new URL(redirectRoute, request.url));
}
const redirectToLogin = (url: string) => {
  if (url.includes("/admin")) return "/admin/login";
  if (url.includes("/partner")) return "/partner/login";
  return "/auth/login";
};
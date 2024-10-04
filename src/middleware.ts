import {decodeJwt, JWTPayload} from 'jose';
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin((?!/login).*)", "/partner((?!/login).*)", "/logout", "/"],
};

const emptyPage = ['/', "/admin", "/partner"]
export function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname
  if(emptyPage.includes(pathName)){
    return NextResponse.redirect(new URL(redirectEmptyRoute(pathName), request.url));
  }
  // if (request.nextUrl.pathname.includes("login")) return NextResponse.next();
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
  const isMatchRole = request.nextUrl.href.includes(data.role as string);
  if (isMatchRole) return NextResponse.next();
  const redirectRoute = data.role == "user" ? "/home" : `/${data.role}`;
  return NextResponse.redirect(new URL(redirectRoute, request.url));
}
const redirectToLogin = (url: string) => {
  if (url.includes("/admin")) return "/admin/login";
  if (url.includes("/partner")) return "/partner/login";
  return "/auth/login";
};
const redirectEmptyRoute = (pathName: string) => {
  if (pathName === "/admin") return "/admin/dashboard";
  if (pathName === "/partner") return "/partner/dashboard";
  return "/home";
}
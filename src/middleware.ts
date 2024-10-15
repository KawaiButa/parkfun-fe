import {decodeJwt, JWTPayload} from 'jose';
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin((?!/login).*)", "/partner((?!/login).*)", "/logout", "/", "/home/:path*"],
};

export function middleware(request: NextRequest) {
  if(request.nextUrl.pathname === "/"){
    return NextResponse.redirect(new URL("/home", request.url));
  }
  const accessToken = request.cookies.get("accessToken");
  if(!accessToken && request.nextUrl.pathname.startsWith("/home"))
    return NextResponse.next()
  if (!accessToken) return NextResponse.redirect(new URL(redirectToLogin(request.nextUrl.pathname), request.url));
  const data = decodeJwt(accessToken.value) as JWTPayload;
  if (request.nextUrl.pathname.startsWith("/logout")) {
    const logOutRoute = data.role == "user" ? "/home" : `/${data.role}/login`;
    const response = NextResponse.redirect(new URL(logOutRoute, request.url));
    response.cookies.delete("accessToken");
    return response;
  }
  if(data.role === "user" && request.nextUrl.pathname.startsWith("/home"))
    return NextResponse.next();
  if (!data || !data.id) return NextResponse.redirect(new URL(redirectToLogin(request.nextUrl.pathname), request.url));
  const isMatchRole = request.nextUrl.pathname.startsWith(`/${data.role}`);
  if (isMatchRole){
    if([`/${data.role}`, "/"].includes(request.nextUrl.pathname)){
      const redirectRoute = data.role == "user" ? "/home" : `/${data.role}/dashboard`;
      return NextResponse.redirect(new URL(redirectRoute, request.url));
    }
    return NextResponse.next();
  } 

  return NextResponse.redirect(new URL(redirectToDashboard(data.role as string), request.url));
    
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
}
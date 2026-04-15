import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type SessionPayload = {
  token?: string;
  role?: "user" | "admin" | "deliverypartner" | string;
};

function getSession(request: NextRequest): SessionPayload {
  const raw = request.cookies.get("plantworld_auth")?.value;
  if (!raw) return {};

  try {
    return JSON.parse(raw) as SessionPayload;
  } catch {
    return {};
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getSession(request);

  const isAuthed = Boolean(session.token);

  const userProtected = [
    "/profile",
    "/cart",
    "/myOrders",
    "/settings",
    "/order-success",
  ].some((p) => pathname.startsWith(p));

  if (userProtected && !isAuthed) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!isAuthed || session.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (
    pathname.startsWith("/deliveryPartner") &&
    !pathname.startsWith("/deliveryPartner/login")
  ) {
    if (!isAuthed || session.role !== "deliverypartner") {
      return NextResponse.redirect(
        new URL("/deliveryPartner/login", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/deliveryPartner/:path*",
    "/profile/:path*",
    "/cart/:path*",
    "/order-success/:path*",
    "/myOrders/:path*",
    "/settings/:path*",
  ],
};

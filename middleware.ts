import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";

const BLOCKED_COUNTRIES = new Set(["RU", "BY", "CN", "KP", "IR", "CU"]);

export function middleware(req: NextRequest) {
  const { country } = geolocation(req);

  // Allow through if country is undefined (local dev) or not blocked
  if (country && BLOCKED_COUNTRIES.has(country)) {
    return new NextResponse("Service not available in your region.", {
      status: 451,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};

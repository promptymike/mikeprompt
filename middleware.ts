import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";

const BLOCKED_COUNTRIES = new Set(["RU", "BY", "CN", "KP", "IR", "CU"]);

export function middleware(req: NextRequest) {
  const { country } = geolocation(req);

  // Geo-block (applied to all routes via matcher)
  if (country && BLOCKED_COUNTRIES.has(country)) {
    return new NextResponse("Service not available in your region.", {
      status: 451,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // Language auto-detection — only on "/" and only when no cookie exists yet
  if (req.nextUrl.pathname === "/") {
    const existingCookie = req.cookies.get("mikeprompt_lang")?.value;
    if (!existingCookie) {
      const detectedLang = country === "PL" ? "pl" : "en";
      const res = NextResponse.next();
      res.cookies.set("mikeprompt_lang", detectedLang, {
        maxAge: 86400,
        path: "/",
        sameSite: "lax",
      });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

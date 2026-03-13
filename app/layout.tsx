import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "MikePrompt — Your AI Prompt Assistant",
  description:
    "Stop guessing. Paste your prompt, Mike makes it better. Free prompt optimizer for finance, admin, accounting, sales and management professionals.",
  openGraph: {
    title: "MikePrompt — Your AI Prompt Assistant",
    description:
      "Stop guessing. Paste your prompt, Mike makes it better. Free prompt optimizer for finance, admin, accounting, sales and management professionals.",
    url: "https://mikeprompt.com",
    siteName: "MikePrompt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MikePrompt — Your AI Prompt Assistant",
    description:
      "Stop guessing. Paste your prompt, Mike makes it better. Free prompt optimizer for finance, admin, accounting, sales and management professionals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

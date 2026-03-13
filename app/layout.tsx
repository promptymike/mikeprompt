import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mikeprompt — Paste your prompt. Mike makes it better.",
  description:
    "Better prompts → better AI answers → less time and money wasted. Free prompt optimizer powered by Claude.",
  openGraph: {
    title: "mikeprompt",
    description: "Better prompts → better AI answers.",
    url: "https://mikeprompt.com",
    siteName: "mikeprompt",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

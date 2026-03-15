import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "MikePrompt — AI Prompt Optimizer dla profesjonalistów",
  description:
    "Wypoleruj swój prompt w 3 sekundy. Działa z ChatGPT, Claude, Gemini i każdym AI. Dla finansów, HR, sprzedaży i adminu.",
  keywords: [
    "AI prompt optimizer", "prompt engineering", "ChatGPT prompts", "Claude prompts",
    "finance AI", "accounting AI", "HR AI prompts", "prompt generator", "prompt improver",
    "AI for professionals", "MikePrompt", "prompt assistant",
  ],
  robots: "index, follow",
  openGraph: {
    title: "MikePrompt — AI Prompt Optimizer dla profesjonalistów",
    description:
      "Wypoleruj swój prompt w 3 sekundy. Działa z ChatGPT, Claude, Gemini i każdym AI. Dla finansów, HR, sprzedaży i adminu.",
    url: "https://mikeprompt.com",
    siteName: "MikePrompt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MikePrompt — AI Prompt Optimizer dla profesjonalistów",
    description:
      "Wypoleruj swój prompt w 3 sekundy. Działa z ChatGPT, Claude, Gemini i każdym AI. Dla finansów, HR, sprzedaży i adminu.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MikePrompt",
  "url": "https://mikeprompt.com",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "AI prompt optimizer for finance, HR, audit and sales professionals. Works with ChatGPT, Claude, Gemini and every AI.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "creator": {
    "@type": "Organization",
    "name": "MikePrompt",
    "url": "https://mikeprompt.com",
    "email": "hello@mikeprompt.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

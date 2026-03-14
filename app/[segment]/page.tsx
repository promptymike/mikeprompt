import { notFound } from "next/navigation";
import type { Metadata } from "next";
import landingPages from "@/data/landing-pages.json";
import LandingPage, { type LandingPageData } from "@/components/LandingPage";

type LandingPagesMap = Record<string, LandingPageData>;

const pages = landingPages as LandingPagesMap;

interface Props {
  params: Promise<{ segment: string }>;
}

export async function generateStaticParams() {
  return Object.keys(pages).map((segment) => ({ segment }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segment } = await params;
  const page = pages[segment];
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.metaKeywords,
    robots: "index, follow",
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://mikeprompt.com/${segment}`,
      siteName: "MikePrompt",
      type: "website",
    },
  };
}

export default async function SegmentPage({ params }: Props) {
  const { segment } = await params;
  const page = pages[segment];
  if (!page) notFound();
  return <LandingPage data={page} />;
}

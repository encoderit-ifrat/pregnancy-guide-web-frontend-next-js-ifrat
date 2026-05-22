import { Metadata } from "next";
import { MetaDetails } from "@/types/shared";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://familj.se";

export const OG_DEFAULT_IMAGE = `${BASE_URL}/images/og/og-default.png`;

export function canonicalUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

export function transliterateSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/[ö]/g, "o")
    .replace(/é/g, "e")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/[^a-z0-9-]/g, "");
}

export function buildMetadataFromMetaDetails(
  metaDetails: MetaDetails | null | undefined,
  fallback: {
    title: string;
    description: string;
    ogImage?: string;
  },
  canonicalPath: string,
): Metadata {
  const title = metaDetails?.metaTitle || fallback.title;
  const description = metaDetails?.metaDescription || fallback.description;
  const ogTitle = metaDetails?.ogTitle || title;
  const ogDescription = metaDetails?.ogDescription || description;
  const ogImage = metaDetails?.ogImage || fallback.ogImage;

  return {
    title,
    description,
    ...(metaDetails?.metaKeywords?.length && {
      keywords: metaDetails.metaKeywords.join(", "),
    }),
    alternates: {
      canonical: canonicalUrl(canonicalPath),
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(ogImage && { images: [{ url: ogImage }] }),
      type: "website",
      locale: "sv_SE",
      siteName: "Familj.se",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
  };
}

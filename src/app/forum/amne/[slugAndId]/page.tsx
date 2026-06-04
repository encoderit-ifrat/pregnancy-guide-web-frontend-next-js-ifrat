import React from "react";
import { Metadata } from "next";
import ThreadDetailClient from "../../[id]/ThreadDetailClient";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugAndId: string }>;
}): Promise<Metadata> {
  const { slugAndId } = await params;
  
  // Extract ID (last segment after hyphen)
  const lastHyphenIndex = slugAndId.lastIndexOf("-");
  const id = lastHyphenIndex !== -1 ? slugAndId.slice(lastHyphenIndex + 1) : slugAndId;

  let title = "Tråd | Forum";
  let description = "Diskutera med andra blivande föräldrar på Familj.se.";

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "";
    // Using a direct fetch to bypass axios instance client-side dependencies (like window)
    const res = await fetch(`${backendUrl}/api/v1/threads/${id}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        title = `${json.data.title} | Forum`;
        
        const rawDesc = json.data.description || "";
        let truncated = "";
        if (rawDesc.length <= 140) {
          truncated = rawDesc;
        } else {
          // Truncate at nearest space before 140 chars
          const sub = rawDesc.substring(0, 140);
          const lastSpace = sub.lastIndexOf(" ");
          truncated = lastSpace !== -1 ? sub.substring(0, lastSpace).trim() + "..." : sub.trim() + "...";
        }
        
        description = `${truncated} Diskutera med andra blivande föräldrar på Familj.se.`;
      }
    }
  } catch (error) {}

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl(`/forum/amne/${slugAndId}`),
    },
    openGraph: {
      type: "article",
      title,
      description,
      images: [{ url: OG_DEFAULT_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: OG_DEFAULT_IMAGE }],
    },
  };
}

export default async function ThreadDetailPageContainer({
  params,
}: {
  params: Promise<{ slugAndId: string }>;
}) {
  const { slugAndId } = await params;
  
  // Extract ID (last segment after hyphen)
  const lastHyphenIndex = slugAndId.lastIndexOf("-");
  const id = lastHyphenIndex !== -1 ? slugAndId.slice(lastHyphenIndex + 1) : slugAndId;

  return <ThreadDetailClient threadId={id} />;
}

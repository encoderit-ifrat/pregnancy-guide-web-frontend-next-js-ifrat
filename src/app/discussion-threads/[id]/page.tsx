import React from "react";
import { Metadata } from "next";
import ThreadDetailClient from "./ThreadDetailClient";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  let title = "View Discussion Thread - Familj";
  let description =
    "Join the conversation and discover community insights on Familj.";

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "";
    // Using a direct fetch to bypass axios instance client-side dependencies (like window)
    const res = await fetch(`${backendUrl}/api/v1/threads/${params.id}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        title = `${json.data.title} - Familj` || title;
        // Truncate description for SEO
        const rawDesc = json.data.description || "";
        description =
          rawDesc.length > 160 ? rawDesc.substring(0, 160) + "..." : rawDesc;
      }
    }
  } catch (error) {
    console.error("Failed to fetch thread metadata:", error);
  }

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ThreadDetailPageContainer({
  params,
}: {
  params: { id: string };
}) {
  return <ThreadDetailClient threadId={params.id} />;
}

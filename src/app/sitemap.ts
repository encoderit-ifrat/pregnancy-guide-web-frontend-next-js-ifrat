import { MetadataRoute } from "next";

const BASE_URL = "https://familj.se";

function safeDate(value: string | undefined | null): Date {
  if (!value) return new Date();
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/graviditet`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/infor-forlossning`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/mat-och-kostrad`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/efter-forlossning`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/barnnamn`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/barnnamn/swajp`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/forum`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
  ];

  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${apiUrl}/api/v1/articles?page=1&limit=1000&lang=sv`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const articles = json?.data?.data ?? [];
      articlePages = articles.map((article: any) => ({
        url: `${BASE_URL}/${article.category?.slug || "graviditet"}/${article.slug}`,
        lastModified: safeDate(article.updated_at || article.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Fail silently — sitemap still returns static pages
  }

  let forumPages: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${apiUrl}/api/v1/threads?page=1&limit=500`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const threads = json?.data?.data ?? [];
      forumPages = threads.map((thread: any) => ({
        url: `${BASE_URL}/forum/amne/${thread.slug || "trad"}-${thread._id}`,
        lastModified: safeDate(thread.last_activity || thread.created_at),
        changeFrequency: "daily" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Fail silently
  }

  return [...staticPages, ...articlePages, ...forumPages];
}

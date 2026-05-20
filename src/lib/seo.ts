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

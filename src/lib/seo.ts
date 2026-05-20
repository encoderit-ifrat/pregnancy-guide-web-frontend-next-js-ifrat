const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://familj.se";

export const OG_DEFAULT_IMAGE = `${BASE_URL}/images/og/og-default.png`;

export function canonicalUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

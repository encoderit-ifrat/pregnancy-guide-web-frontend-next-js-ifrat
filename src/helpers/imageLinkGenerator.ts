// utils/imageLinkGenerator.ts
import { API_BASE_URL } from "@/consts";

export const imageLinkGenerator = (image?: string | null): string => {
  // Return fallback image if no image provided
  if (!image) {
    return "/placeholder.png"; // or any default image path
  }

  // If image already contains http/https, return as-is
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Ensure no double slashes
  const cleanApiUrl = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  const cleanImage = image.startsWith("/") ? image : `/${image}`;

  return `${cleanApiUrl}${cleanImage}`;
};

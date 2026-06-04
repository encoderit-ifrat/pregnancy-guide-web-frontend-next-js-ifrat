import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}
export function omitEmpty<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    const value = obj[key];

    const isEmpty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0) ||
      (isPlainObject(value) && Object.keys(value).length === 0);

    if (!isEmpty) {
      result[key] = value;
    }
  }

  return result;
}

export function generateSlug(text: string): string {
  const transliterationMap: Record<string, string> = {
    å: "a",
    ä: "a",
    ö: "o",
    é: "e",
  };

  let slug = text.toLowerCase();

  // Transliterate specific Swedish characters
  slug = slug.split("").map((char) => transliterationMap[char] || char).join("");

  // Replace spaces with hyphens, remove non-alphanumeric characters (except hyphens)
  slug = slug.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  // Collapse multiple hyphens and trim them from ends
  slug = slug.replace(/-+/g, "-").replace(/^-+|-+$/g, "");

  return slug;
}

import React from "react";
import { SharedMatchedNamesClient } from "./SharedMatchedNamesClient";

async function fetchInitialData(filter: string, user_id?: string, partner_id?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const params = new URLSearchParams();
  if (filter) params.append("filter", filter);
  if (user_id) params.append("user_id", user_id);
  if (partner_id) params.append("partner_id", partner_id);

  try {
    const res = await fetch(`${baseUrl}/api/v1/tinder-names/matching/public?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    const raw = data.data;
    const items = Array.isArray(raw) ? raw : [raw];
    return { ...data, items };
  } catch (error) {
    console.error("Error fetching matching names:", error);
    return null;
  }
}

export default async function SharedMatchedNamesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const user_id = typeof resolvedSearchParams.user_id === "string" ? resolvedSearchParams.user_id : undefined;
  const partner_id = typeof resolvedSearchParams.partner_id === "string" ? resolvedSearchParams.partner_id : undefined;
  const filterParam = typeof resolvedSearchParams.filter === "string" ? resolvedSearchParams.filter : undefined;
  const initialFilter = filterParam === "love" ? "loved" : "liked";

  const initialData = await fetchInitialData(initialFilter, user_id, partner_id);

  return (
    <SharedMatchedNamesClient
      user_id={user_id}
      partner_id={partner_id}
      initialFilter={initialFilter}
      initialData={initialData}
    />
  );
}

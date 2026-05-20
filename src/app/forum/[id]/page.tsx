import { redirect } from "next/navigation";
import { generateSlug } from "@/lib/utils";

export default async function ThreadDetailPageContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let slug = "thread";
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${backendUrl}/api/v1/threads/${id}`);
    if (res.ok) {
      const json = await res.json();
      if (json?.data?.title) {
        slug = generateSlug(json.data.title);
      }
    }
  } catch (error) {}
  
  redirect(`/forum/amne/${slug}-${id}`);
}

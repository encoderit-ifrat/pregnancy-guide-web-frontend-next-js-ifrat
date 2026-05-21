import { Metadata } from "next";
import {
  WeeklyArticlePage,
  generateWeeklyArticleMetadata,
} from "../../_components/weeklyArticlePage";

type Props = { params: Promise<{ week: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { week, slug } = await params;
  return generateWeeklyArticleMetadata({
    week: parseInt(week, 10),
    track: "mamma",
    slug,
  });
}

export default async function Page({ params }: Props) {
  const { week, slug } = await params;
  return WeeklyArticlePage({
    week: parseInt(week, 10),
    track: "mamma",
    slug,
  });
}

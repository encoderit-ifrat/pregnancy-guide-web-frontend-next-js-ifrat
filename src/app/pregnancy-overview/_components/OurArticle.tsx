import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import IconHeading from "@/components/ui/text/IconHeading";
import { ChevronRight, CornerDownLeft, Heart } from "lucide-react";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { Button } from "@/components/ui/Button";

export type Category = {
  _id: string;
  slug: string;
  name: string;
};

export type Tag = {
  _id: string;
  name: string;
  slug: string;
};

export type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  categories: Category[];
  tags: Tag[];
  status: "published" | "draft" | "archived";
  cover_image: string;
  thumbnail: string;
  featured: boolean;
};

type TProps = {
  data: Article[];
};

function OurArticle({ data }: TProps) {
  const shuffled = [...data].sort(() => Math.random() - 0.5);

  const [firstArticle, ...rest] = shuffled;
  const otherArticles = rest.slice(0, 3);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full bg-white">
      <div className="section pb-6">
        <div className="py-6 md:py-0 md:flex md:justify-between items-center mb-14">
          <div className="text-center md:text-left">
            <IconHeading
              text="Articles"
              icon={<Heart />}
              className="text-primary justify-center md:justify-start"
            />
            <SectionHeading>Banner article</SectionHeading>
          </div>
          <div className="hidden md:block">
            <Link href="/search-article?page=1&tag=our-articles&week=">
              <Button variant="default" className="px-6">
                View All <ChevronRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-10 md:grid-cols-2">
          {firstArticle?.slug && (
            <Link
              href={`/articles/${firstArticle?.slug || "article-not-found"}`}
            >
              <div className="border border-gray-100 rounded-xl transition duration-300 hover:bg-gray-50 hover:shadow-lg">
                <Image
                  src={imageLinkGenerator(
                    firstArticle?.thumbnail || firstArticle?.cover_image
                  )}
                  alt={firstArticle?.title || "Banner Image"}
                  height={600}
                  width={600}
                  className="object-cover rounded-xl w-full h-full"
                  priority
                />
                <div className="p-4">
                  <h4 className="text-primary-dark text-xl font-semibold line-clamp-2">
                    {firstArticle.title}
                  </h4>
                  <p>{firstArticle.excerpt}</p>
                </div>
              </div>
            </Link>
          )}
          <div className="">
            {(otherArticles || []).map((article) => (
              <Link
                key={article?.slug}
                href={`/articles/${article?.slug || "article-not-found"}`}
              >
                <div
                  className="w-full flex gap-4 p-2 md:p-0 mb-4 items-center border border-gray-100 rounded-xl transition duration-300 hover:bg-gray-50 hover:shadow-lg"
                  key={article._id}
                >
                  <div className="hidden md:block flex-shrink-0">
                    <Image
                      src={imageLinkGenerator(
                        article?.thumbnail || article?.cover_image
                      )}
                      alt={article?.title || "Banner Image"}
                      height={200}
                      width={200}
                      className="object-cover h-46 w-46 rounded-xl"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-primary-dark text-xl font-semibold line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="line-clamp-4">{article.excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurArticle;

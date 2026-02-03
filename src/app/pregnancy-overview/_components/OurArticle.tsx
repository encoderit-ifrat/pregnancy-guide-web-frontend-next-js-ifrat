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
      <div className="section">
        <div className="md:flex md:justify-between items-center">
          <div>
            <IconHeading
              text="Articles"
              icon={<Heart />}
              className="text-primary items-center"
            />
            <SectionHeading>Banner Article</SectionHeading>
          </div>
          <div className="hidden md:block">
            <Link href="/articles">
              <Button className="px-6">
                View All <ChevronRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {firstArticle?.slug && (
            <div className="h-[300px] sm:h-[400px] lg:h-[400px]">
              <Link
                href={`/articles/${firstArticle?.slug || "article-not-found"}`}
              >
                <Image
                  src={imageLinkGenerator(
                    firstArticle?.thumbnail || firstArticle?.cover_image
                  )}
                  alt={firstArticle?.title || "Banner Image"}
                  height={600}
                  width={600}
                  className="object-cover border rounded-lg w-full h-full mb-4"
                  priority
                />
              </Link>
              <div>
                <h4 className="text-primary-dark text-xl font-semibold">
                  {firstArticle.title}
                </h4>
                <p>{firstArticle.excerpt}</p>
              </div>
            </div>
          )}
          <div className="">
            {(otherArticles || []).map((article) => (
              <Link href={`/articles/${article?.slug || "article-not-found"}`}>
                <div
                  className="w-full flex gap-4 mb-4 items-center border rounded-lg"
                  key={article._id}
                >
                  <div className="mr-2 flex-shrink-0">
                    <Image
                      src={imageLinkGenerator(
                        article?.thumbnail || article?.cover_image
                      )}
                      alt={article?.title || "Banner Image"}
                      height={200}
                      width={200}
                      className="object-cover h-42 w-42 rounded-lg"
                    />
                  </div>
                  <div className="">
                    <h4 className="text-primary-dark text-xl font-semibold">
                      {article.title}
                    </h4>
                    <p>{article.excerpt}</p>
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

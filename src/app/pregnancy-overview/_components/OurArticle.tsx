import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
  const [firstArticle, ...otherArticles] = data;

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full bg-white">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 gap-10 md:grid-cols-2">
      {firstArticle?.slug && (
        <div className="h-[300px] sm:h-[400px] lg:h-[400px]">
          <Link href={`/articles/${firstArticle?.slug || "article-not-found"}`}>
            <Image
              src={imageLinkGenerator(firstArticle?.thumbnail || firstArticle?.cover_image)}
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
        <div className="w-full grid grid-cols-2 gap-4 mb-4" key={article._id}>
          <div className="mr-4">
            {/*<Link href={`/articles/${article?.slug || "article-not-found"}`}>*/}
              <Image
                  src={imageLinkGenerator(article?.thumbnail || article?.cover_image)}
                  alt={article?.title || "Banner Image"}
                  height={200}
                  width={200}
                  className="object-cover h-48 w-48 rounded-lg"
              />
            {/*</Link>*/}
          </div>
         <div>
           <h4 className="text-primary-dark text-xl font-semibold">{article.title}</h4>
           <p>{article.excerpt}</p>
         </div>
        </div>
        ))}
        </div>
      </div>
    </section>
  );
}

export default OurArticle;

import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import ArticleContent from "./ArticleContent";
import TableOfContents from "./TableOfContents";
import Image from "next/image";
import React from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type Article = {
  show_table_of_content: boolean;
  title: string;
  content: string;
  cover_image?: string;
  excerpt?: string;
};

// function extractHeadings(htmlContent: string): {
//   headings: { id: string; text: string; level: number }[];
//   contentWithIds: string;
// } {
//   const headingRegex = /<(h[1-6])(.*?)>([\s\S]*?)<\/\1>/gi;

//   const headings: { id: string; text: string; level: number }[] = [];
//   let index = 0;

//   let contentWithIds = htmlContent;

//   contentWithIds = contentWithIds.replace(
//     headingRegex,
//     (match, tag, attrs, inner) => {
//       const level = Number(tag[1]);

//       // Extract inner text (remove HTML tags)
//       const text = inner.replace(/<[^>]+>/g, "").trim();

//       // Check if heading already has an ID
//       const existingId = attrs.match(/\sid=["']([^"']+)["']/);

//       let id = existingId ? existingId[1] : `heading-${index}`;

//       // Save heading
//       headings.push({ id, text, level });

//       index++;

//       // If ID exists → return unchanged
//       if (existingId) return match;

//       // Otherwise → inject ID after the tag name
//       return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
//     }
//   );

//   return { headings, contentWithIds };
// }
function extractHeadings(htmlContent: string): {
  headings: { id: string; text: string; level: number }[];
  contentWithIds: string;
} {
  const headingRegex = /<(h[1-6])(.*?)>([\s\S]*?)<\/\1>/gi;

  const headings: { id: string; text: string; level: number }[] = [];
  let index = 0;

  let contentWithIds = htmlContent;

  contentWithIds = contentWithIds.replace(
    headingRegex,
    (match, tag, attrs, inner) => {
      const level = Number(tag[1]);

      // Extract inner text (remove HTML tags)
      const text = inner.replace(/<[^>]+>/g, "").trim();

      // Check if heading already has an ID
      const existingId = attrs.match(/\sid=["']([^"']+)["']/);

      const id = existingId ? existingId[1] : `heading-${index}`;

      // Save heading
      headings.push({ id, text, level });

      index++;

      // If ID exists → return unchanged
      if (existingId) return match;

      // Otherwise → inject ID after tag name
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    }
  );

  return { headings, contentWithIds };
}

export default function ArticleWithTOC({ article }: { article: Article }) {
  const { headings, contentWithIds } = extractHeadings(article?.content);

  return (
    <>
      {article?.cover_image && (
        <div className="relative w-full h-[210px] sm:h-[320px] lg:h-[580px] mb-6 rounded-xl overflow-hidden">
          <Image
            src={imageLinkGenerator(article?.cover_image)}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/*{article?.excerpt && (*/}
      {/*  <p className="mb-6 text-lg text-gray-600 leading-relaxed">*/}
      {/*    {article?.excerpt}*/}
      {/*  </p>*/}
      {/*)}*/}

      <div className="flex flex-col lg:flex-row">
        {headings.length > 0 && article.show_table_of_content && (
          <TableOfContents headings={headings} />
        )}
        {/*  hasToC={headings.length > 0} */}
        <div className="w-full lg:flex-1 min-w-0">
          <h1 className="text-4xl md:text-5xl  font-bold text-foreground mb-6 text-wrap">
            {article?.title}
          </h1>
          <ArticleContent content={contentWithIds} />
        </div>
      </div>
    </>
  );
}

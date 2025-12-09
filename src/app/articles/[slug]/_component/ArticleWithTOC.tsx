import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import ArticleContent from "./ArticleContent";
import TableOfContents from "./TableOfContents";
import Image from "next/image";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type Article = {
  title: string;
  content: string;
  cover_image?: string;
  excerpt?: string;
};

// Server-side HTML parsing
function extractHeadings(htmlContent: string): {
  headings: Heading[];
  contentWithIds: string;
} {
  const headingRegex = /<(h[1-6])([^>]*)>(.*?)<\/\1>/gi;
  const headings: Heading[] = [];
  let match;
  let index = 0;

  let contentWithIds = htmlContent;
  headingRegex.lastIndex = 0;

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const tag = match[1];
    const attributes = match[2];
    const text = match[3].replace(/<[^>]*>/g, "");
    const level = parseInt(tag[1]);

    const existingId = attributes.match(/id=["']([^"']+)["']/);
    const id = existingId ? existingId[1] : `heading-${index}`;

    headings.push({ id, text, level });

    if (!existingId) {
      const originalTag = match[0];
      const newTag = originalTag.replace(
        new RegExp(`<${tag}([^>]*)>`, "i"),
        `<${tag}$1 id="${id}">`
      );
      contentWithIds = contentWithIds.replace(originalTag, newTag);
    }

    index++;
  }

  return { headings, contentWithIds };
}

export default function ArticleWithTOC({ article }: { article: Article }) {
  const { headings, contentWithIds } = extractHeadings(article?.content);

  return (
    <>
      {article?.cover_image && (
        <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[600px] mb-6 rounded-xl overflow-hidden">
          <Image
            src={imageLinkGenerator(article?.cover_image)}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {article?.excerpt && (
        <p className="mb-6 text-lg text-gray-600 leading-relaxed">
          {article?.excerpt}
        </p>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {headings.length > 0 && <TableOfContents headings={headings} />}
        <ArticleContent content={contentWithIds} hasToC={headings.length > 0} />
      </div>
    </>
  );
}

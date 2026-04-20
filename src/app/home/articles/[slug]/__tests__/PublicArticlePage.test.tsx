import { render, screen } from "@testing-library/react";
import PublicArticlePage, { generateMetadata } from "../page";
import React from "react";

// ─── Mocks ───────────────────────────────────────────────────────────────────

// Mock next/headers
jest.mock("next/headers", () => ({
  cookies: () => ({
    get: (name: string) => ({ value: "en" }),
  }),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  notFound: jest.fn().mockImplementation(() => {
    const error = new Error("NEXT_NOT_FOUND");
    (error as any).digest = "NEXT_NOT_FOUND";
    throw error;
  }),
}));

import { notFound } from "next/navigation";

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

// Mock the ArticleWithTOC child component
jest.mock("@/app/articles/[slug]/_component/ArticleWithTOC", () => ({
  __esModule: true,
  default: ({ article }: any) => (
    <div data-testid="article-with-toc">
      Mocked ArticleWithTOC for: {article.title}
    </div>
  ),
}));

describe("PublicArticlePage (Server Component)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockArticle = {
    id: "public-art-1",
    title: "Public Pregnancy Overview",
    content: "<p>Welcome to the public guide.</p>",
    excerpt: "A free introduction to pregnancy",
    slug: "public-pregnancy-overview",
    cover_image: "/uploads/image.jpg",
  };

  describe("Page Component", () => {
    it("calls notFound() if article is not found", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      const params = Promise.resolve({ slug: "missing-slug" });
      
      await expect(PublicArticlePage({ params })).rejects.toThrow("NEXT_NOT_FOUND");
      expect(notFound).toHaveBeenCalled();
    });

    it("renders public article title and child component when data is fetched", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          data: mockArticle,
        }),
      });

      const params = Promise.resolve({ slug: "public-pregnancy-overview" });
      const renderedPage = await PublicArticlePage({ params });
      render(renderedPage);

      expect(screen.getByText("Public Pregnancy Overview")).toBeInTheDocument();
      expect(screen.getByTestId("article-with-toc")).toHaveTextContent("Mocked ArticleWithTOC for: Public Pregnancy Overview");
    });
  });

  describe("generateMetadata", () => {
    it("generates default metadata if article is not found", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      const params = Promise.resolve({ slug: "missing-slug" });
      const metadata = await generateMetadata({ params });

      expect(metadata.title).toBe("Article Not Found | Familij");
    });

    it("generates dynamic metadata based on fetched article data", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          data: mockArticle,
        }),
      });

      const params = Promise.resolve({ slug: "public-pregnancy-overview" });
      const metadata = await generateMetadata({ params });

      expect(metadata.title).toBe("Public Pregnancy Overview | Familij");
      expect(metadata.description).toBe("A free introduction to pregnancy");
      // Check OG images
      const ogImages = metadata.openGraph?.images as string[];
      expect(ogImages.length).toBeGreaterThan(0);
      expect(ogImages[0]).toContain("/uploads/image.jpg");
    });
  });
});

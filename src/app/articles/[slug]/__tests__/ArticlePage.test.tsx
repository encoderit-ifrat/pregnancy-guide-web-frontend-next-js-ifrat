import { render, screen } from "@testing-library/react";
import ArticlePage from "../page";
import React from "react";

// ─── Mocks ───────────────────────────────────────────────────────────────────

// Mock next-auth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Mock next/headers
jest.mock("next/headers", () => ({
  cookies: () => ({
    get: (name: string) => ({ value: "en" }),
  }),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn().mockImplementation((url: string) => {
    const error = new Error("NEXT_REDIRECT");
    (error as any).digest = `NEXT_REDIRECT;replace;${url};`;
    throw error;
  }),
  notFound: jest.fn().mockImplementation(() => {
    const error = new Error("NEXT_NOT_FOUND");
    (error as any).digest = "NEXT_NOT_FOUND";
    throw error;
  }),
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

// Mock translation hook for sub-components
jest.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock child components to avoid deep testing browser APIs like IntersectionObserver
jest.mock("../_component/ArticleContent", () => ({
  __esModule: true,
  default: ({ content }: { content: string }) => <div data-testid="article-content" dangerouslySetInnerHTML={{ __html: content }} />,
}));

jest.mock("../_component/TableOfContents", () => ({
  __esModule: true,
  default: ({ headings }: { headings: any[] }) => (
    <div data-testid="toc">
      {headings.map(h => <div key={h.id}>{h.text}</div>)}
    </div>
  ),
}));

describe("ArticlePage (Server Component)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockArticle = {
    id: "art-1",
    title: "Pregnancy Tips",
    content: "<h2 id='h1'>Morning Sickness</h2><p>Eat crackers.</p>",
    excerpt: "Helpful tips for early pregnancy",
    slug: "pregnancy-tips",
    show_table_of_content: true,
  };

  it("redirects to /login if no session is found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const params = Promise.resolve({ slug: "test-slug" });
    await expect(ArticlePage({ params })).rejects.toThrow("NEXT_REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("calls notFound() if article is not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ token: "fake-token" });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const params = Promise.resolve({ slug: "missing-slug" });
    await expect(ArticlePage({ params })).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
  });

  it("renders article title and content when data is fetched", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ token: "fake-token" });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: mockArticle,
      }),
    });

    const params = Promise.resolve({ slug: "pregnancy-tips" });
    const renderedPage = await ArticlePage({ params });
    render(renderedPage);

    expect(screen.getByText("Pregnancy Tips")).toBeInTheDocument();
    expect(screen.getByTestId("article-content")).toBeInTheDocument();
    // Use getAllByText because it appears in both TOC and content
    expect(screen.getAllByText("Morning Sickness").length).toBeGreaterThanOrEqual(1);
  });

  it("correctly extracts headings for Table of Contents", async () => {
    const articleWithHeadings = {
      ...mockArticle,
      content: "<h1>Main Title</h1><h2>First Sub</h2><h3>Second Sub</h3>",
    };

    (getServerSession as jest.Mock).mockResolvedValue({ token: "fake-token" });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: articleWithHeadings,
      }),
    });

    const params = Promise.resolve({ slug: "pregnancy-tips" });
    const renderedPage = await ArticlePage({ params });
    render(renderedPage);

    // TOC and content should contain the headings. Multiples are expected.
    expect(screen.getAllByText("Main Title").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("First Sub").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Second Sub").length).toBeGreaterThanOrEqual(1);
  });
});

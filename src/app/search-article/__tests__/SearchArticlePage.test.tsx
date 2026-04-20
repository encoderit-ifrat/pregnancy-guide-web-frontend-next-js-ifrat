import { render, screen } from "@testing-library/react";
import Page from "../page";
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
  redirect: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import { redirect as mockRedirect } from "next/navigation";

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

// Mock translation
jest.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock child components
jest.mock("../_component/SearchArticle", () => ({
  __esModule: true,
  default: ({ initialData }: any) => <div data-testid="search-article-view">{initialData.length} articles</div>,
}));

jest.mock("@/components/home/HeroSection2", () => ({
  HeroSection2: ({ name }: any) => <div data-testid="hero">{name}</div>,
}));

describe("SearchArticle Page (Server Component)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSuccessResponse = {
    ok: true,
    json: async () => ({
      data: {
        data: [
          { _id: "1", title: "Article 1", slug: "slug-1" },
          { _id: "2", title: "Article 2", slug: "slug-2" },
        ],
        categories: [{ name: "Category 1", title: "Title 1", description: "Desc 1" }],
        pagination: { total: 2, current_page: 1, last_page: 1 },
      },
    }),
  };

  it("renders the hero and search findings when data is fetched", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(mockSuccessResponse);

    // Resolve searchParams promise
    const searchParams = Promise.resolve({ search: "test" });

    // Page is an async component
    const renderedPage = await Page({ searchParams });
    render(renderedPage);

    expect(screen.getByTestId("hero")).toHaveTextContent("Category 1");
    expect(screen.getByTestId("search-article-view")).toHaveTextContent("2 articles");
  });

  it("redirects if only one article is found", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          data: [{ _id: "1", title: "Only Article", slug: "only-slug" }],
        },
      }),
    });

    const searchParams = Promise.resolve({ search: "only" });

    await Page({ searchParams });

    expect(mockRedirect).toHaveBeenCalledWith("/articles/only-slug");
  });

  it("handles fetch errors gracefully", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const searchParams = Promise.resolve({});

    const renderedPage = await Page({ searchParams });
    render(renderedPage);

    // Should still render SearchArticle with empty data
    expect(screen.getByTestId("search-article-view")).toHaveTextContent("0 articles");
  });
});

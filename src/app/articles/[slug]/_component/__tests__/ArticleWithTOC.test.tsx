import { render, screen } from "@testing-library/react";
import ArticleWithTOC, { extractHeadings } from "../ArticleWithTOC";
import React from "react";

// Mock child components
jest.mock("../ArticleContent", () => ({
  __esModule: true,
  default: ({ content }: { content: string }) => <div data-testid="article-content" dangerouslySetInnerHTML={{ __html: content }} />,
}));

jest.mock("../TableOfContents", () => ({
  __esModule: true,
  default: ({ headings }: { headings: any[] }) => (
    <div data-testid="toc">
      {headings.map((h) => (
        <div key={h.id}>{h.text}</div>
      ))}
    </div>
  ),
}));

// Mock helpers
jest.mock("@/helpers/imageLinkGenerator", () => ({
  imageLinkGenerator: (src: string) => `http://mocked-link.com/${src}`,
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ fill, priority, ...props }: any) => <img alt="" {...props} />,
}));

describe("extractHeadings Utility", () => {
  it("extracts headings and injects IDs", () => {
    const html = "<h2>First</h2><h3>Second</h3>";
    const { headings, contentWithIds } = extractHeadings(html);

    expect(headings).toHaveLength(2);
    expect(headings[0]).toEqual({ id: "heading-0", text: "First", level: 2 });
    expect(headings[1]).toEqual({ id: "heading-1", text: "Second", level: 3 });
    expect(contentWithIds).toContain('id="heading-0"');
    expect(contentWithIds).toContain('id="heading-1"');
  });

  it("handles complex HTML and keeps existing IDs", () => {
    const html = '<h2 id="custom-id">Existing</h2><h3>Sub <span>Content</span></h3>';
    const { headings, contentWithIds } = extractHeadings(html);

    expect(headings[0].id).toBe("custom-id");
    expect(headings[1].text).toBe("Sub Content");
    expect(contentWithIds).toContain('id="custom-id"');
  });
});

describe("ArticleWithTOC Component", () => {
  const mockArticle = {
    title: "Test Article",
    content: "<h2>Heading</h2><p>Content</p>",
    show_table_of_content: true,
    cover_image: "/test-image.jpg",
  };

  it("renders cover image if provided", () => {
    render(<ArticleWithTOC article={mockArticle} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "http://mocked-link.com//test-image.jpg");
  });

  it("does not render cover image if not provided", () => {
    const articleNoImg = { ...mockArticle, cover_image: undefined };
    render(<ArticleWithTOC article={articleNoImg} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders TOC if headings exist and show_table_of_content is true", () => {
    render(<ArticleWithTOC article={mockArticle} />);
    expect(screen.getByTestId("toc")).toBeInTheDocument();
    expect(screen.getAllByText("Heading").length).toBeGreaterThanOrEqual(1);
  });

  it("hides TOC if show_table_of_content is false", () => {
    const articleNoTOC = { ...mockArticle, show_table_of_content: false };
    render(<ArticleWithTOC article={articleNoTOC} />);
    expect(screen.queryByTestId("toc")).not.toBeInTheDocument();
  });

  it("hides TOC if no headings are found", () => {
    const articleNoHeadings = { ...mockArticle, content: "<p>No headings here</p>" };
    render(<ArticleWithTOC article={articleNoHeadings} />);
    expect(screen.queryByTestId("toc")).not.toBeInTheDocument();
  });

  it("renders article title and ArticleContent", () => {
    render(<ArticleWithTOC article={mockArticle} />);
    expect(screen.getByText("Test Article")).toBeInTheDocument();
    expect(screen.getByTestId("article-content")).toBeInTheDocument();
  });
});

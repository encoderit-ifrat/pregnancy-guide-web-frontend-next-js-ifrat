import { render, screen } from "@testing-library/react";
import ThreadDetailPageContainer, { generateMetadata } from "../page";
import React from "react";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("../ThreadDetailClient", () => ({
  __esModule: true,
  default: ({ threadId }: { threadId: string }) => (
    <div data-testid="thread-client">Client for {threadId}</div>
  ),
}));

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

describe("ThreadDetailPage (Server Component)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("ThreadDetailPageContainer Component", () => {
    it("renders ThreadDetailClient with correct threadId parameter", () => {
      const params = { id: "thread-123" };
      render(<ThreadDetailPageContainer params={params} />);

      expect(screen.getByTestId("thread-client")).toHaveTextContent("Client for thread-123");
    });
  });

  describe("generateMetadata", () => {
    it("generates default metadata if fetch fails", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));

      const params = { id: "thread-123" };
      const metadata = await generateMetadata({ params });

      expect(metadata.title).toBe("View Discussion Thread - Familj");
      expect(metadata.description).toBe("Join the conversation and discover community insights on Familj.");
    });

    it("generates default metadata if API returns not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      const params = { id: "thread-123" };
      const metadata = await generateMetadata({ params });

      expect(metadata.title).toBe("View Discussion Thread - Familj");
    });

    it("generates dynamic metadata based on fetched thread data", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            title: "Dynamic Thread Title",
            description: "This is a short description about the thread.",
          },
        }),
      });

      const params = { id: "thread-123" };
      const metadata = await generateMetadata({ params });

      expect(metadata.title).toBe("Dynamic Thread Title - Familj");
      expect(metadata.description).toBe("This is a short description about the thread.");
    });

    it("truncates long descriptions for SEO", async () => {
      const longDesc = "A".repeat(200);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            title: "Truncate Test",
            description: longDesc,
          },
        }),
      });

      const params = { id: "thread-123" };
      const metadata = await generateMetadata({ params });

      expect(metadata.description?.length).toBeLessThanOrEqual(165); // 160 + "..."
      expect(metadata.description).toMatch(/\.\.\.$/);
    });
  });
});

import { render, screen } from "@testing-library/react";
import SharedMatchedNamesPage from "../page";
import React from "react";

// ─── Mocks ───────────────────────────────────────────────────────────────────

// Mock the Client Component to avoid deep rendering in this page test
jest.mock("../SharedMatchedNamesClient", () => ({
  SharedMatchedNamesClient: ({ user_id, partner_id, initialFilter, initialData }: any) => (
    <div data-testid="client-component">
      <span data-testid="user-id">{user_id}</span>
      <span data-testid="partner-id">{partner_id}</span>
      <span data-testid="filter">{initialFilter}</span>
      <span data-testid="data-status">{initialData ? "data-loaded" : "no-data"}</span>
    </div>
  ),
}));

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

describe("SharedMatchedNamesPage (Server Component)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockApiResponse = {
    ok: true,
    json: async () => ({
      success: true,
      data: {
        liked: [],
        loved: [],
      },
    }),
  };

  it("passes searchParams correctly to the client component", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(mockApiResponse);

    const searchParams = Promise.resolve({
      user_id: "user-123",
      partner_id: "partner-456",
      filter: "love",
    });

    const renderedPage = await SharedMatchedNamesPage({ searchParams });
    render(renderedPage);

    expect(screen.getByTestId("user-id")).toHaveTextContent("user-123");
    expect(screen.getByTestId("partner-id")).toHaveTextContent("partner-456");
    expect(screen.getByTestId("filter")).toHaveTextContent("loved"); // "love" -> "loved" mapping
    expect(screen.getByTestId("data-status")).toHaveTextContent("data-loaded");
  });

  it("handles missing searchParams with default liked filter", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(mockApiResponse);

    const searchParams = Promise.resolve({});

    const renderedPage = await SharedMatchedNamesPage({ searchParams });
    render(renderedPage);

    expect(screen.getByTestId("filter")).toHaveTextContent("liked");
  });

  it("handles fetch failure gracefully", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const searchParams = Promise.resolve({});

    const renderedPage = await SharedMatchedNamesPage({ searchParams });
    render(renderedPage);

    expect(screen.getByTestId("data-status")).toHaveTextContent("no-data");
  });

  it("handles fetch exception gracefully", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const searchParams = Promise.resolve({});

    const renderedPage = await SharedMatchedNamesPage({ searchParams });
    render(renderedPage);

    expect(screen.getByTestId("data-status")).toHaveTextContent("no-data");
  });
});

import { render, screen } from "@testing-library/react";
import Page from "../page";
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

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

// Mock Presentational Components
jest.mock("@/components/base/NoPregnancyInfo", () => ({
  __esModule: true,
  default: () => <div data-testid="no-pregnancy-info">No Pregnancy Info</div>,
}));

jest.mock("@/components/base/PregnancyError", () => ({
  __esModule: true,
  default: ({ error }: any) => <div data-testid="pregnancy-error">Error: {error}</div>,
}));

jest.mock("../_components/PregnancyOverview", () => ({
  __esModule: true,
  default: ({ pregnancyData, selectedWeek }: any) => (
    <div data-testid="pregnancy-overview-main">
      Overview for week {selectedWeek || "current"} - {pregnancyData?.userProfile?.name}
    </div>
  ),
}));

import { getServerSession } from "next-auth";

describe("PregnancyOverview Page (Server Component)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockResolvedSearchPromise = (obj: any = {}) => Promise.resolve(obj);

  it("renders login prompt when unauthenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const renderedPage = await Page({ searchParams: mockResolvedSearchPromise() });
    render(renderedPage);

    expect(screen.getByText("Please login to view your pregnancy overview.")).toBeInTheDocument();
  });

  it("renders PregnancyError when API fetch fails", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ token: "test-token" });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      text: async () => "Internal Server Error",
      status: 500,
    });

    const renderedPage = await Page({ searchParams: mockResolvedSearchPromise() });
    render(renderedPage);

    expect(screen.getByTestId("pregnancy-error")).toBeInTheDocument();
  });

  it("renders NoPregnancyInfo when data is empty or missing current_pregnancy_data", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ token: "test-token" });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        userProfile: {
          details: {
            current_pregnancy_data: null,
          },
        },
      }),
    });

    const renderedPage = await Page({ searchParams: mockResolvedSearchPromise() });
    render(renderedPage);

    expect(screen.getByTestId("no-pregnancy-info")).toBeInTheDocument();
  });

  it("renders PregnancyOverview when valid data is fetched", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ token: "test-token" });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          userProfile: {
            name: "Jane Doe",
            details: {
              current_pregnancy_data: { some: "data" },
            },
          },
        }
      }),
    });

    const renderedPage = await Page({ searchParams: mockResolvedSearchPromise() });
    render(renderedPage);

    expect(screen.getByTestId("pregnancy-overview-main")).toHaveTextContent("Overview for week current - Jane Doe");
  });

  it("passes selected-week from searchParams to the component", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ token: "test-token" });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          userProfile: {
            name: "Jane Doe",
            details: {
              current_pregnancy_data: { some: "data" },
            },
          },
        }
      }),
    });

    const searchParams = mockResolvedSearchPromise({ "selected-week": "14" });
    const renderedPage = await Page({ searchParams });
    render(renderedPage);

    expect(screen.getByTestId("pregnancy-overview-main")).toHaveTextContent("Overview for week 14 - Jane Doe");
  });
});

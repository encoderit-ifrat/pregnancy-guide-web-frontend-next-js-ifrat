import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SharedMatchedNamesClient } from "../SharedMatchedNamesClient";
import React from "react";
import { useQueryGetMatchingNames } from "../../matchade/_api/useQueryGetMatchingNames";

// ─── Mocks ───────────────────────────────────────────────────────────────────

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock translation hook
jest.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock GuestId hook
jest.mock("@/hooks/useGuestId", () => ({
  useGuestId: () => "mock-guest-id",
}));

// Mock API Query Hook
jest.mock("../../matchade/_api/useQueryGetMatchingNames", () => ({
  useQueryGetMatchingNames: jest.fn(),
}));

// Mock Mutation Hook (shared-list voting)
jest.mock("../../_api/mutations/useMutationVoteListName", () => ({
  useMutationVoteListName: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("SharedMatchedNamesClient Component", () => {
  const mockLikedNames = [
    { _id: "1", name: "Oliver", loved_count: 5, liked_count: 10, gender: "male" as const },
    { _id: "2", name: "Emma", loved_count: 3, liked_count: 8, gender: "female" as const },
  ];

  const mockLovedNames = [
    { _id: "3", name: "Liam", loved_count: 12, liked_count: 4, gender: "male" as const },
  ];

  const mockData = {
    items: [
      {
        liked: mockLikedNames,
        loved: mockLovedNames,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the title and tabs", () => {
    (useQueryGetMatchingNames as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    });

    render(
      <SharedMatchedNamesClient
        initialFilter="liked"
        user_id="user1"
        partner_id="partner1"
      />
    );

    expect(screen.getByText("matchedNames.title")).toBeInTheDocument();
    expect(screen.getByText("matchedNames.mostLiked")).toBeInTheDocument();
    expect(screen.getByText("matchedNames.mostLoved")).toBeInTheDocument();
  });

  it("shows ALL matched names on the liked tab (tabs sort, they do not filter)", () => {
    (useQueryGetMatchingNames as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    render(
      <SharedMatchedNamesClient
        initialFilter="liked"
      />
    );

    // Every matched name is shown regardless of tab; the tab only re-sorts.
    expect(screen.getByText("Oliver")).toBeInTheDocument();
    expect(screen.getByText("Emma")).toBeInTheDocument();
    expect(screen.getByText("Liam")).toBeInTheDocument();
  });

  it("keeps showing all names after switching to the loved (sort) tab", async () => {
    const user = userEvent.setup();
    (useQueryGetMatchingNames as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    render(
      <SharedMatchedNamesClient
        initialFilter="liked"
      />
    );

    // Switch to the "most loved" sort tab
    const lovedTab = screen.getByText("matchedNames.mostLoved");
    await user.click(lovedTab);

    // All names remain visible — the tab only changes the sort order.
    expect(await screen.findByText("Liam")).toBeInTheDocument();
    expect(screen.getByText("Oliver")).toBeInTheDocument();
    expect(screen.getByText("Emma")).toBeInTheDocument();
  });

  it("shows loading state with skeletons", () => {
    (useQueryGetMatchingNames as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    const { container } = render(
      <SharedMatchedNamesClient initialFilter="liked" />
    );

    // Skeleton cards have animate-pulse class
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("shows error message when query fails", () => {
    (useQueryGetMatchingNames as jest.Mock).mockReturnValue({
      isError: true,
      isLoading: false,
    });

    render(
      <SharedMatchedNamesClient initialFilter="liked" />
    );

    expect(screen.getByText("matchedNames.failedLoad")).toBeInTheDocument();
  });

  it("shows 'no names yet shared' when list is empty", () => {
    (useQueryGetMatchingNames as jest.Mock).mockReturnValue({
      data: { items: [{ liked: [], loved: [] }] },
      isLoading: false,
    });

    render(
      <SharedMatchedNamesClient initialFilter="liked" />
    );

    expect(screen.getByText("matchedNames.noNamesYetShared")).toBeInTheDocument();
  });
});

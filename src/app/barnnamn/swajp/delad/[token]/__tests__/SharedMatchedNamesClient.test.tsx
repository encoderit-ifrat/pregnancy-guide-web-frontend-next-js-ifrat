import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SharedMatchedNamesClient } from "../SharedMatchedNamesClient";
import React from "react";
import { useQueryGetMatchingNames } from "../../matched-names/_api/useQueryGetMatchingNames";

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
jest.mock("../../matched-names/_api/useQueryGetMatchingNames", () => ({
  useQueryGetMatchingNames: jest.fn(),
}));

// Mock Mutation Hook
jest.mock("../../for-name-tinder/_api/mutations/useMutationSwipeTinderName", () => ({
  useMutationSwipeTinderName: () => ({
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

  it("renders the list of liked names by default (when initialFilter is liked)", () => {
    (useQueryGetMatchingNames as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    render(
      <SharedMatchedNamesClient
        initialFilter="liked"
      />
    );

    expect(screen.getByText("Oliver")).toBeInTheDocument();
    expect(screen.getByText("Emma")).toBeInTheDocument();
    expect(screen.queryByText("Liam")).not.toBeInTheDocument();
  });

  it("switches to loved tab and displays loved names", async () => {
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

    // Switch to Loved tab
    const lovedTab = screen.getByText("matchedNames.mostLoved");
    await user.click(lovedTab);

    // After switching tab, Liam should be visible
    expect(await screen.findByText("Liam")).toBeInTheDocument();
    expect(screen.queryByText("Oliver")).not.toBeInTheDocument();
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

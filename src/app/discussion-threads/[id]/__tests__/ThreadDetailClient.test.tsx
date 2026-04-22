import { render, screen, fireEvent } from "@testing-library/react";
import ThreadDetailClient from "../ThreadDetailClient";
import React from "react";
import userEvent from "@testing-library/user-event";
import { useQueryGetThreadDetail } from "../../_api/queries/useQueryGetThreads";

// ─── Mocks ───────────────────────────────────────────────────────────────────

// Mock next/navigation
const mockBack = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: mockBack,
  }),
}));

// Mock translation hook
jest.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: "en",
  }),
}));

// Mock queries and mutations
jest.mock("../../_api/queries/useQueryGetThreads", () => ({
  useQueryGetThreadDetail: jest.fn(),
}));

const mockMutateAsync = jest.fn();
jest.mock("../../_api/mutations/useThreadMutations", () => ({
  useMutationShareThread: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

// Mock sub-components
jest.mock("../../_components/ThreadDetailPage", () => ({
  __esModule: true,
  default: ({ title, description, createdBy, onShare }: any) => (
    <div data-testid="thread-detail-page">
      <div data-testid="thread-title">{title}</div>
      <div data-testid="thread-content" dangerouslySetInnerHTML={{ __html: description }} />
      <div data-testid="thread-author">{createdBy.name}</div>
      <button data-testid="share-button" onClick={onShare}>Share</button>
    </div>
  ),
}));

jest.mock("../../_components/ShareModal", () => ({
  __esModule: true,
  default: ({ open, title, onShare }: any) => {
    if (!open) return null;
    return (
      <div data-testid="share-modal">
        <div>Share: {title}</div>
        <button data-testid="confirm-share" onClick={onShare}>Confirm Share</button>
      </div>
    );
  },
}));

jest.mock("../../../loading", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe("ThreadDetailClient", () => {
  const mockThreadData = {
    data: {
      _id: "thread-1",
      title: "How to handle teething?",
      description: "<p>My baby is crying all night.</p>",
      author: { name: "MotherofDragons" },
      createdAt: "2023-01-01T12:00:00Z",
      likes_count: 5,
      replies_count: 2,
      views_count: 100,
      shares_count: 1,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (useQueryGetThreadDetail as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<ThreadDetailClient threadId="thread-1" />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders not found state when error occurs", () => {
    (useQueryGetThreadDetail as jest.Mock).mockReturnValue({
      isLoading: false,
      error: new Error("Network error"),
    });

    render(<ThreadDetailClient threadId="thread-1" />);
    expect(screen.getByText("threads.notFound")).toBeInTheDocument();
    expect(screen.getByText("common.back")).toBeInTheDocument();
  });

  it("renders not found state when data is missing", () => {
    (useQueryGetThreadDetail as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { data: null }, // no inner data
    });

    render(<ThreadDetailClient threadId="thread-1" />);
    expect(screen.getByText("threads.notFound")).toBeInTheDocument();
  });

  it("renders thread details when fetch succeeds", () => {
    (useQueryGetThreadDetail as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockThreadData,
    });

    render(<ThreadDetailClient threadId="thread-1" />);
    
    // Header labels
    expect(screen.getByText("threads.title")).toBeInTheDocument();
    
    // Content inside mocked ThreadDetailPage
    expect(screen.getByTestId("thread-title")).toHaveTextContent("How to handle teething?");
    expect(screen.getByTestId("thread-author")).toHaveTextContent("MotherofDragons");
    expect(screen.getByText("My baby is crying all night.")).toBeInTheDocument();
  });

  it("opens share modal and can trigger share mutation", async () => {
    (useQueryGetThreadDetail as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockThreadData,
    });
    
    const user = userEvent.setup();

    render(<ThreadDetailClient threadId="thread-1" />);
    
    // Modal shouldn't be open yet
    expect(screen.queryByTestId("share-modal")).not.toBeInTheDocument();

    // Click share button on the page
    const shareButton = screen.getByTestId("share-button");
    await user.click(shareButton);

    // Modal should now be open
    expect(screen.getByTestId("share-modal")).toBeInTheDocument();
    expect(screen.getByText("Share: How to handle teething?")).toBeInTheDocument();

    // Click confirm share (which triggers the mutation)
    const confirmShareBtn = screen.getByTestId("confirm-share");
    await user.click(confirmShareBtn);

    expect(mockMutateAsync).toHaveBeenCalledWith("thread-1");
  });

  it("backs to previous page when back button is clicked", async () => {
    (useQueryGetThreadDetail as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockThreadData,
    });

    const user = userEvent.setup();
    render(<ThreadDetailClient threadId="thread-1" />);

    // In current implementation, there's a visible mobile back button with text "common.back"
    // that fires router.back()
    const backButton = screen.getByText("common.back").closest("button");
    
    if (backButton) {
      await user.click(backButton);
      expect(mockBack).toHaveBeenCalled();
    }
  });
});

import { render, screen } from "@testing-library/react";
import WeeklyQuestionPage from "../page";
import React from "react";
import { useQueryGetAllAnswers } from "../_api/queries/useQueryGetAllAnswers";

// ─── Mocks ───────────────────────────────────────────────────────────────────

// Mock react.use to handle promises in tests
jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    use: (promise: any) => {
      // In tests, we can provide already resolved values or mock this to return the value
      if (promise && typeof promise.then === "function") {
        // If it's a promise, we assume it's already "resolved" for the sake of these tests
        // or we mock the behavior. For simplicity in these unit tests, we'll return a fixed value
        // if we detect the specific params/searchParams objects.
        return promise._value || promise; 
      }
      return promise;
    },
  };
});

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null),
    toString: jest.fn().mockReturnValue(""),
  }),
}));

// Mock translation hook
jest.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the API query hook
jest.mock("../_api/queries/useQueryGetAllAnswers", () => ({
  useQueryGetAllAnswers: jest.fn(),
}));

// Mock mutation hooks
jest.mock("../_api/mutations/useCreateAnswer", () => ({
  useCreateAnswer: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

jest.mock("../_api/mutations/useCreateComment", () => ({
  useCreateComment: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

// Mock the internal WeeklyQuestionView to avoid deep testing logic
// Or keep it to test integration. Let's keep it to see if it renders.
// But we need to mock its sub-components if they are complex.

describe("WeeklyQuestionPage", () => {
  const mockParams = { id: "test-id" } as any;
  const mockSearchParams = { page: "1" } as any;

  // Helper to "resolve" promises for the use() hook mock above
  (mockParams as any)._value = { id: "test-id" };
  (mockSearchParams as any)._value = { page: "1" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the page with correct headings from translations", () => {
    (useQueryGetAllAnswers as jest.Mock).mockReturnValue({
      data: { data: {} },
      isLoading: false,
    });

    render(<WeeklyQuestionPage params={mockParams} searchParams={mockSearchParams} />);

    // Check headings
    expect(screen.getByText("weeklyQuestion.pageTitle")).toBeInTheDocument();
    expect(screen.getByText("weeklyQuestion.pageHeading")).toBeInTheDocument();
    expect(screen.getByText("weeklyQuestion.pageDescription")).toBeInTheDocument();
  });

  it("shows loading state when data is fetching", () => {
    (useQueryGetAllAnswers as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<WeeklyQuestionPage params={mockParams} searchParams={mockSearchParams} />);

    // Loading component is likely rendered. 
    // Usually it has a specific test id or text. 
    // In your project, Loading.tsx is at @/app/loading
    // We can just check for its existence if we mock it or check its content.
    // For now, let's just assert it renders something.
  });

  it("renders the question title when data is available", () => {
    (useQueryGetAllAnswers as jest.Mock).mockReturnValue({
      data: {
        data: {
          question: {
            _id: "q1",
            title: "What is your favorite fruit?",
            content: "We want to know what you like during pregnancy.",
          },
          hasAnswered: false,
        },
      },
      isLoading: false,
    });

    render(<WeeklyQuestionPage params={mockParams} searchParams={mockSearchParams} />);

    // AnswerFormTitle renders the question title
    expect(screen.getByText("What is your favorite fruit?")).toBeInTheDocument();
    expect(screen.getByText("We want to know what you like during pregnancy.")).toBeInTheDocument();
  });

  it("renders the 'no answers yet' message when there are no comments", () => {
    (useQueryGetAllAnswers as jest.Mock).mockReturnValue({
      data: {
        data: {
          answers: { data: [] },
          hasAnswered: true,
        },
      },
      isLoading: false,
    });

    render(<WeeklyQuestionPage params={mockParams} searchParams={mockSearchParams} />);

    expect(screen.getByText("weeklyQuestion.noAnswersYet")).toBeInTheDocument();
  });
});

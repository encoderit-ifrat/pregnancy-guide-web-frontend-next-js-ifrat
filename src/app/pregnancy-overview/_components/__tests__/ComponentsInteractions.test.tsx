import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

// 1. MOCKS (Top level)
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(() => "/"),
}));

jest.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@/hooks/useCurrentUser", () => ({
  useCurrentUser: jest.fn(() => ({
    user: {
      _id: "user-123",
      roles: [{ name: "user" }],
      details: {
        current_pregnancy_data: { week: 10, day: 2 },
        current_pregnancy_week: 10,
        due_date: "2024-12-31",
        last_period_date: "2024-03-25"
      }
    }
  })),
}));

jest.mock("@/helpers/imageLinkGenerator", () => ({
  imageLinkGenerator: (src: string) => src || "/placeholder.png",
}));

// Mock the heavy components/hooks to prevent QueryClient issues
jest.mock("@/app/check-lists/_api/mutations/UseMutationToggleChecklist", () => ({
  useMutationToggleChecklist: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock("@/app/weekly-question/[id]/_api/queries/useQueryGetAllAnswers", () => ({
  useQueryGetAllAnswers: () => ({
    data: { data: { hasAnswered: false, question: {}, statistics: { statistics: [] } } },
    isLoading: false,
    refetch: jest.fn(),
  }),
}));

jest.mock("@/app/pregnancy-overview/_api/mutation/useQuestionLike", () => ({
  useQuestionLike: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock("@/app/pregnancy-overview/_api/mutation/useQuestionDislike", () => ({
  useQuestionDislike: () => ({ mutate: jest.fn(), isPending: false }),
}));

// Mock AnswerForm to avoid its internal hooks
jest.mock("@/app/weekly-question/[id]/_components/AnswerForm", () => {
    const MockForm = ({ children }: any) => <div>{children}</div>;
    MockForm.displayName = "MockAnswerForm";
    
    const RadioGroup = () => <div data-testid="mock-radio-group" />;
    RadioGroup.displayName = "AnswerFormRadioGroup";
    
    const SubmitButton = () => <button>pregnancy.submit</button>;
    SubmitButton.displayName = "AnswerFormSubmitButton";

    return {
        __esModule: true,
        default: MockForm,
        AnswerFormRadioGroup: RadioGroup,
        AnswerFormSubmitButton: SubmitButton,
        AnswerFormPercentage: () => null,
        AnswerFormSeeAnswersButton: () => <button>pregnancy.seeAnswers</button>,
    };
});

// 2. COMPONENTS
import OurArticle from "../OurArticle";
import OverviewCategories from "../OverviewCategories";
import OverviewChecklist from "../OverviewChecklist";
import QuestionOfTheWeek from "../QuestionOfTheWeek";
import WeekSelector from "../WeekSelector";
import WeeklyDetails from "../WeeklyDetails";

describe("Pregnancy Overview - Buttons & Links Interaction Tests", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, refresh: jest.fn() });
  });

  // 1. OurArticle
  describe("OurArticle Component", () => {
    const mockArticles = [
      { _id: "1", title: "Main Article", slug: "main-slug", excerpt: "...", thumbnail: "", cover_image: "", featured: true, categories: [], tags: [], status: "published" as const },
      { _id: "2", title: "Sub Article", slug: "sub-slug", excerpt: "...", thumbnail: "", cover_image: "", featured: false, categories: [], tags: [], status: "published" as const },
    ];

    it("verifies links in OurArticle", () => {
      render(<OurArticle data={mockArticles} weeklyDetails={{ week: 10 }} />);
      expect(screen.getByRole("link", { name: /pregnancy.viewAll/i })).toHaveAttribute("href", expect.stringContaining("tag=banner-article"));
      expect(screen.getByRole("link", { name: /Main Article/i })).toHaveAttribute("href", "/articles/main-slug");
    });
  });

  // 2. OverviewCategories
  describe("OverviewCategories Component", () => {
    it("verifies category navigation links", () => {
      render(<OverviewCategories />);
      const motherLink = screen.getByRole("link", { name: /pregnancy.categories.mother/i });
      expect(motherLink).toHaveAttribute("href", expect.stringContaining("tag=Mother"));
    });
  });

  // 3. OverviewChecklist
  describe("OverviewChecklist Component", () => {
    const mockChecklists = [
      { 
        _id: "list-1", 
        title: "Checklist 1", 
        description: "...", 
        items: [],
        category: "Test Category",
        is_active: true
      }
    ];

    it("verifies buttons and 'See All' link", () => {
      render(<OverviewChecklist checkLists={mockChecklists} count={1} />);
      expect(screen.getByRole("button", { name: /checklists.addList/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /checklists.seeAll/i })).toHaveAttribute("href", "/check-lists");
    });
  });

  // 4. QuestionOfTheWeek
  describe("QuestionOfTheWeek Component", () => {
    const mockQuestion = { _id: "q-1", title: "Question Title", week: 10, answer_options: [], type: "radio" as const };

    it("verifies form interaction presence", () => {
      render(<QuestionOfTheWeek question={mockQuestion} currentWeek={10} />);
      expect(screen.getByText(/Question Title/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /pregnancy.submit/i })).toBeInTheDocument();
    });
  });

  // 5. WeekSelector
  describe("WeekSelector Component", () => {
    it("verifies previous/next and week number buttons", async () => {
      const user = userEvent.setup();
      const onWeekChange = jest.fn();
      render(<WeekSelector currentWeek={10} onWeekChange={onWeekChange} />);
      
      const nextBtn = screen.getByRole("button", { name: /pregnancy.nextWeek/i });
      await user.click(nextBtn);
      expect(onWeekChange).toHaveBeenCalled();
    });
  });

  // 6. WeeklyDetails
  describe("WeeklyDetails Component", () => {
    const mockData = { title: "Week Article", slug: "week-slug", excerpt: "...", cover_image: "", thumbnail_image: "" };

    it("verifies the article link", () => {
      render(<WeeklyDetails data={mockData} />);
      expect(screen.getAllByRole("link")[0]).toHaveAttribute("href", "/articles/week-slug");
    });
  });
});

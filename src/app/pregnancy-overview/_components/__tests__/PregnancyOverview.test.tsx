import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PregnancyOverview from "../PregnancyOverview";

// ─── Mocks ───────────────────────────────────────────────────────────────────

import { useRouter, usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("@/hooks/useDebounce", () => ({
  // Bypass internal debouncing timers for instant test evaluation
  useDebounce: (val: any) => val, 
}));

// Provide minimal static stubs for nested heavy sub-components to test conditional layout
// Provide minimal static stubs for nested heavy sub-components to test conditional layout
jest.mock("../OverviewCategories", () => {
    const Component = () => <div data-testid="overview-categories" />;
    Component.displayName = "OverviewCategories";
    return Component;
});
jest.mock("../PregnancyDetails", () => {
    const Component = () => <div data-testid="pregnancy-details" />;
    Component.displayName = "PregnancyDetails";
    return Component;
});
jest.mock("../WeeklyDetails", () => {
    const Component = () => <div data-testid="weekly-details" />;
    Component.displayName = "WeeklyDetails";
    return Component;
});
jest.mock("../QuestionOfTheWeek", () => {
    const Component = () => <div data-testid="question-of-the-week" />;
    Component.displayName = "QuestionOfTheWeek";
    return Component;
});
jest.mock("../WeeklyArticle", () => {
    const Component = () => <div data-testid="weekly-article" />;
    Component.displayName = "WeeklyArticle";
    return Component;
});
jest.mock("../OverviewChecklist", () => {
    const Component = () => <div data-testid="overview-checklist" />;
    Component.displayName = "OverviewChecklist";
    return Component;
});
jest.mock("@/components/base/ArticleSection", () => {
    const Component = () => <div data-testid="article-section" />;
    Component.displayName = "ArticleSection";
    return Component;
});
jest.mock("../OurArticle", () => {
    const Component = () => <div data-testid="our-article" />;
    Component.displayName = "OurArticle";
    return Component;
});
jest.mock("@/components/base/SpecialArticleSection", () => {
    const Component = () => <div data-testid="special-article-section" />;
    Component.displayName = "SpecialArticleSection";
    return Component;
});
jest.mock("@/app/pregnancy-overview/_components/CheckListSection", () => {
    const Component = ({ children }: any) => <div data-testid="checklist-section">{children}</div>;
    Component.displayName = "CheckListSection";
    return Component;
});

// Mock SVG layout separators
jest.mock("@/components/layout/svg/WaveDivider", () => {
    const Component = () => <div data-testid="wave-divider" />;
    Component.displayName = "WaveDivider";
    return Component;
});
jest.mock("@/components/layout/svg/ConcaveCurve", () => {
    const Component = () => <div data-testid="concave-curve" />;
    Component.displayName = "ConcaveCurve";
    return Component;
});

// WeekSelector can be partially mocked so we can track interactions easily OR fully rendered. 
// Rendering it fully is fine to test local state transition, but since it's already tested, 
// we will just verify if the mock receives props correctly or simulate it lightly.
jest.mock("../WeekSelector", () => {
    const Component = ({ onWeekChange, currentWeek }: any) => (
        <div data-testid="week-selector">
          Current Week: {currentWeek}
          <button onClick={() => onWeekChange(currentWeek + 1)}>Simulate Next</button>
        </div>
    );
    Component.displayName = "WeekSelector";
    return Component;
});

describe("PregnancyOverview Component", () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue("/pregnancy-overview");
  });

  const basePregnancyData = {
    userProfile: {
      _id: "user-1",
      name: "Jane Doe",
      email: "jane@example.com",
      mobile: "1234567890",
      dob: "1990-01-01",
      gender: "female" as const,
      details: {
        current_pregnancy_week: 11,
        due_date: "2024-12-31",
        last_period_date: "2024-03-25",
        current_pregnancy_data: { week: 11, day: 2, percentage: 40 }, // Meaning week 12 (11+1)
      },
      roles: [{ name: "user" }],
    },
    articles: {
      latest: [],
      popularWeeks: [],
      specialArticle: [],
      bannerArticle: [],
      weeklyArticles: [],
    },
    questions: { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
    checklist: { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
    weeklyDetails: { _id: "wd-1", title: "Week 12 Info", description: "Your baby is growing", week: 12 },
  };



  it("calculates initial current week appropriately based on userProfile days and weeks", () => {
    // If user has 11 weeks and 2 days -> it translates to week 12
    render(<PregnancyOverview pregnancyData={basePregnancyData} />);

    // Since selectedWeek is undefined, it falls back to currentWeek 12
    expect(screen.getByText("Current Week: 12")).toBeInTheDocument();
  });

  it("renders conditionally populated sections when article data exists", () => {
    const mockArticle = {
      _id: "1",
      title: "Test Article",
      slug: "test-article",
      excerpt: "Excerpt",
      categories: [],
      tags: [],
      status: "published" as const,
      cover_image: "",
      featured: false,
    };

    const richData = {
      ...basePregnancyData,
      articles: {
        ...basePregnancyData.articles,
        latest: [mockArticle],
        popularWeeks: [mockArticle],
        specialArticle: [mockArticle],
        bannerArticle: [mockArticle],
        weeklyArticles: [mockArticle],
      },
    };

    render(<PregnancyOverview pregnancyData={richData} />);

    expect(screen.getByTestId("weekly-details")).toBeInTheDocument();
    expect(screen.getByTestId("weekly-article")).toBeInTheDocument();     // represents popularWeeks rendering WeeklyArticle component
    expect(screen.getByTestId("article-section")).toBeInTheDocument();    // represents latest
    expect(screen.getByTestId("our-article")).toBeInTheDocument();        // represents bannerArticle
    expect(screen.getByTestId("special-article-section")).toBeInTheDocument(); 
  });

  it("renders QuestionOfTheWeek conditionally based on missing question data or partner role constraints", () => {
    // Empty questions
    const { unmount } = render(<PregnancyOverview pregnancyData={basePregnancyData} />);
    expect(screen.queryByTestId("question-of-the-week")).not.toBeInTheDocument();
    unmount();

    // Contains questions and non-partner role
    const questionData = {
      ...basePregnancyData,
      questions: { data: [{ _id: "q-123", question: "Test Question?", week: 12 }], pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } },
    };
    render(<PregnancyOverview pregnancyData={questionData} />);
    expect(screen.getByTestId("question-of-the-week")).toBeInTheDocument();
  });

  it("conceals QuestionOfTheWeek if role is partner", () => {
    const partnerData = {
      ...basePregnancyData,
      userProfile: {
        ...basePregnancyData.userProfile,
        roles: [{ name: "partner" }],
      },
      questions: { data: [{ _id: "q-123", question: "Test Question?", week: 12 }], pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } },
    };

    render(<PregnancyOverview pregnancyData={partnerData} />);
    // Even with data, if role is partner, it hides
    expect(screen.queryByTestId("question-of-the-week")).not.toBeInTheDocument();
  });

  it("triggers router push when child WeekSelector emits a new week selection", async () => {
    const user = userEvent.setup();
    render(<PregnancyOverview pregnancyData={basePregnancyData} selectedWeek={15} />);

    // WeekSelector is mocked to expose Current Week + 1
    const simulateButton = screen.getByText("Simulate Next");
    await user.click(simulateButton);

    // Because useDebounce is bypassed returning instant value, push should run via effect
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/pregnancy-overview?selected-week=16");
    });
  });
});

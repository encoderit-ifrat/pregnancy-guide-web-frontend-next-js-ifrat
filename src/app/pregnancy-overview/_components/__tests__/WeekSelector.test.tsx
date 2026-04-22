import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WeekSelector from "../WeekSelector";

// Mock Translation
jest.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("WeekSelector Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default values", () => {
    render(<WeekSelector currentWeek={15} />);
    
    // Middle week should be rendered
    expect(screen.getByText("15")).toBeInTheDocument();
    
    // Label
    expect(screen.getByText("Week")).toBeInTheDocument();
  });

  it("allows clicking next week and calls onWeekChange", async () => {
    const user = userEvent.setup();
    const handleWeekChange = jest.fn();
    
    render(<WeekSelector currentWeek={10} onWeekChange={handleWeekChange} />);
    
    // Standard rendering puts 10 in the middle, up to 13 visible
    const nextButton = screen.getByRole("button", { name: "pregnancy.nextWeek" });
    await user.click(nextButton);

    expect(handleWeekChange).toHaveBeenCalledWith(11);
  });

  it("allows clicking previous week and calls onWeekChange", async () => {
    const user = userEvent.setup();
    const handleWeekChange = jest.fn();
    
    render(<WeekSelector currentWeek={10} onWeekChange={handleWeekChange} />);
    
    const prevButton = screen.getByRole("button", { name: "pregnancy.previousWeek" });
    await user.click(prevButton);

    expect(handleWeekChange).toHaveBeenCalledWith(9);
  });

  it("disables previous button when at minWeek", () => {
    render(<WeekSelector currentWeek={0} minWeek={0} />);
    
    const prevButton = screen.getByRole("button", { name: "pregnancy.previousWeek" });
    expect(prevButton).toBeDisabled();
  });

  it("disables next button when at maxWeek", () => {
    render(<WeekSelector currentWeek={45} maxWeek={45} />);
    
    const nextButton = screen.getByRole("button", { name: "pregnancy.nextWeek" });
    expect(nextButton).toBeDisabled();
  });

  it("calls onWeekChange when a specific visible week number is clicked", async () => {
    const user = userEvent.setup();
    const handleWeekChange = jest.fn();
    
    render(<WeekSelector currentWeek={10} onWeekChange={handleWeekChange} />);
    
    // 12 should be visible since default max visible is 7 (10-3 to 10+3) -> (7 to 13)
    const week12Button = screen.getByText("12").closest("button");
    if (week12Button) {
      await user.click(week12Button);
    }

    expect(handleWeekChange).toHaveBeenCalledWith(12);
  });

  it("does not call onWeekChange when the currently selected week is clicked", async () => {
    const user = userEvent.setup();
    const handleWeekChange = jest.fn();
    
    render(<WeekSelector currentWeek={10} onWeekChange={handleWeekChange} />);
    
    const currentWeekButton = screen.getByText("10").closest("button");
    if (currentWeekButton) {
      await user.click(currentWeekButton);
    }

    expect(handleWeekChange).not.toHaveBeenCalled();
  });

  it("renders a loading state with bouncing animation dots", () => {
    const { container } = render(<WeekSelector currentWeek={10} isLoading={true} />);
    
    // There are 3 bouncing dots per the source code implementation of the generic skeleton mapping
    const dots = container.querySelectorAll(".animate-bounce");
    expect(dots.length).toBe(3);
  });
});

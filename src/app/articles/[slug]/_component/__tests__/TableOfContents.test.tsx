import { render, screen, fireEvent, act } from "@testing-library/react";
import TableOfContents from "../TableOfContents";
import React from "react";

// Mock IntersectionObserver
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
const mockUnobserve = jest.fn();

(global as any).IntersectionObserver = jest.fn((callback) => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
  unobserve: mockUnobserve,
  trigger: (entries: any[]) => callback(entries),
}));

describe("TableOfContents Component", () => {
  const headings = [
    { id: "h0", text: "Heading 1", level: 2 },
    { id: "h1", text: "Heading 2", level: 3 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock getElementById
    document.getElementById = jest.fn().mockReturnValue({
      getBoundingClientRect: () => ({ top: 100 }),
    });
    // Mock scrollTo
    window.scrollTo = jest.fn();
  });

  it("renders the list of headings", () => {
    render(<TableOfContents headings={headings} />);
    expect(screen.getByText("Article Tabs")).toBeInTheDocument();
    expect(screen.getByText("Heading 1")).toBeInTheDocument();
    expect(screen.getByText("Heading 2")).toBeInTheDocument();
  });

  it("calls scrollTo when a heading is clicked", () => {
    render(<TableOfContents headings={headings} />);
    const headingItem = screen.getByText("Heading 1");
    fireEvent.click(headingItem);

    expect(document.getElementById).toHaveBeenCalledWith("h0");
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("updates activeId when an entry is intersecting", () => {
    render(<TableOfContents headings={headings} />);
    
    const observerInstance = (global.IntersectionObserver as jest.Mock).mock.results[0].value;
    
    // Simulate intersection
    act(() => {
      observerInstance.trigger([{ isIntersecting: true, target: { id: "h1" } }]);
    });

    const activeItem = screen.getByText("Heading 2");
    expect(activeItem).toHaveClass("text-soft");
    
    const inactiveItem = screen.getByText("Heading 1");
    expect(inactiveItem).toHaveClass("text-gray-700");
  });

  it("applies correct indentation based on heading level", () => {
    render(<TableOfContents headings={headings} />);
    const h1 = screen.getByText("Heading 1");
    const h2 = screen.getByText("Heading 2");

    // level 2 -> (2-1)*1rem = 1rem
    expect(h1).toHaveStyle("margin-left: 1rem");
    // level 3 -> (3-1)*1rem = 2rem
    expect(h2).toHaveStyle("margin-left: 2rem");
  });

  it("disconnects observer on unmount", () => {
    const { unmount } = render(<TableOfContents headings={headings} />);
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});

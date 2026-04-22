import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnswerForm, {
  AnswerFormTitle,
  AnswerFormDescription,
  AnswerFormRadioGroup,
  AnswerFormPercentage,
  AnswerFormComment,
  AnswerFormSeeAnswersButton,
  AnswerFormSubmitButton,
} from "../AnswerForm";

// ─── Mocks ───────────────────────────────────────────────────────────────────

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateAnswer } from "../../_api/mutations/useCreateAnswer";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../../_api/mutations/useCreateAnswer", () => ({
  useCreateAnswer: jest.fn(),
}));

describe("AnswerForm Components", () => {
  const mockPush = jest.fn();
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useCreateAnswer as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  const mockData = {
    hasAnswered: false,
    question: {
      id: "q-123",
      question: "Sample Question Title",
      description: "Sample Question Description",
      answers_count: 5,
      answer_options: [
        { _id: "opt-1", content: "Option One", vote_count: 2 },
        { _id: "opt-2", content: "Option Two", vote_count: 3 },
      ],
    },
    statistics: [
      { option_id: "opt-1", content: "Option One", count: 2, percentage: 40 },
      { option_id: "opt-2", content: "Option Two", count: 3, percentage: 60 },
    ],
  };

  const TestWrapper = ({ children, dataOverrides = {} }: any) => (
    <AnswerForm data={{ ...mockData, ...dataOverrides }}>
      {children}
    </AnswerForm>
  );

  describe("AnswerFormTitle & AnswerFormDescription", () => {
    it("renders the title and description properly from context", () => {
      render(
        <TestWrapper>
          <AnswerFormTitle />
          <AnswerFormDescription />
        </TestWrapper>
      );

      expect(screen.getByText("Sample Question Title")).toBeInTheDocument();
      expect(screen.getByText("Sample Question Description")).toBeInTheDocument();
    });
  });

  describe("AnswerFormRadioGroup", () => {
    it("renders radio options and allows selection", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AnswerFormRadioGroup />
        </TestWrapper>
      );

      const option1Label = screen.getByText("Option One").closest("label");
      expect(option1Label).toBeInTheDocument();

      if (option1Label) {
        await user.click(option1Label);
      }
      
      const option2Label = screen.getByText("Option Two").closest("label");
      if (option2Label) {
        await user.click(option2Label);
      }

      // Check if visually selected via Tailwind classes (white text when selected)
      expect(option2Label).toHaveClass("text-white");
    });

    it("pre-selects the option if the user has already answered", () => {
      const answeredData = {
        hasAnswered: true,
        userAnswer: {
          answer_option_id: "opt-2",
          comment: "",
          question_id: "q-123",
        },
      };

      render(
        <TestWrapper dataOverrides={answeredData}>
          <AnswerFormRadioGroup />
        </TestWrapper>
      );

      const option2Label = screen.getByText("Option Two").closest("label");
      expect(option2Label).toHaveClass("text-white"); // Selected styling
    });
  });

  describe("AnswerFormPercentage", () => {
    it("renders percentage UI accurately from statistics", () => {
      render(
        <TestWrapper>
          <AnswerFormPercentage />
        </TestWrapper>
      );

      expect(screen.getByText("40%")).toBeInTheDocument();
      expect(screen.getByText("60%")).toBeInTheDocument();
    });
  });

  describe("AnswerFormComment", () => {
    it("renders textarea and handles input state", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AnswerFormComment />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText("weeklyQuestion.commentPlaceholder");
      expect(textarea).toBeInTheDocument();

      await user.type(textarea, "My comment");
      expect(textarea).toHaveValue("My comment");
    });
  });

  describe("AnswerFormSeeAnswersButton", () => {
    it("pushes router correctly when clicked", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AnswerFormSeeAnswersButton />
        </TestWrapper>
      );

      const button = screen.getByText("weeklyQuestion.seeAnswersComments");
      await user.click(button);

      expect(mockPush).toHaveBeenCalled();
      expect(mockPush.mock.calls[0][0]).toContain("/weekly-question/q-123?t=");
    });
  });

  describe("AnswerFormSubmitButton", () => {
    beforeEach(() => {
      // Setup mutation to immediately trigger onSuccess callback during tests
      mockMutate.mockImplementation((payload, config) => {
        if (config?.onSuccess) config.onSuccess();
      });
    });

    it("shows error toast if no option is selected", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AnswerFormSubmitButton />
        </TestWrapper>
      );

      const submitButton = screen.getByText("weeklyQuestion.submitAnswer");
      await user.click(submitButton);

      expect(toast.error).toHaveBeenCalledWith("weeklyQuestion.selectOption");
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("triggers mutation with correct payload and routes successfully", async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn();

      render(
        <AnswerForm data={mockData} onAnswerSubmitted={mockOnSubmit}>
          <AnswerFormRadioGroup />
          <AnswerFormComment />
          <AnswerFormSubmitButton />
        </AnswerForm>
      );

      // Select an option
      const optionLabel = screen.getByText("Option One").closest("label");
      if (optionLabel) await user.click(optionLabel);

      // Type comment
      const textarea = screen.getByPlaceholderText("weeklyQuestion.commentPlaceholder");
      await user.type(textarea, "Hello test!");

      // Submit
      const submitButton = screen.getByText("weeklyQuestion.submitAnswer");
      await user.click(submitButton);

      // Verify
      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: "q-123",
          comment: "Hello test!",
          answer_option_id: "opt-1",
        },
        expect.any(Object)
      );

      expect(toast.success).toHaveBeenCalledWith("weeklyQuestion.answerSubmitted");
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalled();
      expect(mockPush.mock.calls[0][0]).toContain("/weekly-question/q-123?t=");
    });
  });
});

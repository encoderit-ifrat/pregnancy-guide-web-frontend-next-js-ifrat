import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "../SignUpForm";
import React from "react";
import { useSignUp } from "../../_api/mutations/useSignUp";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

// Mocks
jest.mock("../../_api/mutations/useSignUp");
jest.mock("sonner");
jest.mock("@/hooks/useTranslation");

// Mock child components
jest.mock("@/components/base/PasswordInput", () => ({
  PasswordInput: ({ label, name, onChange, value, placeholder }: any) => (
    <div>
      <label>{label}</label>
      <input data-testid={`input-${name}`} name={name} onChange={onChange} value={value} placeholder={placeholder} />
    </div>
  ),
}));

jest.mock("@/components/ui/Input", () => ({
  Input: ({ label, name, onChange, value, placeholder }: any) => (
    <div>
      <label>{label}</label>
      <input data-testid={`input-${name}`} name={name} onChange={onChange} value={value} placeholder={placeholder} />
    </div>
  ),
}));

jest.mock("@/components/ui/Checkbox", () => ({
  CheckBox: ({ checked, onCheckedChange }: any) => (
    <input
      type="checkbox"
      data-testid="checkbox-terms"
      checked={checked ?? false}
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
  ),
}));

describe("SignUpForm (RegisterForm) Component", () => {
  const mockMutate = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSignUp as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
  });

  it("renders all form fields", () => {
    render(<RegisterForm />);
    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-email")).toBeInTheDocument();
    expect(screen.getByTestId("input-password")).toBeInTheDocument();
    expect(screen.getByTestId("input-confirmPassword")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-terms")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /signUp.signUpButton/i })).toBeInTheDocument();
  });

  it("shows validation errors for invalid input", async () => {
    render(<RegisterForm />);
    
    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: /signUp.signUpButton/i }));

    expect(await screen.findByText("Name can only contain letters and spaces")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
    // expect(screen.getByText("You must accept the terms and conditions")).toBeInTheDocument();
  });

  it("calls useSignUp mutation on valid submit", async () => {
    render(<RegisterForm />);
    
    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByTestId("input-email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByTestId("input-password"), { target: { value: "Password1!" } });
    fireEvent.change(screen.getByTestId("input-confirmPassword"), { target: { value: "Password1!" } });
    fireEvent.click(screen.getByTestId("checkbox-terms"));
    
    fireEvent.click(screen.getByRole("button", { name: /signUp.signUpButton/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          name: "John Doe",
          email: "john@example.com",
          password: "Password1!",
          confirm_password: "Password1!",
        },
        expect.any(Object)
      );
    });
  });

  it("handles successful registration", async () => {
    mockMutate.mockImplementation((data, options) => {
      options.onSuccess({
        data: { data: { message: "Success!" } }
      });
    });

    render(<RegisterForm />);
    
    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByTestId("input-email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByTestId("input-password"), { target: { value: "Password1!" } });
    fireEvent.change(screen.getByTestId("input-confirmPassword"), { target: { value: "Password1!" } });
    fireEvent.click(screen.getByTestId("checkbox-terms"));
    fireEvent.click(screen.getByRole("button", { name: /signUp.signUpButton/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Success!");
    });
  });

  it("handles registration failure", async () => {
    mockMutate.mockImplementation((data, options) => {
      options.onError({
        response: { data: { message: "Error!" } }
      });
    });

    render(<RegisterForm />);
    
    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByTestId("input-email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByTestId("input-password"), { target: { value: "Password1!" } });
    fireEvent.change(screen.getByTestId("input-confirmPassword"), { target: { value: "Password1!" } });
    fireEvent.click(screen.getByTestId("checkbox-terms"));
    fireEvent.click(screen.getByRole("button", { name: /signUp.signUpButton/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error!");
    });
  });

  it("disables button when mutation is pending", () => {
    (useSignUp as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<RegisterForm />);
    const submitButton = screen.getByRole("button");
    expect(submitButton).toBeDisabled();
  });
});

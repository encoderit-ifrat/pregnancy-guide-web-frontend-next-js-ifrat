import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChangePasswordForm from "../ChangePasswordForm";
import React from "react";
import { useResetPassword } from "../../_api/mutations/useResetPassword";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

// Mocks
jest.mock("../../_api/mutations/useResetPassword");
jest.mock("next/navigation");
jest.mock("sonner");
jest.mock("@/hooks/useTranslation");

// Mock PasswordInput since it's a child component that might have its own logic
jest.mock("@/components/base/PasswordInput", () => ({
  PasswordInput: ({ label, name, onChange, value }: any) => (
    <div>
      <label>{label}</label>
      <input data-testid={`input-${name}`} name={name} onChange={onChange} value={value} />
    </div>
  ),
}));

describe("ChangePasswordForm Component", () => {
  const mockMutate = jest.fn();
  const mockPush = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useResetPassword as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });

    // Mock URLSearchParams
    jest.spyOn(URLSearchParams.prototype, "get").mockReturnValue("test-token");
  });

  it("renders the form when token is present", async () => {
    render(<ChangePasswordForm />);
    expect(await screen.findByTestId("input-password")).toBeInTheDocument();
    expect(screen.getByTestId("input-confirmPassword")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /auth.changePassword.submit/i })).toBeInTheDocument();
  });

  it("redirects if token is missing", async () => {
    (URLSearchParams.prototype.get as jest.Mock).mockReturnValue(null);
    render(<ChangePasswordForm />);
    
    expect(toast.error).toHaveBeenCalledWith("auth.resetPassword.invalidLink");
    expect(mockPush).toHaveBeenCalledWith("/forgot-password");
  });

  it("shows validation error for short password", async () => {
    render(<ChangePasswordForm />);
    const passwordInput = await screen.findByTestId("input-password");
    const submitButton = screen.getByRole("button", { name: /auth.changePassword.submit/i });

    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
    });
  });

  it("calls resetPassword mutation on valid submit", async () => {
    render(<ChangePasswordForm />);
    
    fireEvent.change(await screen.findByTestId("input-password"), { target: { value: "Password1!" } });
    fireEvent.change(screen.getByTestId("input-confirmPassword"), { target: { value: "Password1!" } });
    
    fireEvent.click(screen.getByRole("button", { name: /auth.changePassword.submit/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "test-token",
          password: "Password1!",
          confirm_password: "Password1!",
        }),
        expect.any(Object)
      );
    });
  });

  it("handles successful mutation", async () => {
    // Simulate successful mutation callback
    mockMutate.mockImplementation((data, options) => {
      options.onSuccess();
    });

    render(<ChangePasswordForm />);
    
    fireEvent.change(await screen.findByTestId("input-password"), { target: { value: "Password1!" } });
    fireEvent.change(screen.getByTestId("input-confirmPassword"), { target: { value: "Password1!" } });
    fireEvent.click(screen.getByRole("button", { name: /auth.changePassword.submit/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("auth.resetPassword.success");
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("disables button when pending", async () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<ChangePasswordForm />);
    const submitButton = await screen.findByRole("button");
    expect(submitButton).toBeDisabled();
  });
});

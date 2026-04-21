import { render, screen, waitFor } from "@testing-library/react";
import VerifyEmail from "../page";
import React from "react";
import { useVerifyEmail } from "../_api/mutations/useVerifyEmail";

// Mocks
jest.mock("../_api/mutations/useVerifyEmail");

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  CheckCircle: () => <div data-testid="icon-success" />,
  XCircle: () => <div data-testid="icon-error" />,
  Loader2: () => <div data-testid="icon-loading" />,
}));

describe("VerifyEmail Page", () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useVerifyEmail as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    });

    // Mock URLSearchParams
    jest.spyOn(URLSearchParams.prototype, "get").mockReturnValue("verify-token");
  });

  it("shows verifying state initially and calls mutate", () => {
    render(<VerifyEmail />);
    expect(screen.getByText("Verifying Your Email")).toBeInTheDocument();
    expect(screen.getByTestId("icon-loading")).toBeInTheDocument();
    expect(mockMutate).toHaveBeenCalledWith(
      { token: "verify-token" },
      expect.any(Object)
    );
  });

  it("shows success state on successful verification", async () => {
    mockMutate.mockImplementation((data, options) => {
      options.onSuccess();
    });

    render(<VerifyEmail />);
    
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Email Verified!" })).toBeInTheDocument();
      expect(screen.getByTestId("icon-success")).toBeInTheDocument();
      expect(screen.getByText("Email verified successfully!")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Go to Login/i })).toHaveAttribute("href", "/login");
    });
  });

  it("shows error state on failed verification", async () => {
    mockMutate.mockImplementation((data, options) => {
      options.onError();
    });

    render(<VerifyEmail />);
    
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Verification Failed" })).toBeInTheDocument();
      expect(screen.getByTestId("icon-error")).toBeInTheDocument();
      expect(screen.getByText(/An error occurred during verification/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Resend Verification Email/i })).toHaveAttribute("href", "/resend-verify-email");
    });
  });

  it("shows error if token is missing", async () => {
    (URLSearchParams.prototype.get as jest.Mock).mockReturnValue(null);
    render(<VerifyEmail />);
    
    expect(screen.getByText("Verification Failed")).toBeInTheDocument();
    expect(screen.getByText("No verification token found in URL")).toBeInTheDocument();
  });
});

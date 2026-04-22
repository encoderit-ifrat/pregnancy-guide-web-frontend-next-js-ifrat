import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../LoginForm";
import React from "react";
import { useLogin } from "../../_api/mutations/useLogin";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

// Mocks
jest.mock("../../_api/mutations/useLogin");
jest.mock("next-auth/react");
jest.mock("next/navigation");
jest.mock("@/hooks/useCurrentUser");
jest.mock("sonner");
jest.mock("@/hooks/useTranslation");

const mockLocation = {
  _href: "http://localhost/",
  get href() {
    return this._href;
  },
  set href(v: string) {
    if (v.startsWith("/")) {
      this._href = "http://localhost" + v;
    } else {
      this._href = v;
    }
  },
};
// @ts-expect-error - mock window.location
delete window.location;
// @ts-expect-error - mock window.location
window.location = mockLocation;

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
      data-testid="checkbox-remember"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
  ),
}));

describe("LoginForm Component", () => {
  const mockMutate = jest.fn();
  const mockUpdate = jest.fn();
  const mockRefetch = jest.fn();
  const mockPush = jest.fn();
  const mockLocationHref = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLogin as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useSession as jest.Mock).mockReturnValue({
      update: mockUpdate,
    });
    (useCurrentUser as jest.Mock).mockReturnValue({
      refetch: mockRefetch,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });

    mockUpdate.mockResolvedValue({});
    mockRefetch.mockResolvedValue({});

    // Reset mock location
    mockLocation._href = "http://localhost/";
  });

  it("renders login form elements", () => {
    render(<LoginForm />);
    expect(screen.getByTestId("input-email")).toBeInTheDocument();
    expect(screen.getByTestId("input-password")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-remember")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login.loginButton/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole("button", { name: /login.loginButton/i }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("calls login mutation on valid submit", async () => {
    render(<LoginForm />);
    
    fireEvent.change(screen.getByTestId("input-email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByTestId("input-password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByTestId("checkbox-remember"));
    
    fireEvent.click(screen.getByRole("button", { name: /login.loginButton/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          email: "test@example.com",
          password: "password123",
          remember: true,
        },
        expect.any(Object)
      );
    });
  });

  it("completes full login flow on success", async () => {
    const mockAccessToken = "fake-access-token";
    mockMutate.mockImplementation((data, options) => {
      options.onSuccess({
        data: { data: { access_token: mockAccessToken } },
      });
    });

    (signIn as jest.Mock).mockResolvedValue({ ok: true, error: null });

    render(<LoginForm />);
    
    fireEvent.change(screen.getByTestId("input-email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByTestId("input-password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /login.loginButton/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        token: mockAccessToken,
        callbackUrl: "/pregnancy-overview",
      });
    });

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("login.loggedInSuccess");
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("login.loggedInSuccess");
    });
  });

  it("handles mutation error", async () => {
    mockMutate.mockImplementation((data, options) => {
      options.onError(new Error("Login failed"));
    });

    render(<LoginForm />);
    
    fireEvent.change(screen.getByTestId("input-email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByTestId("input-password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /login.loginButton/i }));

    await waitFor(() => {
      // The component sets loading to false on error
      const button = screen.getByRole("button", { name: /login.loginButton/i });
      expect(button).not.toBeDisabled();
    });
  });

  it("handles signIn error", async () => {
    mockMutate.mockImplementation((data, options) => {
      options.onSuccess({
        data: { data: { access_token: "token" } },
      });
    });

    (signIn as jest.Mock).mockResolvedValue({ ok: false, error: "Invalid credentials" });

    render(<LoginForm />);
    
    fireEvent.change(screen.getByTestId("input-email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByTestId("input-password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /login.loginButton/i }));

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /login.loginButton/i });
      expect(button).not.toBeDisabled();
      expect(toast.success).not.toHaveBeenCalled();
    });
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../page";

// ─── Mocks ───────────────────────────────────────────────────────────────────

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated", update: jest.fn() }),
  signIn: jest.fn(),
}));

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the useTranslation hook — returns the key as-is for testing
jest.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the useCurrentUser hook
jest.mock("@/hooks/useCurrentUser", () => ({
  useCurrentUser: () => ({
    refetch: jest.fn(),
  }),
}));

// Mock the useLogin mutation
jest.mock("../_api/mutations/useLogin", () => ({
  useLogin: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("LoginPage", () => {
  it("renders the login page without crashing", () => {
    render(<LoginPage />);

    // The AuthCard title uses t("login.title") — our mock returns the key
    expect(screen.getByText("login.title")).toBeInTheDocument();
  });

  it("renders email and password input fields", () => {
    render(<LoginPage />);

    // Inputs are rendered with translated placeholder keys
    expect(screen.getByPlaceholderText("login.emailPlaceholder")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("login.passwordPlaceholder")).toBeInTheDocument();
  });

  it("renders the login button", () => {
    render(<LoginPage />);

    expect(screen.getByText("login.loginButton")).toBeInTheDocument();
  });

  it("renders the 'forgot password' and 'sign up' links", () => {
    render(<LoginPage />);

    // Forgot password link
    const forgotLink = screen.getByText("login.forgotPassword");
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink.closest("a")).toHaveAttribute("href", "/forgot-password");

    // Sign up link
    const signUpLink = screen.getByText("login.createAccount");
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink.closest("a")).toHaveAttribute("href", "/sign-up");
  });

  it("allows the user to type into email and password fields", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("login.emailPlaceholder");
    const passwordInput = screen.getByPlaceholderText("login.passwordPlaceholder");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });
});

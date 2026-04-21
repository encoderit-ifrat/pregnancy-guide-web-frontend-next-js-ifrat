import { LoginSchema } from "../login_types";

describe("LoginSchema", () => {
  it("should validate correct email and password", () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
      acceptTerms: true,
    };
    const result = LoginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should fail on invalid email format", () => {
    const invalidData = {
      email: "not-an-email",
      password: "password123",
    };
    const result = LoginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Please enter a valid email address");
    }
  });

  it("should fail on empty email", () => {
    const invalidData = {
      email: "",
      password: "password123",
    };
    const result = LoginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Email is required");
    }
  });

  it("should fail on empty password", () => {
    const invalidData = {
      email: "test@example.com",
      password: "",
    };
    const result = LoginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Password is required");
    }
  });

  it("should work with optional acceptTerms", () => {
    const data = {
      email: "test@example.com",
      password: "password123",
    };
    const result = LoginSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

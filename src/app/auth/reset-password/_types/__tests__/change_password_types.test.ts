import { ResetPasswordSchema } from "../change_password_types";

describe("ResetPasswordSchema", () => {
  const validData = {
    password: "Password1!",
    confirmPassword: "Password1!",
  };

  it("should validate a correct password and confirmPassword", () => {
    const result = ResetPasswordSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should fail if password is too short", () => {
    const result = ResetPasswordSchema.safeParse({
      ...validData,
      password: "Pass1!",
      confirmPassword: "Pass1!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map(i => i.message);
      expect(messages).toContain("Password must be at least 8 characters");
    }
  });

  it("should fail if password lacks uppercase letter", () => {
    const result = ResetPasswordSchema.safeParse({
      ...validData,
      password: "password1!",
      confirmPassword: "password1!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Password must contain at least one uppercase letter");
    }
  });

  it("should fail if password lacks lowercase letter", () => {
    const result = ResetPasswordSchema.safeParse({
      ...validData,
      password: "PASSWORD1!",
      confirmPassword: "PASSWORD1!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Password must contain at least one lowercase letter");
    }
  });

  it("should fail if password lacks number", () => {
    const result = ResetPasswordSchema.safeParse({
      ...validData,
      password: "Password!",
      confirmPassword: "Password!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Password must contain at least one number");
    }
  });

  it("should fail if password lacks special character", () => {
    const result = ResetPasswordSchema.safeParse({
      ...validData,
      password: "Password1",
      confirmPassword: "Password1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Password must contain at least one special character");
    }
  });

  it("should fail if confirmPassword does not match", () => {
    const result = ResetPasswordSchema.safeParse({
      ...validData,
      confirmPassword: "Different1!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Passwords do not match");
    }
  });
});

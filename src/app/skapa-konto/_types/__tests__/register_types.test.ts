import { RegisterSchema } from "../register_types";

describe("RegisterSchema", () => {
  const validData = {
    name: "John Doe",
    email: "john@example.com",
    password: "Password1!",
    confirmPassword: "Password1!",
    acceptTerms: true,
  };

  it("should validate correct registration data", () => {
    const result = RegisterSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe("name validation", () => {
    it("should fail if name is too short", () => {
      const result = RegisterSchema.safeParse({ ...validData, name: "J" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Name must be at least 2 characters");
      }
    });

    it("should fail if name contains numbers", () => {
      const result = RegisterSchema.safeParse({ ...validData, name: "John123" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Name can only contain letters and spaces");
      }
    });
  });

  describe("password validation", () => {
    it("should fail if password is too short", () => {
      const result = RegisterSchema.safeParse({
        ...validData,
        password: "Short1!",
        confirmPassword: "Short1!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password must be at least 8 characters");
      }
    });

    it("should fail if password lacks uppercase", () => {
      const result = RegisterSchema.safeParse({
        ...validData,
        password: "password1!",
        confirmPassword: "password1!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password must contain at least one uppercase letter");
      }
    });

    it("should fail if passwords do not match", () => {
      const result = RegisterSchema.safeParse({
        ...validData,
        confirmPassword: "Different1!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords do not match");
      }
    });
  });

  it("should fail if terms are not accepted", () => {
    const result = RegisterSchema.safeParse({
      ...validData,
      acceptTerms: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("You must accept the terms and conditions");
    }
  });
});

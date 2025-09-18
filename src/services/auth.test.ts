import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import { setupMemoryMongo, teardownMemoryMongo } from "@/test/mongoTest";
import { registerUser, loginUser } from "@/services/auth";
import { connectMongo } from "@/lib/mongo";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

describe("Auth Service", () => {
  beforeAll(setupMemoryMongo);
  afterAll(teardownMemoryMongo);

  beforeEach(async () => {
    await connectMongo();
    await User.deleteMany({});
  });

  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      const user = await registerUser("test@example.com", "password123", "Test User");
      
      expect(user.email).toBe("test@example.com");
      expect(user.name).toBe("Test User");
      expect(user.id).toBeDefined();
      
      // Verify user was saved to database
      const savedUser = await User.findById(user.id);
      expect(savedUser).toBeTruthy();
      expect(savedUser?.email).toBe("test@example.com");
    });

    it("should hash the password correctly", async () => {
      const user = await registerUser("test@example.com", "password123", "Test User");
      
      const savedUser = await User.findById(user.id);
      expect(savedUser?.passwordHash).toBeDefined();
      expect(savedUser?.passwordHash).not.toBe("password123");
      
      // Verify password can be compared
      const isValid = await bcrypt.compare("password123", savedUser!.passwordHash);
      expect(isValid).toBe(true);
    });

    it("should throw error for duplicate email", async () => {
      await registerUser("duplicate@example.com", "password123", "First User");
      
      await expect(
        registerUser("duplicate@example.com", "different123", "Second User")
      ).rejects.toThrow("EMAIL_TAKEN");
    });

    it("should work without providing a name", async () => {
      const user = await registerUser("noname@example.com", "password123");
      
      expect(user.email).toBe("noname@example.com");
      expect(user.name).toBeUndefined();
    });
  });

  describe("loginUser", () => {
    beforeEach(async () => {
      await registerUser("login@example.com", "password123", "Login User");
    });

    it("should login with correct credentials", async () => {
      const user = await loginUser("login@example.com", "password123");
      
      expect(user.email).toBe("login@example.com");
      expect(user.name).toBe("Login User");
      expect(user.id).toBeDefined();
    });

    it("should throw error for non-existent email", async () => {
      await expect(
        loginUser("nonexistent@example.com", "password123")
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });

    it("should throw error for wrong password", async () => {
      await expect(
        loginUser("login@example.com", "wrongpassword")
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });

    it("should be case sensitive for email", async () => {
      await expect(
        loginUser("LOGIN@EXAMPLE.COM", "password123")
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });
  });
});

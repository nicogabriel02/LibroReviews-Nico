import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { setupMemoryMongo, teardownMemoryMongo } from "@/test/mongoTest";
import { registerUser, loginUser } from "@/services/auth";

describe("auth", () => {
  beforeAll(setupMemoryMongo);
  afterAll(teardownMemoryMongo);

  it("register + login", async () => {
    const u = await registerUser("a@b.com", "password123", "Nico");
    expect(u.email).toBe("a@b.com");
    const l = await loginUser("a@b.com", "password123");
    expect(l.id).toBeDefined();
  });
});

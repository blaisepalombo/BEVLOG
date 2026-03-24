const request = require("supertest");
const { createTestApp } = require("./helpers/testApp");
const { authHeaders } = require("./helpers/mockAuth");

describe("Auth routes", () => {
  const app = createTestApp();

  test("GET /auth/me returns 401 when logged out", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.user).toBeNull();
  });

  test("GET /auth/me returns user data when logged in", async () => {
    const response = await request(app).get("/auth/me").set(authHeaders());

    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe("user-123");
  });

  test("POST /auth/logout returns 200", async () => {
    const response = await request(app).post("/auth/logout").set(authHeaders());

    expect(response.status).toBe(200);
  });
});
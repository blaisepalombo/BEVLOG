const request = require("supertest");
const { createTestApp } = require("./helpers/testApp");
const { authHeaders } = require("./helpers/mockAuth");

jest.mock("../src/db/mongodb", () => ({
  getDb: jest.fn(),
}));

const { getDb } = require("../src/db/mongodb");

describe("Drink routes", () => {
  let app;
  let mockCursor;
  let mockAggregateCursor;
  let mockCollection;

  beforeEach(() => {
    app = createTestApp();

    mockCursor = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
    };

    mockAggregateCursor = {
      toArray: jest.fn(),
    };

    mockCollection = {
      find: jest.fn(() => mockCursor),
      countDocuments: jest.fn(),
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
      aggregate: jest.fn(() => mockAggregateCursor),
    };

    getDb.mockReturnValue({
      collection: jest.fn(() => mockCollection),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /drinks returns paginated drink data", async () => {
    mockCursor.toArray.mockResolvedValue([
      { _id: "1", brand: "Monster", drinkName: "Ultra" },
    ]);
    mockCollection.countDocuments.mockResolvedValue(1);

    const response = await request(app).get("/drinks?page=1&limit=10&sort=newest");

    expect(response.status).toBe(200);
    expect(response.body.pagination.total).toBe(1);
    expect(response.body.data).toHaveLength(1);
  });

  test("GET /drinks rejects invalid query params", async () => {
    const response = await request(app).get("/drinks?page=0");

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/page/i);
  });

  test("POST /drinks requires auth", async () => {
    const response = await request(app).post("/drinks").send({
      brand: "C4",
      drinkName: "Frozen Bombsicle",
      sizeOz: 16,
    });

    expect(response.status).toBe(401);
  });

  test("POST /drinks creates a drink for the logged-in user", async () => {
    mockCollection.insertOne.mockResolvedValue({ insertedId: "drink-1" });

    const response = await request(app)
      .post("/drinks")
      .set(authHeaders())
      .send({
        brand: "C4",
        drinkName: "Frozen Bombsicle",
        sizeOz: 16,
        caffeineMg: 200,
        sugarG: 0,
        rating: 8,
        notes: "Solid",
      });

    expect(response.status).toBe(201);
    expect(response.body.createdBy).toBe("user-123");
    expect(response.body.brand).toBe("C4");
  });

  test("PUT /drinks/:id blocks non-owners", async () => {
    mockCollection.findOne.mockResolvedValue({
      _id: "drink-1",
      createdBy: "someone-else",
    });

    const response = await request(app)
      .put("/drinks/drink-1")
      .set(authHeaders())
      .send({
        brand: "C4",
        drinkName: "Frozen Bombsicle",
        sizeOz: 16,
      });

    expect(response.status).toBe(403);
  });

  test("DELETE /drinks/:id deletes owner records", async () => {
    mockCollection.findOne.mockResolvedValue({
      _id: "drink-1",
      createdBy: "user-123",
    });
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const response = await request(app)
      .delete("/drinks/drink-1")
      .set(authHeaders());

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/deleted/i);
  });

  test("GET /drinks/stats returns aggregate stats", async () => {
    mockAggregateCursor.toArray.mockResolvedValue([
      {
        overview: [
          {
            totalDrinks: 2,
            averageCaffeineMg: 175,
            averageSugarG: 10,
            averageRating: 8,
            newestEntryAt: "2026-03-01T00:00:00.000Z",
          },
        ],
        topBrands: [{ brand: "Monster", count: 2 }],
        topRated: [{ _id: "1", brand: "Monster", drinkName: "Ultra", rating: 9 }],
      },
    ]);

    const response = await request(app).get("/drinks/stats");

    expect(response.status).toBe(200);
    expect(response.body.overview.totalDrinks).toBe(2);
    expect(response.body.topBrands[0].brand).toBe("Monster");
  });
});
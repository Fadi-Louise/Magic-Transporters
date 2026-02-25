import request from "supertest";
import app from "../src/app";
import { connectTestDB, closeTestDB, clearTestDB } from "./setup";

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("Magic Items API", () => {
  describe("POST /api/items", () => {
    it("should create a new magic item", async () => {
      const res = await request(app)
        .post("/api/items")
        .send({ name: "Golden Amulet", weight: 5 });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Golden Amulet");
      expect(res.body.weight).toBe(5);
    });

    it("should return 400 if name is missing", async () => {
      const res = await request(app)
        .post("/api/items")
        .send({ weight: 5 });

      expect(res.status).toBe(400);
    });

    it("should return 400 if weight is missing", async () => {
      const res = await request(app)
        .post("/api/items")
        .send({ name: "Amulet" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/items", () => {
    it("should return all magic items", async () => {
      await request(app).post("/api/items").send({ name: "Item1", weight: 3 });
      await request(app).post("/api/items").send({ name: "Item2", weight: 7 });

      const res = await request(app).get("/api/items");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe("GET /api/items/:id", () => {
    it("should return a magic item by ID", async () => {
      const created = await request(app)
        .post("/api/items")
        .send({ name: "Crystal Orb", weight: 10 });

      const res = await request(app).get(`/api/items/${created.body._id}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Crystal Orb");
    });

    it("should return 404 for non-existent item", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(app).get(`/api/items/${fakeId}`);

      expect(res.status).toBe(404);
    });
  });
});

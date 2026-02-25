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

/** Helper to create a mover */
async function createMover(name = "Mover1", weightLimit = 100) {
  const res = await request(app)
    .post("/api/movers")
    .send({ name, weightLimit });
  return res.body;
}

/** Helper to create an item */
async function createItem(name = "Item1", weight = 10) {
  const res = await request(app)
    .post("/api/items")
    .send({ name, weight });
  return res.body;
}

describe("Magic Movers API", () => {
  describe("POST /api/movers", () => {
    it("should create a new magic mover", async () => {
      const res = await request(app)
        .post("/api/movers")
        .send({ name: "Swift Carrier", weightLimit: 50 });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Swift Carrier");
      expect(res.body.weightLimit).toBe(50);
      expect(res.body.questState).toBe("resting");
    });

    it("should return 400 if name is missing", async () => {
      const res = await request(app)
        .post("/api/movers")
        .send({ weightLimit: 50 });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/movers", () => {
    it("should return all magic movers", async () => {
      await createMover("Mover1");
      await createMover("Mover2");

      const res = await request(app).get("/api/movers");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe("POST /api/movers/:id/load", () => {
    it("should load an item onto a mover", async () => {
      const mover = await createMover("Loader", 100);
      const item = await createItem("Gem", 20);

      const res = await request(app)
        .post(`/api/movers/${mover._id}/load`)
        .send({ itemId: item._id });

      expect(res.status).toBe(200);
      expect(res.body.questState).toBe("loading");
      expect(res.body.items).toHaveLength(1);
    });

    it("should return 400 when weight limit exceeded", async () => {
      const mover = await createMover("Small", 5);
      const item = await createItem("Heavy", 10);

      const res = await request(app)
        .post(`/api/movers/${mover._id}/load`)
        .send({ itemId: item._id });

      expect(res.status).toBe(400);
    });

    it("should return 400 when mover is on-mission", async () => {
      const mover = await createMover("Busy", 100);
      const item1 = await createItem("Item1", 10);
      const item2 = await createItem("Item2", 10);

      // Load and start mission
      await request(app)
        .post(`/api/movers/${mover._id}/load`)
        .send({ itemId: item1._id });
      await request(app).put(`/api/movers/${mover._id}/start-mission`);

      // Try to load more
      const res = await request(app)
        .post(`/api/movers/${mover._id}/load`)
        .send({ itemId: item2._id });

      expect(res.status).toBe(400);
    });

    it("should return 400 if itemId is missing", async () => {
      const mover = await createMover();
      const res = await request(app)
        .post(`/api/movers/${mover._id}/load`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/movers/:id/start-mission", () => {
    it("should start a mission", async () => {
      const mover = await createMover("Runner", 100);
      const item = await createItem("Cargo", 30);

      await request(app)
        .post(`/api/movers/${mover._id}/load`)
        .send({ itemId: item._id });

      const res = await request(app).put(
        `/api/movers/${mover._id}/start-mission`
      );

      expect(res.status).toBe(200);
      expect(res.body.questState).toBe("on-mission");
    });

    it("should return 400 if no items loaded", async () => {
      const mover = await createMover("Empty", 100);

      const res = await request(app).put(
        `/api/movers/${mover._id}/start-mission`
      );

      expect(res.status).toBe(400);
    });

    it("should return 400 if already on mission", async () => {
      const mover = await createMover("Runner", 100);
      const item = await createItem("Cargo", 30);

      await request(app)
        .post(`/api/movers/${mover._id}/load`)
        .send({ itemId: item._id });
      await request(app).put(`/api/movers/${mover._id}/start-mission`);

      const res = await request(app).put(
        `/api/movers/${mover._id}/start-mission`
      );

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/movers/:id/end-mission", () => {
    it("should end a mission, unload items, and increment missions completed", async () => {
      const mover = await createMover("Finisher", 100);
      const item = await createItem("Package", 20);

      await request(app)
        .post(`/api/movers/${mover._id}/load`)
        .send({ itemId: item._id });
      await request(app).put(`/api/movers/${mover._id}/start-mission`);

      const res = await request(app).put(
        `/api/movers/${mover._id}/end-mission`
      );

      expect(res.status).toBe(200);
      expect(res.body.questState).toBe("resting");
      expect(res.body.items).toHaveLength(0);
      expect(res.body.missionsCompleted).toBe(1);
    });

    it("should return 400 if not on a mission", async () => {
      const mover = await createMover("Idle", 100);

      const res = await request(app).put(
        `/api/movers/${mover._id}/end-mission`
      );

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/movers/leaderboard", () => {
    it("should return movers sorted by missions completed descending", async () => {
      // Create 3 movers and have them complete different numbers of missions
      const mover1 = await createMover("Alpha", 100);
      const mover2 = await createMover("Beta", 100);
      const mover3 = await createMover("Gamma", 100);

      const item1 = await createItem("A", 10);
      const item2 = await createItem("B", 10);
      const item3 = await createItem("C", 10);

      // Mover1: 2 missions
      await request(app)
        .post(`/api/movers/${mover1._id}/load`)
        .send({ itemId: item1._id });
      await request(app).put(`/api/movers/${mover1._id}/start-mission`);
      await request(app).put(`/api/movers/${mover1._id}/end-mission`);

      await request(app)
        .post(`/api/movers/${mover1._id}/load`)
        .send({ itemId: item1._id });
      await request(app).put(`/api/movers/${mover1._id}/start-mission`);
      await request(app).put(`/api/movers/${mover1._id}/end-mission`);

      // Mover2: 1 mission
      await request(app)
        .post(`/api/movers/${mover2._id}/load`)
        .send({ itemId: item2._id });
      await request(app).put(`/api/movers/${mover2._id}/start-mission`);
      await request(app).put(`/api/movers/${mover2._id}/end-mission`);

      // Mover3: 0 missions

      const res = await request(app).get("/api/movers/leaderboard");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].name).toBe("Alpha");
      expect(res.body[0].missionsCompleted).toBe(2);
      expect(res.body[1].name).toBe("Beta");
      expect(res.body[1].missionsCompleted).toBe(1);
      expect(res.body[2].name).toBe("Gamma");
      expect(res.body[2].missionsCompleted).toBe(0);
    });
  });
});

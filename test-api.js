/**
 * Quick test script to demonstrate the full API flow.
 * Run with: node test-api.js
 */
const BASE = "http://localhost:3000/api";

async function post(url, body) {
  const res = await fetch(`${BASE}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function put(url) {
  const res = await fetch(`${BASE}${url}`, { method: "PUT" });
  return res.json();
}

async function get(url) {
  const res = await fetch(`${BASE}${url}`);
  return res.json();
}

async function run() {
  console.log("=== 1. Create Magic Items ===");
  const item1 = await post("/items", { name: "Golden Amulet", weight: 5 });
  console.log("Created:", item1.name, "| ID:", item1._id);

  const item2 = await post("/items", { name: "Crystal Orb", weight: 15 });
  console.log("Created:", item2.name, "| ID:", item2._id);

  console.log("\n=== 2. Create Magic Movers ===");
  const mover1 = await post("/movers", { name: "Swift Carrier", weightLimit: 100 });
  console.log("Created:", mover1.name, "| ID:", mover1._id);

  const mover2 = await post("/movers", { name: "Heavy Lifter", weightLimit: 50 });
  console.log("Created:", mover2.name, "| ID:", mover2._id);

  console.log("\n=== 3. Load items onto Swift Carrier ===");
  const loaded1 = await post(`/movers/${mover1._id}/load`, { itemId: item1._id });
  console.log("Loaded", item1.name, "-> State:", loaded1.questState);

  const loaded2 = await post(`/movers/${mover1._id}/load`, { itemId: item2._id });
  console.log("Loaded", item2.name, "-> State:", loaded2.questState, "| Items:", loaded2.items.length);

  console.log("\n=== 4. Start Mission for Swift Carrier ===");
  const started = await put(`/movers/${mover1._id}/start-mission`);
  console.log("State:", started.questState);

  console.log("\n=== 5. Try loading while on mission (should fail) ===");
  const fail = await post(`/movers/${mover1._id}/load`, { itemId: item1._id });
  console.log("Result:", fail.error);

  console.log("\n=== 6. End Mission for Swift Carrier ===");
  const ended = await put(`/movers/${mover1._id}/end-mission`);
  console.log("State:", ended.questState, "| Items:", ended.items.length, "| Missions:", ended.missionsCompleted);

  console.log("\n=== 7. Do a mission with Heavy Lifter too ===");
  await post(`/movers/${mover2._id}/load`, { itemId: item1._id });
  await put(`/movers/${mover2._id}/start-mission`);
  await put(`/movers/${mover2._id}/end-mission`);

  // Do a second mission for Swift Carrier
  await post(`/movers/${mover1._id}/load`, { itemId: item1._id });
  await put(`/movers/${mover1._id}/start-mission`);
  await put(`/movers/${mover1._id}/end-mission`);

  console.log("\n=== 8. Leaderboard (most missions first) ===");
  const leaderboard = await get("/movers/leaderboard");
  leaderboard.forEach((m, i) => {
    console.log(`#${i + 1} ${m.name} - ${m.missionsCompleted} missions`);
  });

  console.log("\n✅ All done!");
}

run().catch(console.error);

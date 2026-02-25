import mongoose from "mongoose";

const TEST_DB_URI = "mongodb://localhost:27017/magic-transporters-test";

/**
 * Connect to a dedicated test database on your local MongoDB.
 */
export async function connectTestDB(): Promise<void> {
  await mongoose.connect(TEST_DB_URI);
}

/**
 * Drop the test database, then close the connection.
 */
export async function closeTestDB(): Promise<void> {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}

/**
 * Clear all collections between tests.
 */
export async function clearTestDB(): Promise<void> {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

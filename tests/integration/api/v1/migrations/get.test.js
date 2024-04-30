import database from "infra/database.js";

beforeAll(clearDatabase)

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("GET to /api/v1/migrations should returns 200", async () => {
  const response = await fetch("http://localhost:3001/api/v1/migrations")
  const responseBody = await response.json();
  expect(response.status).toBe(200)
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
})

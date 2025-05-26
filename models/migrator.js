import { resolve } from "node:path";
import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";

async function getOptionsMigrations(dbClient, dryRun = false) {
  const defaultMigrationsOptions = {
    dbClient: dbClient,
    dryRun: dryRun,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  return defaultMigrationsOptions;
}

async function listPendingMigrations() {
  let dbClient = await database.getNewClient();
  try {
    const pendingMigrations = await migrationRunner(
      await getOptionsMigrations(dbClient, true),
    );
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient = await database.getNewClient();
  try {
    const migratedMigrations = await migrationRunner(
      await getOptionsMigrations(dbClient),
    );
    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;

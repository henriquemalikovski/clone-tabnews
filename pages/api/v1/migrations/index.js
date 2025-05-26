import { createRouter } from "next-connect";
import { resolve } from "node:path";
import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler).post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  let dbClient = await database.getNewClient();
  try {
    const pendingMigrations = await migrationRunner(
      await getOptionsMigrations(dbClient, true),
    );
    return res.status(200).json(pendingMigrations);
  } finally {
    await dbClient?.end();
  }
}

async function postHandler(req, res) {
  let dbClient = await database.getNewClient();
  try {
    const migratedMigrations = await migrationRunner(
      await getOptionsMigrations(dbClient),
    );

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations);
    }

    return res.status(200).json(migratedMigrations);
  } finally {
    await dbClient?.end();
  }
}

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

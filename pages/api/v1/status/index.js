import database from "infra/database.js";

async function status(req, res) {
  const updatedAt = new Date().toISOString();

  const queryVersion = await database.query("SHOW server_version;");
  const version = queryVersion.rows[0].server_version;

  const queryMaxConnections = await database.query("SHOW max_connections;");
  const maxConnections = parseInt(queryMaxConnections.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const queryCurrentConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const currentConnections = queryCurrentConnections.rows[0].count;
  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: version,
        max_connections: maxConnections,
        current_connections: currentConnections,
      },
    },
  });
}

export default status;

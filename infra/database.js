import { Client } from "pg"

async function query(queryObject) {
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD
  })
  await client.connect()
  const result = await client.query(queryObject)
  await client.end()
  return result
}

export default {
  query: query
}
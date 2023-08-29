require("dotenv").config({ path: ".env" })
import { db } from "../lib/db"
import { sql } from "kysely"

async function main() {
  const counts = await db
    .selectFrom("article")
    .innerJoin("source", "article.source_id", "source.id")
    .groupBy(["source_id", "source.title"])
    .orderBy(sql`count(*)`, "desc")
    .select(["source.title", sql`count(*)`.as("count")])
    .limit(100)
    .execute()

  console.log(counts)
  await db.destroy()
  console.log("Done!")
  process.exit(0)
}

main()

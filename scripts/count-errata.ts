require("dotenv").config({ path: ".env" })
import { db } from "../lib/db"
import { sql } from "kysely"

async function main() {
  const counts = await db
    .selectFrom("article")
    .where(
      (eb) =>
        eb.or([
          eb("title", "ilike", "%CORRIGENDUM%"),
          eb("title", "ilike", "%ERRATUM%"),
          eb("title", "ilike", "%RETRACTION%"),
        ])
      // Note: ilike is case-insensitive
    )
    .select([sql`count(*)`.as("count")])
    .execute()

  console.log(counts)
  await db.destroy()
  console.log("Done!")
  process.exit(0)
}

main()

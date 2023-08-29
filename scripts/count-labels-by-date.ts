require("dotenv").config({ path: ".env" })
import { db } from "../lib/db"
import { sql } from "kysely"

async function main() {
  const articles = await db
    .selectFrom("article")
    .where("topic_id", "is not", null)
    .groupBy(sql`DATE(labelled_at)`)
    .orderBy(sql`DATE(labelled_at)`, "desc")
    .select([sql`DATE(labelled_at)`.as("date"), sql`count(*)`.as("count")])
    .limit(100)
    .execute()

  console.log(
    articles.map((x) => ({
      ...x,
      date: (x.date as Date).toISOString(),
    }))
  )
  await db.destroy()
  console.log("Done!")
  process.exit(0)
}

main()

require("dotenv").config({ path: ".env" })
import { db } from "../lib/db"
import { sql } from "kysely"

const SINCE_DATE = new Date("2022-08-28")

async function main() {
  const counts = await db
    .selectFrom("article")
    .innerJoin("source", "article.source_id", "source.id")
    .where("date", ">", SINCE_DATE)
    .groupBy(["source_id", "source.title"])
    .orderBy(sql`count(*)`, "desc")
    .select(["source.title", sql`count(*)`.as("count")])
    .limit(100)
    .execute()

  const latestDateBySource = await db
    .selectFrom("article")
    .innerJoin("source", "article.source_id", "source.id")
    .groupBy(["source_id", "source.title"])
    .orderBy(sql`max(date)`, "desc")
    .select(["source.title", sql`max(date)`.as("date")])
    .execute()

  console.log(latestDateBySource.filter((x) => !x.date || x.date < SINCE_DATE))
  console.log(counts.map((x) => x.count + " articles: " + x.title).join("\n"))
  await db.destroy()
  console.log("Done!")
  process.exit(0)
}

main()

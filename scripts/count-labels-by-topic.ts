require("dotenv").config({ path: ".env" })
import { db } from "../lib/db"
import { sql } from "kysely"

async function main() {
  const articles = await db
    .selectFrom("article")
    .where("topic_id", "is not", null)
    .innerJoin("topic", "topic.id", "article.topic_id")
    .groupBy("topic.id")
    .groupBy("topic.title")
    .groupBy("topic.umbrella")
    .orderBy("topic.id")
    .where("labelled_at", ">", new Date("2023-09-01"))
    .select(["topic.umbrella", "topic.title", sql`count(*)`.as("count")])
    .limit(100)
    .execute()

  console.log(
    articles
      .sort((a, b) => (b.count as number) - (a.count as number))
      .map((x) => `${x.count}: ${x.umbrella} / ${x.title}`)
      .join("\n")
  )
  await db.destroy()
  console.log("Done!")
  process.exit(0)
}

main()

import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType("article_topic")
    .asEnum(["forests", "oceans"])
    .execute()

  await db.schema
    .createTable("article")
    .addColumn("id", "serial", (col) => col.primaryKey())
    // .addColumn("categories",
    .addColumn("content", "text")
    .addColumn("contentSnippet", "text")
    .addColumn("creator", "text")
    .addColumn("guid", "varchar")
    .addColumn("isoDate", "timestamptz")
    // link is unique:
    .addColumn("link", "varchar", (col) => col.unique())
    .addColumn("pubDate", "timestamptz")
    .addColumn("title", "varchar")
    .addColumn("summary", "text")
    .addColumn("source", "varchar", (col) => col.notNull())
    .addColumn("topic", sql`"article_topic"`, (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("article").execute()
  await db.schema.dropType("article_topic").execute()
}

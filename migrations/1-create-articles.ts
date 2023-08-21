import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType("topic_umbrella")
    .asEnum(["HASED", "IP", "Economy", "Health & Wellbeing", "Cross-cutting"])
    .execute()

  await db.schema
    .createTable("topic")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("umbrella", sql`"topic_umbrella"`, (col) => col.notNull())
    .addColumn("title", "varchar", (col) => col.unique().notNull())
    .addColumn("core", "boolean", (col) => col.notNull())
    .addColumn("notes", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute()

  await db.schema
    .createIndex("topic_umbrella_index")
    .on("topic")
    .column("umbrella")
    .execute()

  await db.schema
    .createTable("source")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "varchar", (col) => col.unique().notNull())
    .addColumn("type", "varchar")
    .addColumn("url_home", "varchar", (col) => col.unique().notNull())
    .addColumn("url_feed", "varchar", (col) => col.unique())
    .addColumn("url_rss", "varchar", (col) => col.unique())
    .addColumn("update_frequency", "varchar")
    .addColumn("last_checked", "timestamptz")
    .addColumn("last_pulled", "timestamptz")
    .addColumn("geo_region", "varchar")
    .addColumn("open_access", "boolean")
    .addColumn("notes", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
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
    .addColumn("link", "varchar", (col) => col.unique().notNull())
    .addColumn("pubDate", "timestamptz")
    .addColumn("title", "varchar")
    .addColumn("summary", "text")
    .addColumn("source_id", "integer", (col) =>
      col.references("source.id").onDelete("restrict").notNull()
    )
    .addColumn("topic_id", "integer", (col) =>
      col.references("topic.id").onDelete("restrict")
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute()

  await db.schema
    .createIndex("article_isoDate_index")
    .on("article")
    .column("isoDate")
    .execute()

  await db.schema
    .createIndex("article_source_id_index")
    .on("article")
    .column("source_id")
    .execute()

  await db.schema
    .createIndex("article_topic_id_index")
    .on("article")
    .column("topic_id")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("article_topic_id_index").execute()
  await db.schema.dropIndex("article_source_id_index").execute()
  await db.schema.dropIndex("article_isoDate_index").execute()
  await db.schema.dropTable("article").execute()
  await db.schema.dropTable("source").execute()
  await db.schema.dropIndex("topic_umbrella_index").execute()
  await db.schema.dropTable("topic").execute()
  await db.schema.dropType("topic_umbrella").execute()
}

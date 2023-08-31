import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("article_topic_zero_shot")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("article_id", "integer", (col) =>
      col.references("article.id").onDelete("restrict").unique().notNull()
    )
    .addColumn("topic_id", "integer", (col) =>
      col.references("topic.id").onDelete("restrict").notNull()
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute()

  await db.schema
    .createIndex("article_topic_zero_shot_article_id_index")
    .on("article_topic_zero_shot")
    .column("article_id")
    .execute()

  await db.schema
    .createIndex("article_topic_zero_shot_topic_id_index")
    .on("article_topic_zero_shot")
    .column("topic_id")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("article_topic_zero_shot_topic_id_index").execute()
  await db.schema
    .dropIndex("article_topic_zero_shot_article_id_index")
    .execute()
  await db.schema.dropTable("article_topic_zero_shot").execute()
}

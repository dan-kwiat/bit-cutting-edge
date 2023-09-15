import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("feedback")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("useful", "boolean", (col) => col.notNull())
    .addColumn("comments", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute()

  await db.schema
    .createIndex("feedback_useful_index")
    .on("feedback")
    .column("useful")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("feedback_useful_index").execute()
  await db.schema.dropTable("feedback").execute()
}

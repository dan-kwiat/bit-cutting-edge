import { Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex("article_link_index")
    .on("article")
    .column("link")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("article_link_index").execute()
}

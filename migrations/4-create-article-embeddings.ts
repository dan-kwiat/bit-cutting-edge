import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("article")
    .addColumn("embedding_title_desc", sql`real[]`, (col) => col.notNull())
    .execute()

  await sql`CREATE EXTENSION embedding;`.execute(db)

  // Create a cosine distance index (specified by `ann_cos_ops`)
  // Dims=1536 is for embeddings created with `text-embedding-ada-002`
  await sql`CREATE INDEX article_embedding_title_desc_index ON article USING hnsw(embedding_title_desc ann_cos_ops) WITH (dims=1536, m=64, efconstruction=128, efsearch=64);`.execute(
    db
  )
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP INDEX article_embedding_title_desc_index;`.execute(db)
  await sql`DROP EXTENSION embedding;`.execute(db)
  await db.schema
    .alterTable("article")
    .dropColumn("embedding_title_desc")
    .execute()
}

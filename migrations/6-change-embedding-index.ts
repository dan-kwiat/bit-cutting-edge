import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  // Create a Euclidean (L2) distance index
  // Dims=1536 is for embeddings created with `text-embedding-ada-002`
  await sql`CREATE INDEX article_embedding_title_desc_l2_index ON article USING hnsw(embedding_title_desc) WITH (dims=1536, m=64, efconstruction=128, efsearch=64);`.execute(
    db
  )
  // Drop the old cosine distance index
  await sql`DROP INDEX article_embedding_title_desc_index;`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  // Create cosine
  await sql`CREATE INDEX article_embedding_title_desc_index ON article USING hnsw(embedding_title_desc ann_cos_ops) WITH (dims=1536, m=64, efconstruction=128, efsearch=64);`.execute(
    db
  )
  // Drop Euclidean
  await sql`DROP INDEX article_embedding_title_desc_l2_index;`.execute(db)
}

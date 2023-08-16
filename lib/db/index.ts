import { createKysely } from "@vercel/postgres-kysely"
import { ArticleTable } from "./article"

interface Database {
  article: ArticleTable
}

export const db = createKysely<Database>()

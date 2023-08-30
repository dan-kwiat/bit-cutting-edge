import {
  Insertable,
  OperandValueExpressionOrList,
  Selectable,
  Updateable,
  sql,
} from "kysely"
import { db } from "."
import { DB } from "./db"
import { Source } from "./source"

export type Article = Selectable<DB["article"]>
export type ArticleNew = Insertable<DB["article"]>
export type ArticleUpdate = Updateable<DB["article"]>

export type ArticleWithSourceTitle = Article & { source_title: Source["title"] }

export async function findArticleByID(
  id: number
): Promise<ArticleWithSourceTitle | undefined> {
  return await db
    .selectFrom("article")
    .where("article.id", "=", id)
    .innerJoin("source", "article.source_id", "source.id")
    .selectAll("article")
    .select("source.title as source_title")
    .executeTakeFirst()
}

export async function findArticles(
  criteria?: {
    ids?: Array<Article["id"]>
    topic_ids?: Array<Article["topic_id"]>
    source_ids?: Array<Article["source_id"]>
  },
  params?: { limit?: number }
): Promise<Array<Article>> {
  let query = db.selectFrom("article")

  if (criteria?.ids) {
    query = query.where("id", "in", criteria.ids)
  }

  if (criteria?.topic_ids) {
    query = query.where("topic_id", "in", criteria.topic_ids)
  }

  if (criteria?.source_ids) {
    query = query.where("source_id", "in", criteria.source_ids)
  }

  if (params?.limit) {
    query = query.limit(params.limit)
  }

  query = query.orderBy("date", "desc")

  return await query.selectAll().execute()
}

function stripParams(article: ArticleNew): ArticleNew {
  const {
    source_id,
    topic_id,
    categories,
    content,
    content_snippet,
    creator,
    description_meta,
    guid,
    date,
    labelled_at,
    link,
    reserved_at,
    reserved_by_email,
    summary,
    title,
  } = article
  return {
    source_id,
    topic_id,
    categories,
    content,
    content_snippet,
    creator,
    description_meta,
    guid,
    date,
    labelled_at,
    link,
    reserved_at,
    reserved_by_email,
    summary,
    title,
  }
}

export async function insertArticles(articles: Array<ArticleNew>) {
  return await db
    .insertInto("article")
    .values(articles.map((x) => stripParams(x)))
    // todo: filter out articles before trying to insert, so we don't have to classify old articles again
    .onConflict((oc) => oc.column("link").doNothing())
    .returningAll()
    .execute()
}

export async function updateArticle(id: number, update: ArticleUpdate) {
  // we're relying on typescript defs to not overwrite important fields here e.g. id
  await db.updateTable("article").set(update).where("id", "=", id).execute()
}

export async function deleteArticle(id: number) {
  return await db
    .deleteFrom("article")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst()
}

export const LABELLING_TIMEOUT_MINUTES = 10 // make sure this matches the sql interval below
const LABELLING_TIMEOUT_SQL =
  sql`now() - INTERVAL '10 minutes'` as OperandValueExpressionOrList<
    DB,
    "article",
    "reserved_at"
  >

export async function reserveArticle(
  email: string
): Promise<ArticleWithSourceTitle | undefined> {
  const article = (await db
    .with("article_to_label", (db) =>
      db
        .selectFrom("article")
        .where("topic_id", "is", null)
        .where((eb) =>
          eb.or([
            eb("reserved_at", "is", null),
            eb("reserved_at", "<", LABELLING_TIMEOUT_SQL),
          ])
        )
        .where("date", ">", sql`now() - INTERVAL '1 year'`)
        .innerJoin("source", "article.source_id", "source.id")
        .select(["article.id", "source.title as source_title"])
        .orderBy(sql`random()`)
        .limit(1)
    )
    .updateTable("article")
    .set({
      reserved_at: sql`now()`,
      reserved_by_email: email,
    })
    .from("article_to_label")
    .where("article.id", "=", sql`article_to_label.id`)
    .returningAll()
    .executeTakeFirst()) as ArticleWithSourceTitle | undefined
  // keysely can't handle the types here, because of complicated merge of `article` and `article_to_label`
  return article
}

export async function resetLabels() {
  await db
    .updateTable("article")
    .set({
      topic_id: null,
      labelled_at: null,
      reserved_at: null,
      reserved_by_email: null,
    })
    .execute()
}

export async function labelReservedArticle(id: number, topic_id: number) {
  return await db
    .updateTable("article")
    .set({
      topic_id,
      labelled_at: sql`now()`,
    })
    .where("id", "=", id)
    .where("topic_id", "is", null)
    .where("reserved_at", ">", LABELLING_TIMEOUT_SQL)
    // we could also pass `reserved_by_email` here and check it matches
    .returningAll()
    .executeTakeFirst()
}

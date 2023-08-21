import { Insertable, Selectable, Updateable } from "kysely"
import { db } from "."
import { DB } from "./db"

export type Article = Selectable<DB["article"]>
export type ArticleNew = Insertable<DB["article"]>
export type ArticleUpdate = Updateable<DB["article"]>

export async function findArticleById(id: number) {
  return db.selectFrom("article").where("id", "=", id).selectAll().execute()
}

export async function filterNewArticles(
  articles: Array<Pick<ArticleNew, "link" | "isoDate">>
) {
  const withLinkAndDate = articles.filter(
    (article) => !!article.link && !!article.isoDate
  )

  const seen = (
    await db
      .selectFrom("article")
      .where(
        "link",
        "in",
        withLinkAndDate.map((x) => x.link!)
      )
      .select("link")
      .execute()
  ).map((x) => x.link)

  return withLinkAndDate.filter((article) => !seen.includes(article.link!))
}

export async function findArticles(criteria: {
  topic_ids?: Array<Article["topic_id"]>
  source_ids?: Array<Article["source_id"]>
}) {
  let query = db.selectFrom("article")

  if (criteria.topic_ids) {
    query = query.where("topic_id", "in", criteria.topic_ids)
  }

  if (criteria.source_ids) {
    query = query.where("source_id", "in", criteria.source_ids)
  }

  return await query.selectAll().execute()
}

function stripParams(article: ArticleNew) {
  const {
    source_id,
    topic_id,
    content,
    contentSnippet,
    creator,
    guid,
    isoDate,
    link,
    pubDate,
    summary,
    title,
  } = article
  return {
    source_id,
    topic_id,
    content,
    contentSnippet,
    creator,
    guid,
    isoDate,
    link,
    pubDate,
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

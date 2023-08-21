import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
  sql,
} from "kysely"
import { db } from "."

export interface ArticleTable {
  id: ColumnType<number, never, never> // or Generated<number> ?
  // categories: string[] | undefined
  content?: string
  contentSnippet?: string
  creator?: string
  guid?: string
  isoDate?: ColumnType<Date, string, string>
  link?: string
  pubDate?: ColumnType<Date, string, string>
  title?: string
  summary?: string
  source: string
  topic: "forests" | "oceans"
  created_at: ColumnType<Date, never, never>
}

export type Article = Selectable<ArticleTable>
export type ArticleNew = Insertable<ArticleTable>
export type ArticleUpdate = Updateable<ArticleTable>

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
        withLinkAndDate.map((x) => x.link)
      )
      .select("link")
      .execute()
  ).map((x) => x.link)

  return withLinkAndDate.filter((article) => !seen.includes(article.link))
}

export async function findArticles(
  criteria: Partial<Pick<Article, "title" | "topic">>
) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  let query = db.selectFrom("article")

  if (criteria.title) {
    query = query.where("title", "=", criteria.title)
  }

  if (criteria.topic) {
    query = query.where("topic", "=", criteria.topic)
  }
  query = query.offset(Math.floor(Math.random() * 10))

  return await query.selectAll().execute()
}

function stripParams(article: ArticleNew) {
  const {
    source,
    topic,
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
    source,
    topic,
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

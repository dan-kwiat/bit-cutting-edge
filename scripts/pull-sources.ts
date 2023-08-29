require("dotenv").config({ path: ".env" })
import Parser from "rss-parser"
import { db } from "../lib/db"
import { ArticleNew, findArticles, insertArticles } from "../lib/db/article"
import { Source, findSources } from "../lib/db/source"
import { getMetadata } from "../lib/scrape/meta"
import { parseDateString } from "../lib/format/date"

const parser = new Parser({
  headers: {
    Accept:
      "application/rss+xml, application/rdf+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8",
  },
})

async function parseArticles(
  source_id: number,
  items: Array<Parser.Item>
): Promise<Array<ArticleNew>> {
  let articles: Array<ArticleNew> = []
  let i = 0
  for (const item of items) {
    if (!item.link) {
      continue
    }
    i++
    console.log(i)
    const html = await fetch(item.link).then((x) => x.text())
    const metadata = await getMetadata(html)
    articles.push({
      content_snippet: item.contentSnippet,
      categories: item.categories,
      content: item.content,
      creator: item.creator,
      description_meta: metadata.description,
      guid: item.guid,
      date:
        parseDateString(item.isoDate) ||
        parseDateString(item.pubDate) ||
        metadata.date,
      summary: item.summary,
      title: item.title,
      link: item.link!,
      source_id,
    })
  }
  return articles
  // we could order by date, but may not always be present
}

async function persistFeed(source: Source): Promise<Array<ArticleNew>> {
  if (!source.url_rss) {
    return []
  }

  const feed = await parser.parseURL(source.url_rss)
  const articles = await parseArticles(source.id, feed.items)
  return await insertArticles(articles)
}

async function main() {
  console.log("Fetching RSS feeds...")

  const sources = await findSources({ hasRSS: true })
  console.log(`Found ${sources.length} feeds.`)

  for (const source of sources) {
    console.log(`Fetching & persisting RSS feed for ${source.title}...`)
    const newArticles = await persistFeed(source)
    console.log(`Persisted ${newArticles?.length} new articles.`)
  }

  const articles = await findArticles({})
  console.log(`Found ${articles.length} articles.`)

  await db.destroy()
  console.log("Done!")
  process.exit(0)
}

main()

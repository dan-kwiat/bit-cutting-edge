require("dotenv").config({ path: ".env" })
import { db } from "../lib/db"
import { ArticleNew, findArticles, insertArticles } from "../lib/db/article"
import { Source, findSources } from "../lib/db/source"
import Parser from "rss-parser"

const parser = new Parser({
  headers: {
    Accept:
      "application/rss+xml, application/rdf+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8",
  },
})

function parseArticles(
  source_id: number,
  items: Array<Parser.Item>
): Array<ArticleNew> {
  return items
    .filter((item) => !!item.link)
    .map((item) => ({
      ...item,
      link: item.link!,
      source_id,
    }))
  // we could order by isoDate, but may not always be present
}

async function persistFeed(source: Source): Promise<Array<ArticleNew>> {
  if (!source.url_rss) {
    return []
  }

  const feed = await parser.parseURL(source.url_rss)
  const articles = parseArticles(source.id, feed.items)
  return await insertArticles(articles)
}

async function seed() {
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
}

seed()

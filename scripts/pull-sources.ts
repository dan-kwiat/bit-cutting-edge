require("dotenv").config({ path: ".env" })
import Parser from "rss-parser"
import { db } from "../lib/db"
import { ArticleNew, findArticles, insertArticles } from "../lib/db/article"
import { Source, findSources } from "../lib/db/source"
import { getMetadata } from "../lib/scrape/meta"
import { parseDateString } from "../lib/format/date"
import { HEADERS_FOR_SCRAPING } from "../lib/scrape/headers"
import { getArticleEmbedding } from "../lib/embedding"

const parser = new Parser({
  headers: {
    Accept:
      "application/rss+xml, application/rdf+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8",
  },
})

function cleanUrl(url: string) {
  // we could strip out query params here, but some links might actually rely on them
  return url
}

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
    const url = cleanUrl(item.link)
    i++
    console.log(i)
    /* Filter out previously seen links */
    const existing = await findArticles({ links: [url] })
    if (existing.length > 0) {
      continue
    }
    /* Scrape content */
    const html = await fetch(url, {
      headers: HEADERS_FOR_SCRAPING,
    }).then((x) => x.text())
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
      image: metadata.image,
      link: url,
      summary: item.summary,
      title: item.title,
      source_id,
      embedding_title_desc: await getArticleEmbedding({
        title: item.title,
        content_snippet: item.contentSnippet,
        description_meta: metadata.description,
      }),
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
  if (articles.length === 0) {
    return []
  }
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

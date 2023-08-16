import ArticleList from "@/components/article-list"
import { findArticles } from "@/lib/db/article"
import Parser from "rss-parser"

const parser = new Parser()

export const revalidate = 10

export default async function Home() {
  // const feed = await parser.parseURL(
  //   "https://www.cambridge.org/core/rss/product/id/FDD872CC2D357744AF3372313641EB91"
  // )

  // const items = feed.items
  //   .filter((x) => !!x.isoDate)
  //   .sort(
  //     (a, b) => new Date(b.isoDate!).getTime() - new Date(a.isoDate!).getTime()
  //   )

  // await createTable()

  // await insertArticles(
  //   items.map((x) => ({
  //     ...x,
  //     source:
  //       "https://www.cambridge.org/core/rss/product/id/FDD872CC2D357744AF3372313641EB91",
  //     topic: "forests",
  //   }))
  // )

  let articles = await findArticles({})
  articles = [articles[0]]
  return (
    <main className="px-2 py-12 text-gray-500">
      <ArticleList title={`${articles.length} Articles`} articles={articles} />
    </main>
  )
}

import { findArticles } from "@/lib/db/article"
import Parser from "rss-parser"

const parser = new Parser()

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
      <h1 className="text-xl font-bold">{articles.length} Articles</h1>
      <ul className="mt-12 space-y-6">
        {articles.map((item) => (
          <ul key={item.guid} className="">
            <h2 className="text-lg font-bold text-gray-700">{item.title}</h2>
            <p className="font-mono">{item.isoDate?.toISOString()}</p>
            <p className="mt-1">{item.contentSnippet}</p>
          </ul>
        ))}
      </ul>
    </main>
  )
}

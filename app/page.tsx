import ArticleList from "@/components/article-list"
import { findArticles } from "@/lib/db/article"

export const revalidate = 10 // revalidate data at most every 10 seconds

export default async function Home() {
  let articles = await findArticles({}, { limit: 100 })
  return (
    <main className="px-2 py-12 text-gray-500">
      <ArticleList
        title={`Top ${articles.length} articles`}
        articles={articles}
      />
    </main>
  )
}

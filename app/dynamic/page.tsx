import ArticleList from "@/components/article-list"
import { findArticles } from "@/lib/db/article"
import { cookies, headers } from "next/headers"

export const revalidate = 10

export default async function Home() {
  const cookieStore = cookies()
  const headersList = headers()
  const referer = headersList.get("referer")

  let articles = await findArticles({})
  articles = [articles[0]]
  return (
    <main className="px-2 py-12 text-gray-500">
      <div>Referer: {referer}</div>
      <ArticleList title={`${articles.length} Articles`} articles={articles} />
    </main>
  )
}

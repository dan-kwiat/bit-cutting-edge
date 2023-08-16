import ArticleList from "@/components/article-list"

export default async function Loading() {
  return (
    <main className="px-2 py-12 text-gray-500">
      <ArticleList loading />
    </main>
  )
}

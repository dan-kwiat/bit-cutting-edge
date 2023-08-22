import { Article } from "@/lib/db/article"

export default function ArticlePreview({
  loading,
  article,
}: {
  loading?: boolean
  article: Article | undefined
}) {
  if (loading) {
    return (
      <section>
        <h2 className="text-lg font-bold text-gray-700">----------</h2>
        <p className="font-mono">xxxx-xx-xx</p>
        <p className="mt-1">....................................</p>
      </section>
    )
  }
  if (!article) {
    return (
      <section>
        <h2 className="text-lg font-bold text-gray-700">No article found :(</h2>
      </section>
    )
  }
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-700">
        <a href={article.link} target="_blank" rel="noopener noreferrer">
          {article.title}
        </a>
      </h2>
      <p className="text-sm">{article.categories?.join(", ")}</p>
      <p className="mt-1">{article.contentSnippet}</p>
    </section>
  )
}

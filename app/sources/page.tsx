import ArticleList from "@/components/article-list"
import { findSources } from "@/lib/db/source"

export default async function Home() {
  const sources = await findSources({ hasRSS: true })

  return (
    <main className="px-2 py-12 text-gray-500">
      <ArticleList
        title={`${sources.length} Sources`}
        articles={sources.map((x) => ({
          link: x.url_rss!,
          title: x.title,
          contentSnippet: x.type,
          isoDate: null,
        }))}
      />
    </main>
  )
}

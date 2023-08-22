import ArticleList from "@/components/article-list"
import { findUmbrellaTopics } from "@/lib/db/topic"

export default async function Home() {
  const topicsByUmbrella = await findUmbrellaTopics()

  return (
    <main className="px-2 py-12 text-gray-500">
      <ul className="divide-y-4">
        {Object.keys(topicsByUmbrella).map((umbrella) => {
          const topics =
            topicsByUmbrella[umbrella as keyof typeof topicsByUmbrella]
          return (
            <li key={umbrella} className="py-12">
              <ArticleList
                title={`${umbrella}: ${topics?.length} Topics`}
                articles={topics?.map((x) => ({
                  link: "/",
                  title: x.title,
                  contentSnippet: x.umbrella,
                  isoDate: null,
                }))}
              />
            </li>
          )
        })}
      </ul>
    </main>
  )
}

import ArticleList from "@/components/article-list"
import { Topic, findTopics } from "@/lib/db/topic"

export default async function Home() {
  const topics = await findTopics({})

  const topicsByUmbrella = topics.reduce(
    (acc, x) => {
      if (!acc[x.umbrella]) {
        acc[x.umbrella] = []
      }
      acc[x.umbrella].push(x)
      return acc
    },
    {} as {
      [key: string]: Array<Topic>
    }
  )

  return (
    <main className="px-2 py-12 text-gray-500">
      <ul className="divide-y-4">
        {Object.keys(topicsByUmbrella).map((umbrella) => {
          const topics = topicsByUmbrella[umbrella]
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

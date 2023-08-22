import TopicRadios from "./topic-radios"
import ArticleToLabel from "./article"
import { findUmbrellaTopics } from "@/lib/db/topic"

export default async function Page() {
  const umbrellaTopics = await findUmbrellaTopics()

  return (
    <main className="px-2 py-12 text-gray-500 mx-auto max-w-7xl">
      <ArticleToLabel />
      <div className="mt-24">
        <TopicRadios umbrellaTopics={umbrellaTopics} />
      </div>
    </main>
  )
}

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
              <section>
                <h2 className="text-xl font-bold">
                  {umbrella}: {topics?.length} Topics
                </h2>
                <ul className="mt-12 space-y-6">
                  {topics.map((item) => (
                    <li key={item.id} className="">
                      <h2 className="text-lg font-bold text-gray-700">
                        {item.title}
                      </h2>
                      <p className="mt-1">{item.core ? "Core" : "Emerging"}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </li>
          )
        })}
      </ul>
    </main>
  )
}

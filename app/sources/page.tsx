import { findSources } from "@/lib/db/source"

export default async function Home() {
  const sources = await findSources({ hasRSS: true })

  return (
    <main className="px-2 py-12 text-gray-500">
      <section>
        <h2 className="text-xl font-bold">{sources.length} Sources</h2>
        <ul className="mt-12 space-y-6">
          {sources.map((item) => (
            <li key={item.url_rss} className="">
              <h2 className="text-lg font-bold text-gray-700">
                {item.url_rss ? (
                  <a href={item.url_rss}>{item.title}</a>
                ) : (
                  item.title
                )}
              </h2>
              <p className="mt-1">{item.type}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

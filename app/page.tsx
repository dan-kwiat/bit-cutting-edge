import Parser from "rss-parser"

const parser = new Parser()

export default async function Home() {
  const feed = await parser.parseURL("https://www.reddit.com/.rss")

  const items = feed.items
    .filter((x) => !!x.isoDate)
    .sort(
      (a, b) => new Date(b.isoDate!).getTime() - new Date(a.isoDate!).getTime()
    )

  return (
    <main className="px-2 py-12 text-gray-500">
      <ul className="space-y-6">
        {items.map((item) => (
          <ul key={item.guid} className="">
            <h2 className="text-lg font-bold text-gray-700">{item.title}</h2>
            <p className="font-mono">{item.isoDate}</p>
            <p className="mt-1">{item.contentSnippet}</p>
          </ul>
        ))}
      </ul>
    </main>
  )
}

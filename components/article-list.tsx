import { Article } from "@/lib/db/article"

export default function ArticleList(
  props:
    | { loading: true }
    | {
        articles: Array<Article>
        title?: string
        loading?: false
      }
) {
  if (props.loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold">Loading articles...</h2>
        <ul className="mt-12 space-y-6">
          <li className="">
            <h2 className="text-lg font-bold text-gray-700">----------</h2>
            <p className="font-mono">xxxx-xx-xx</p>
            <p className="mt-1">....................................</p>
          </li>
        </ul>
      </section>
    )
  }
  const { title, articles } = props
  return (
    <section>
      {title ? <h2 className="text-2xl font-bold">{title}</h2> : null}
      {articles.length > 0 ? (
        <ul className="mt-4 grid grid-cols-12 gap-2">
          {articles.map((item) => (
            <li
              key={item.link}
              className="col-span-6 md:col-span-4 xl:col-span-3 border shadow rounded overflow-hidden"
            >
              <div className="aspect-[16/9] w-full bg-gray-100 sm:aspect-[2/1] lg:aspect-[3/2]">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <div className="px-2 py-3">
                <h2 className="text-lg font-bold text-gray-700">
                  {item.link ? (
                    <a href={item.link}>{item.title}</a>
                  ) : (
                    item.title
                  )}
                </h2>
                <p className="font-mono">{item.date?.toISOString()}</p>
                <p className="mt-1 line-clamp-3">
                  {item.content_snippet || item.description_meta}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-center text-gray-500">No articles found.</p>
      )}
    </section>
  )
}

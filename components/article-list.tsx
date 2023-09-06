import { Article } from "@/lib/db/article"
import { NewspaperIcon } from "@heroicons/react/24/outline"

function Overlay() {
  return <span className="absolute inset-y-0.5 inset-x-0 bg-gray-100" />
}

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
        <ul className="mt-4 grid grid-cols-12 gap-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="col-span-12 sm:col-span-6 md:col-span-4 border shadow rounded overflow-hidden"
            >
              <div className="aspect-[16/9] w-full bg-gray-100 sm:aspect-[2/1] lg:aspect-[3/2]" />

              <div className="px-2 py-3">
                <h2 className="relative text-lg font-bold text-gray-700 line-clamp-2">
                  Loading title
                  <Overlay />
                </h2>
                <p className="relative font-mono text-sm font-normal text-gray-500">
                  xxxx-xx-xx
                  <Overlay />
                </p>
                <p className="relative mt-1 line-clamp-3 text-gray-500">
                  Loading content 1<br />
                  Loading content 2<br />
                  Loading content 3
                  <Overlay />
                </p>
              </div>
            </li>
          ))}
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
              className="col-span-12 sm:col-span-6 md:col-span-4 border shadow rounded overflow-hidden"
            >
              <div className="aspect-[16/9] w-full bg-gray-100 sm:aspect-[2/1] lg:aspect-[3/2]">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <NewspaperIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="px-2 py-3">
                <h2 className="text-lg font-bold text-gray-700 line-clamp-2">
                  {item.link ? (
                    <a href={item.link}>{item.title}</a>
                  ) : (
                    item.title
                  )}
                </h2>
                <p className="font-mono text-sm font-normal text-gray-500">
                  {item.date?.toISOString().split("T")[0]}
                </p>
                <p className="mt-1 line-clamp-3 text-gray-500">
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

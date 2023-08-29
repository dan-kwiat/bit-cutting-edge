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
        <h2 className="text-xl font-bold">Loading articles...</h2>
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
      {title ? <h2 className="text-xl font-bold">{title}</h2> : null}
      <ul className="mt-12 space-y-6">
        {articles.map((item) => (
          <li key={item.link} className="">
            <h2 className="text-lg font-bold text-gray-700">
              {item.link ? <a href={item.link}>{item.title}</a> : item.title}
            </h2>
            <p className="font-mono">{item.iso_date?.toISOString()}</p>
            <p className="mt-1">
              {item.content_snippet || item.description_meta}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

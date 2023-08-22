"use client"
import { Article } from "@/lib/db/article"
import { useEffect, useState } from "react"
import { ReqLabelReserve } from "../api/label/reserve/route"
import ArticleList from "@/components/article-list"
import { getDateReviver } from "@/lib/format/date-reviver"

const articleDateReviver = getDateReviver<Article>([
  "isoDate",
  "pubDate",
  "created_at",
  "labelled_at",
  "reserved_at",
])

export default function ArticleToLabel() {
  const [article, setArticle] = useState<Article | undefined>()

  useEffect(() => {
    const body: ReqLabelReserve["post"]["body"] = {
      email: "dan@example.com",
    }
    fetch("/api/label/reserve", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.text()) // don't use res.json() so we can revive dates with JSON.parse()
      .then((text) => {
        return JSON.parse(text, articleDateReviver)
      })
      .then((data: ReqLabelReserve["post"]["response"]) => {
        setArticle(data.article)
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <section>
      <ArticleList
        title="Article to label"
        articles={article ? [article] : []}
        loading={!article}
      />
    </section>
  )
}

"use client"
import { Article } from "@/lib/db/article"
import { useEffect, useState } from "react"
import { ReqLabelReserve } from "@/app/api/label/reserve/route"
import { ReqLabel } from "@/app/api/label/route"
import { Topic, UmbrellaTopics } from "@/lib/db/topic"
import TopicRadios from "./topic-radios"
import ArticlePreview from "./article-preview"
import { fetchWithDateRevival } from "@/lib/fetch"
import { articleDateReviver } from "@/lib/format/date"

const MIN_PERSIST_TIME_MS = 1000

export default function Labeller({
  umbrellaTopics,
}: {
  umbrellaTopics: UmbrellaTopics
}) {
  const [articleCount, setArticleCount] = useState(1)
  const [article, setArticle] =
    useState<ReqLabelReserve["post"]["response"]["article"]>()
  const [selected, setSelected] = useState<Topic | null>(null)
  const [labelling, setLabelling] = useState<{
    persisting: boolean
    lastLabelled: Article | undefined
  }>({
    persisting: false,
    lastLabelled: undefined,
  })

  useEffect(() => {
    const body: ReqLabelReserve["post"]["body"] = {
      email: "dan@example.com",
    }
    setArticle(undefined)
    fetchWithDateRevival(articleDateReviver)("/api/label/reserve", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data: ReqLabelReserve["post"]["response"]) => {
        setArticle(data.article)
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setSelected(null)
      })
  }, [articleCount])

  function onLabel() {
    if (!article || !selected) {
      return
    }
    if (labelling.persisting || labelling.lastLabelled?.id === article.id) {
      return
    }
    const t1 = new Date().getTime()
    setLabelling((prev) => ({
      ...prev,
      persisting: true,
    }))
    const body: ReqLabel["post"]["body"] = {
      article_id: article.id,
      topic_id: selected.id,
    }
    fetchWithDateRevival(articleDateReviver)("/api/label", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data: ReqLabelReserve["post"]["response"]) => {
        console.log("successfully labelled article")
        console.log(data.article)
        // Ensure user sees persisting state for at least 1 second:
        const t2 = new Date().getTime()
        const dt = t2 - t1
        return new Promise((resolve) => {
          setTimeout(() => {
            setArticleCount((prev) => prev + 1)
            setLabelling({
              lastLabelled: data.article,
              persisting: false,
            })
            resolve(null)
          }, Math.max(MIN_PERSIST_TIME_MS - dt, 0))
        })
      })
      .catch((err) => {
        console.log(err)
        setLabelling((prev) => ({
          ...prev,
          persisting: false,
        }))
      })
      .finally(() => {
        window.scrollTo(0, 0)
      })
  }

  useEffect(() => {
    if (selected) {
      onLabel()
    }
  }, [selected])

  return (
    <section className="space-y-8">
      <h1 className="text-medium text-lg text-pink-500">
        Here's a paper preview 👓
      </h1>
      <ArticlePreview article={article} loading={!article} />
      <h1 className="text-medium text-lg text-pink-500">
        Which policy area is it most relevant to? 👇
      </h1>
      <TopicRadios
        umbrellaTopics={umbrellaTopics}
        selected={selected}
        setSelected={setSelected}
        disabled={labelling.persisting || !article}
      />
    </section>
  )
}

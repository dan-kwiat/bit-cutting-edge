import { Article, labelReservedArticle } from "@/lib/db/article"
import { NextResponse } from "next/server"

export interface ReqLabel {
  post: {
    body: {
      article_id: number
      topic_id: number
    }
    response: {
      article: Article | undefined
    }
  }
}

export async function POST(req: Request) {
  try {
    const { article_id, topic_id } =
      (await req.json()) as ReqLabel["post"]["body"]
    const article = await labelReservedArticle(article_id, topic_id)
    const response: ReqLabel["post"]["response"] = { article }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

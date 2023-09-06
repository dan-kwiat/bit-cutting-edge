import { Article, findArticles } from "@/lib/db/article"
import { parseIdsArray } from "@/lib/fetch"
import { NextRequest, NextResponse } from "next/server"

export interface ReqArticles {
  get: {
    query: {
      source_ids: string
      topic_ids: string
      search: string
    }
    response: {
      articles: Array<Article>
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const articles = await findArticles({
      source_ids: parseIdsArray<ReqArticles["get"]["query"]>(req, "source_ids"),
      topic_ids: parseIdsArray<ReqArticles["get"]["query"]>(req, "topic_ids"),
      search: req.nextUrl.searchParams.get("search") || undefined,
    })
    const response: ReqArticles["get"]["response"] = { articles }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

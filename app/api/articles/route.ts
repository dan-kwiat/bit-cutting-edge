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
      // Filter by labels from embedding similarity:
      // topic_ids: parseIdsArray<ReqArticles["get"]["query"]>(req, "topic_ids"),
      // Filter by zero-shot gpt-4 labels:
      topic_ids_zero_shot: parseIdsArray<ReqArticles["get"]["query"]>(
        req,
        "topic_ids"
      ),
      search: req.nextUrl.searchParams.get("search") || undefined,
    })

    if (!articles) {
      // This might happen if neon postgres goes down
      throw new Error("Failed to fetch articles")
    }

    const response: ReqArticles["get"]["response"] = { articles }

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch articles" },
      { status: 500 }
    )
  }
}

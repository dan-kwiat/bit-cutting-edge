import { ArticleWithSourceTitle, reserveArticle } from "@/lib/db/article"
import { NextResponse } from "next/server"

export interface ReqLabelReserve {
  post: {
    body: {
      email: string
    }
    response: {
      article: ArticleWithSourceTitle | undefined
    }
  }
}

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as ReqLabelReserve["post"]["body"]
    const article = await reserveArticle(email)
    const response: ReqLabelReserve["post"]["response"] = { article }

    // await db.destroy() // is this necessary?

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

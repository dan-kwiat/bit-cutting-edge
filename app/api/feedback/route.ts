import { Feedback, findFeedback } from "@/lib/db/feedback"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export interface ReqFeedback {
  get: {
    query: {}
    response: {
      feedback: Array<Feedback>
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const feedback = await findFeedback()

    if (!feedback) {
      // think this might happen if neon postgres goes down
      throw new Error("Failed to fetch from database")
    }

    const response: ReqFeedback["get"]["response"] = { feedback }

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch feedback" },
      { status: 500 }
    )
  }
}

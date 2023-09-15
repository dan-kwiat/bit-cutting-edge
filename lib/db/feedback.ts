import { Insertable, Selectable, Updateable } from "kysely"
import { db } from "."
import { DB } from "./db"

export type Feedback = Selectable<DB["feedback"]>
export type FeedbackNew = Insertable<DB["feedback"]>
export type FeedbackUpdate = Updateable<DB["feedback"]>

export async function findFeedback(
  criteria?: {
    useful?: boolean
  },
  params: { limit?: number } = { limit: 100 }
): Promise<Array<Feedback>> {
  let query = db.selectFrom("feedback")

  if (criteria?.useful) {
    query = query.where("useful", "=", criteria.useful)
  }

  if (params?.limit) {
    query = query.limit(params.limit)
  }

  return await query.selectAll("feedback").orderBy("id", "desc").execute()
}

export async function insertFeedback(feedback: FeedbackNew) {
  return await db
    .insertInto("feedback")
    .values(feedback)
    .returningAll()
    .execute()
}

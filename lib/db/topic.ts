import { Insertable, Selectable, Updateable } from "kysely"
import { db } from "."
import { DB } from "./db"

export type Topic = Selectable<DB["topic"]>
export type TopicNew = Insertable<DB["topic"]>
export type TopicUpdate = Updateable<DB["topic"]>

export async function findTopicById(id: number) {
  return db.selectFrom("topic").where("id", "=", id).selectAll().execute()
}

export async function findTopics(criteria: Partial<Pick<Topic, "umbrella">>) {
  let query = db.selectFrom("topic")

  if (criteria.umbrella) {
    query = query.where("umbrella", "=", criteria.umbrella)
  }

  return await query.selectAll().execute()
}

export async function insertTopics(topics: Array<TopicNew>) {
  return db.insertInto("topic").values(topics).execute()
}

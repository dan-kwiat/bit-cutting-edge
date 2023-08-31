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

  return await query.orderBy("id").selectAll().execute()
}

export type UmbrellaTopics = {
  [key in Topic["umbrella"]]: Array<Topic>
}

export async function findUmbrellaTopics() {
  const topics = await findTopics({})

  const topicsByUmbrella = topics.reduce((acc, x) => {
    if (!acc[x.umbrella]) {
      acc[x.umbrella] = []
    }
    acc[x.umbrella].push(x)
    return acc
  }, {} as UmbrellaTopics)

  return topicsByUmbrella
}

export async function insertTopics(topics: Array<TopicNew>) {
  return db.insertInto("topic").values(topics).execute()
}

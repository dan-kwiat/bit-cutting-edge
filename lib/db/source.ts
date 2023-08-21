import { Insertable, Selectable, Updateable } from "kysely"
import { db } from "."
import { DB } from "./db"

export type Source = Selectable<DB["source"]>
export type SourceNew = Insertable<DB["source"]>
export type SourceUpdate = Updateable<DB["source"]>

export async function findSourceById(id: number) {
  return db.selectFrom("source").where("id", "=", id).selectAll().execute()
}

export async function findSources(criteria: { hasRSS?: boolean }) {
  let query = db.selectFrom("source")

  if (typeof criteria.hasRSS === "boolean") {
    if (criteria.hasRSS) {
      query = query.where((eb) =>
        eb.or([eb("url_rss", "is not", null), eb("url_rss", "!=", "")])
      )
    } else {
      query = query.where((eb) =>
        eb.or([eb("url_rss", "is", null), eb("url_rss", "=", "")])
      )
    }
  }

  return query.selectAll().execute()
}

export async function insertSources(sources: Array<SourceNew>) {
  return db.insertInto("source").values(sources).execute()
}

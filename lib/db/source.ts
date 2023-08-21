import { Insertable, Selectable, Updateable } from "kysely"
import { db } from "."
import { DB } from "./db"

export type Source = Selectable<DB["source"]>
export type SourceNew = Insertable<DB["source"]>
export type SourceUpdate = Updateable<DB["source"]>

export async function findSourceById(id: number) {
  return db.selectFrom("source").where("id", "=", id).selectAll().execute()
}

export async function findSources() {
  return db.selectFrom("source").selectAll().execute()
}

export async function insertSources(sources: Array<SourceNew>) {
  return db.insertInto("source").values(sources).execute()
}

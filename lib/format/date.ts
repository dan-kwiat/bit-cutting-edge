import { Article } from "../db/article"

// works on objects and arrays of objects:
export function getDateReviver<T>(
  dateFields: Array<keyof T>
): (key: any, value: any) => any {
  return function reviver(key: any, value: any): any {
    if (Array.isArray(value)) {
      return value.map((item) => {
        dateFields.forEach((propertyName) => {
          if (item && item[propertyName]) {
            item[propertyName] = new Date(item[propertyName])
          }
        })
        return item
      })
    } else if (value && typeof value === "object") {
      dateFields.forEach((propertyName) => {
        if (value[propertyName]) {
          value[propertyName] = new Date(value[propertyName])
        }
      })
      return value
    }
    return value
  }
}

// Usage example for `getDateReviver`:
//
// interface Data {
//   id: number
//   name: string
//   created_at: Date
//   updated_at: Date
// }
//
// const jsonString = JSON.stringify({
//   id: 1,
//   name: "name",
//   created_at: new Date(),
//   updated_at: new Date(),
// })
//
// const data = JSON.parse(
//   jsonString,
//   getDateReviver<Data>(["created_at", "updated_at"])
// )

export const articleDateReviver = getDateReviver<Article>([
  "date",
  "created_at",
  "labelled_at",
  "reserved_at",
])

export function parseDateString(
  dateString: string | undefined
): Date | undefined {
  if (!dateString) {
    return undefined
  }

  try {
    let date: Date

    const isIntString = /^\d+$/.test(dateString)

    if (isIntString) {
      // Assume this is epoch in seconds
      date = new Date(parseInt(dateString) * 1000)
    } else {
      // Assume this is ISO date string or similar
      date = new Date(dateString)
    }

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${dateString}`)
    }

    return date
  } catch (e) {
    return undefined
  }
}

export function getDateReviver<T>(dateFields: Array<keyof T>) {
  return function (key: string, value: any) {
    if (dateFields.indexOf(key as keyof T) > -1) {
      return new Date(value)
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

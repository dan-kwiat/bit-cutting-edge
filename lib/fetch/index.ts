import { NextRequest } from "next/server"

export const fetchWithDateRevival =
  (dateReviver: Parameters<typeof JSON.parse>[1]) =>
  (...args: Parameters<typeof fetch>) =>
    fetch(...args)
      .then((res) => res.text())
      .then((text) => {
        return JSON.parse(text, dateReviver)
      })

export function parseIdsArray<Query extends { [key: string]: string }>(
  req: NextRequest,
  keyName: keyof Query
): Array<number> | undefined {
  const ids = req.nextUrl.searchParams.get(keyName as string)
  try {
    if (ids) {
      // todo: test if it's actually an array of numbers?
      return JSON.parse(ids) as Array<number>
    }
    return undefined
  } catch (error) {
    throw new Error(
      `Error parsing query param \`${keyName as string}=${ids}\`: ${error}`
    )
  }
}
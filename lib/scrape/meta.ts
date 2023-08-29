import { load } from "cheerio"
import { parseDateString } from "../format/date"

const META_DATE_PROPERTIES = [
  "article:published_time",
  "og:published_time",
  "article:modified_time",
  "og:updated_time",
]

// These tags are used by `sciencedirect.com` journals:
const META_DATE_NAMES = ["citation_publication_date", "citation_online_date"]

function getDate(dateStrings: Array<string | undefined>): Date | undefined {
  for (const dateString of dateStrings) {
    if (!dateString) {
      continue
    }
    const date = parseDateString(dateString)
    if (date) {
      return date
    }
  }
  return undefined
}

export async function getMetaDescription(url: string): Promise<{
  description: string | undefined
  date: Date | undefined
}> {
  const response = await fetch(url)
  const html = await response.text()
  const $ = load(html)
  const description = $('meta[name="description"]').attr("content")
  const ogDescription = $('meta[property="og:description"]').attr("content")

  let dateStrings: Array<string | undefined> = [
    ...META_DATE_PROPERTIES.map((x) =>
      $('meta[property="' + x + '"]').attr("content")
    ),
    ...META_DATE_NAMES.map((x) => $('meta[name="' + x + '"]').attr("content")),
  ]

  return {
    date: getDate(dateStrings),
    description: description || ogDescription || undefined,
  }
}

import { CheerioAPI, load } from "cheerio"
import { parseDateString } from "../format/date"

const META_DATE_PROPERTIES = [
  "article:published_time",
  "og:published_time",
  "article:modified_time",
  "og:updated_time",
]

// These tags are used by `sciencedirect.com` journals:
// Note: `citation_publication_date` can be in the future i.e. release date of journal volume
const META_DATE_NAMES = ["citation_online_date", "citation_publication_date"]

function getDate(dateStrings: Array<string>): Date | undefined {
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

// return type is dependent on `returnAll` parameter
function getContentFromMetaTags<T extends boolean = false>(
  $: CheerioAPI,
  keySelectors: Array<["name" | "property", Array<string>]>,
  returnAll?: T
): T extends true ? Array<string> : string | undefined {
  let items: Array<string> = []
  for (const selector of keySelectors) {
    for (const s of selector[1]) {
      const item = $(`meta[${selector[0]}="${s}"]`).attr("content")
      if (item) {
        if (!returnAll) {
          return item as any
        }
        items.push(item)
      }
    }
  }
  return returnAll ? (items as any) : undefined
}

export async function getMetadata(html: string): Promise<{
  description: string | undefined
  date: Date | undefined
  image: string | undefined
}> {
  const $ = load(html)

  let description = getContentFromMetaTags($, [
    ["name", ["description"]],
    ["property", ["og:description"]],
  ])

  let image = getContentFromMetaTags($, [
    ["property", ["og:image", "og:image:url", "og:image:secure_url"]],
  ])

  let dateStrings = getContentFromMetaTags(
    $,
    [
      ["property", META_DATE_PROPERTIES],
      ["name", META_DATE_NAMES],
    ],
    true
  )

  return {
    date: getDate(dateStrings),
    description,
    image,
  }
}

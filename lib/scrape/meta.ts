import { load } from "cheerio"

export async function getMetaDescription(
  url: string
): Promise<string | undefined> {
  const response = await fetch(url)
  const html = await response.text()
  const $ = load(html)
  const description = $('meta[name="description"]').attr("content")
  const ogDescription = $('meta[property="og:description"]').attr("content")
  return description || ogDescription || undefined
}

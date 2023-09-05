import { ResponseTypes } from "openai-edge"
import { ArticleNew } from "@/lib/db/article"
import { openai } from "@/lib/openai"

export function getEmbeddingInput(
  article: Pick<ArticleNew, "title" | "content_snippet" | "description_meta">
): string {
  const description = (
    article.content_snippet || article.description_meta
  )?.substring(0, 1000)
  return `${article.title || ""}\n${description || ""}`
}

export async function getEmbedding(input: string): Promise<Array<number>> {
  const res = (await openai
    .createEmbedding({
      input,
      model: "text-embedding-ada-002",
    })
    .then((x) => x.json())) as ResponseTypes["createEmbedding"]
  const embedding = res.data[0].embedding
  if (!embedding || embedding.length !== 1536) {
    throw new Error("Invalid embedding")
  }
  return embedding
}

export async function getArticleEmbedding(
  article: Pick<ArticleNew, "title" | "content_snippet" | "description_meta">
): Promise<Array<number>> {
  return getEmbedding(getEmbeddingInput(article))
}

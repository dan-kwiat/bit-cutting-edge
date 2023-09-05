require("dotenv").config({ path: ".env" })
import { Configuration, OpenAIApi, ResponseTypes } from "openai-edge"
import { db } from "../lib/db"
import { getEmbeddingInput } from "../lib/prompt/get-embedding-input"

// Note: takes ~5 minutes to run through 1000 articles

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

async function main() {
  const articlesWithoutEmbeddings = await db
    .selectFrom("article")
    .where("embedding_title_desc", "is", null)
    .selectAll()
    .execute()

  for (const article of articlesWithoutEmbeddings) {
    console.log(`Getting & setting embedding for article ${article.id}...`)

    const res = (await openai
      .createEmbedding({
        input: getEmbeddingInput(article),
        model: "text-embedding-ada-002",
      })
      .then((x) => x.json())) as ResponseTypes["createEmbedding"]
    const embedding = res.data[0].embedding

    if (!embedding || embedding.length !== 1536) {
      throw new Error(`Bad embedding: ${JSON.stringify(res)}`)
    }

    await db
      .updateTable("article")
      .set({
        embedding_title_desc: embedding,
        // todo: persist tokens that went into embeddings too?
      })
      .where("id", "=", article.id)
      .execute()
  }

  await db.destroy()
  console.log("Done!")
  process.exit(0)
}

main()

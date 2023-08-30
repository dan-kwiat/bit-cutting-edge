require("dotenv").config({ path: ".env" })
import { Configuration, OpenAIApi, ResponseTypes } from "openai-edge"
import { findArticles } from "../lib/db/article"
import { db } from "../lib/db"
import { getPromptClassify } from "../lib/prompt/classify"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

async function main() {
  const topicArticles: Record<number, Array<number>> = {}

  const articles = await findArticles({}, { limit: 100 })
  for (const article of articles) {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: getPromptClassify(article) }],
      max_tokens: 1,
      temperature: 0,
      stream: false,
    })

    const data =
      (await response.json()) as ResponseTypes["createChatCompletion"]

    const topicId = parseInt(data.choices[0].message?.content || "")

    if (isNaN(topicId)) {
      throw new Error(
        `Invalid topic ID "${data.choices[0].message?.content}" for article ${article.id}: "${article.title}"`
      )
    }

    console.log(`Classified as topic ${topicId}: "${article.title}"`)
    if (!topicArticles[topicId]) {
      topicArticles[topicId] = []
    }
    topicArticles[topicId].push(article.id)
  }

  console.log(topicArticles)
  await db.destroy()
  console.log("Done!")
  process.exit(0)
}

main()

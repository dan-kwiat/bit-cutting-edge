require("dotenv").config({ path: ".env" })
import {
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi,
  ResponseTypes,
} from "openai-edge"
import { db } from "../lib/db"
import { getPromptClassify } from "../lib/prompt/classify"
import { findTopics } from "../lib/db/topic"
import { TopicUmbrella } from "../lib/db/db"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

async function main() {
  const topicArticles: Record<number, Array<number>> = {}

  const topics = (await findTopics({})).filter(
    (x) =>
      (
        ["HASED", "Economy", "Health & Wellbeing", "IP"] as Array<TopicUmbrella>
      ).indexOf(x.umbrella) > -1
  )
  const articles = await db
    .selectFrom("article")
    .leftJoin(
      "article_topic_zero_shot",
      "article.id",
      "article_topic_zero_shot.article_id"
    )
    .where("article_topic_zero_shot.id", "is", null)
    .selectAll("article")
    .limit(100)
    .execute()

  console.log(`found ${articles.length} articles`)
  for (const article of articles) {
    const prompt = getPromptClassify(topics, article)
    // console.log(prompt)
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1,
      temperature: 0,
      stream: false,
    })

    const data =
      (await response.json()) as ResponseTypes["createChatCompletion"]

    if ((data as CreateChatCompletionResponse & { error?: any })?.error) {
      throw new Error(
        (data as CreateChatCompletionResponse & { error?: any })?.error.message
      )
    }

    const topicId = parseInt(data.choices[0].message?.content || "")

    if (isNaN(topicId)) {
      throw new Error(
        `Invalid topic ID "${data.choices[0].message?.content}" for article ${article.id}: "${article.title}"`
      )
    }

    console.log(`Classified as topic ${topicId}: "${article.title}"`)

    if (topicId > 0) {
      await db
        .insertInto("article_topic_zero_shot")
        .values([
          {
            article_id: article.id,
            topic_id: topicId,
          },
        ])
        .onConflict((oc) =>
          oc.column("article_id").doUpdateSet({ topic_id: topicId })
        )
        .returningAll()
        .execute()
    }

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

require("dotenv").config({ path: ".env" })
import { CreateChatCompletionResponse, ResponseTypes } from "openai-edge"
import { openai } from "../lib/openai"
import { db } from "../lib/db"
import { getPromptClassify } from "../lib/prompt/classify"
import { findTopics } from "../lib/db/topic"
import { TopicUmbrella } from "../lib/db/db"

const LIMIT = 10
// TODO: insert topic_id for "not relevant" topic, so we don't re-hit gpt for subsequent run of script

async function main() {
  const topicArticles: Record<number, Array<number>> = {}

  const allTopics = await findTopics({})

  const notRelevant = allTopics.find(
    (x) => x.umbrella === "Other" && x.title.toLowerCase() === "not relevant"
  )
  if (!notRelevant) {
    throw new Error("Could not find 'not relevant' topic")
  }

  const topics = allTopics.filter(
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
    .limit(LIMIT)
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

    await db
      .insertInto("article_topic_zero_shot")
      .values([
        {
          article_id: article.id,
          topic_id: topicId === 0 ? notRelevant.id : topicId,
        },
      ])
      .onConflict((oc) =>
        oc.column("article_id").doUpdateSet({ topic_id: topicId })
      )
      .returningAll()
      .execute()

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

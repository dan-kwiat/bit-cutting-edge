import { Article } from "../db/article"
import { Topic } from "../db/topic"

// TODO: insert tell it to use id for "not relevant" topic, instead of "0"

export function getPromptClassify(topics: Array<Topic>, article: Article) {
  return `You are an expert in the following policy areas:

${topics.map((topic) => `${topic.id}. ${topic.title}`).join("\n")}

Here is a preview of a research paper:

"""
Title: ${article.title}
Description: ${
    (article.content_snippet || article.description_meta)?.substring(0, 1000) +
    "..."
  }
"""

Which policy area is this paper most relevant to? Please just respond with the number e.g. "1", or if it's not relevant to any of the options above, respond with "0".`
}

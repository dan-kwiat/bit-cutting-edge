import ArticleList from "@/components/article-list"
import FiltersPage from "@/components/filters"
import { Article, findArticles } from "@/lib/db/article"
import { findSources } from "@/lib/db/source"
import { findTopics } from "@/lib/db/topic"

const topicArticleIds = {
  "0": [
    929, 880, 1000, 879, 882, 933, 1032, 884, 976, 887, 886, 117, 888, 890, 935,
    1047, 42, 1033, 975, 893, 928, 894, 1034, 1035, 895, 26, 903, 936, 1022,
    1024,
  ],
  "1": [1082, 1089, 1085, 115, 878, 28, 1025, 907, 1092],
  "2": [930],
  "3": [29, 1046, 197],
  "4": [999, 1001, 1088, 875, 892, 896, 905],
  "5": [974, 1020],
  "6": [30, 932, 873, 1031, 27, 877, 876, 891, 1071, 25],
  "13": [1081, 1084, 872, 874, 1091],
  "14": [1004, 1003],
  "15": [193, 31, 1002, 194, 1083, 1006, 195, 1021, 118, 1028],
  "16": [870, 871, 1005, 43, 1027, 978],
  "18": [1087, 1086, 889, 937],
  "19": [881, 114, 931, 883, 116, 934, 885, 41, 904, 906],
  "21": [196],
}

export default async function PromptTopics() {
  const topics = await findTopics({})
  const sources = await findSources({ hasRSS: true })

  let topicArticles: Record<string, Array<Article>> = {}
  for (const [key, value] of Object.entries(topicArticleIds)) {
    topicArticles[key] = await findArticles({ ids: value })
  }

  return (
    <FiltersPage
      defaultFilters={[
        {
          id: "topic",
          name: "Policy Area",
          options: topics.map((item) => {
            return {
              value: item.id,
              label: item.title,
              checked: false,
            }
          }),
        },
        {
          id: "source",
          name: "Source",
          options: sources.map((item) => {
            return {
              value: item.id,
              label: item.title,
              checked: false,
            }
          }),
        },
      ]}
    />
  )
}

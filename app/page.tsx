import FiltersPage from "@/components/filters"
import { findSources } from "@/lib/db/source"
import { findTopics } from "@/lib/db/topic"

export default async function PromptTopics() {
  const topics = await findTopics({})
  const sources = await findSources({ hasRSS: true })

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

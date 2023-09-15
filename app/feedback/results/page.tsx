import { Feedback, findFeedback } from "@/lib/db/feedback"

export default async function Page() {
  const feedback = await findFeedback()
  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">
          Feedback responses
        </h1>
        <ul>
          {feedback.map((feedback: Feedback) => (
            <li key={feedback.id}>
              {feedback.useful ? "👍" : "👎"} {feedback.comments}
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

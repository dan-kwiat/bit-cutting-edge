"use client"
import useSWR from "swr"
import { ReqFeedback } from "@/app/api/feedback/route"
import { Feedback } from "@/lib/db/feedback"
import { fetchJSON } from "@/lib/fetch"
import Spinner from "@/components/spinner"
import { classNames } from "@/lib/format/classNames"

const POLLING_MS = 1000 * 10

export default function Page() {
  const { data, error, isLoading, isValidating } = useSWR<
    ReqFeedback["get"]["response"]
  >(`/api/feedback`, fetchJSON, {
    refreshInterval: POLLING_MS,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  })

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800 flex justify-between">
          {data?.feedback.length} feedback responses:{" "}
          {isValidating ? <Spinner /> : null}
        </h1>
        {error ? (
          <p className="mt-12 text-red-500">
            {error?.message || "Sorry, something went wrong"}
          </p>
        ) : isLoading ? (
          <p className="mt-12 text-gray-500">Finding feedback...</p>
        ) : (
          <ul
            className={classNames(
              "mt-12 grid gap-2 grid-cols-12",
              isValidating ? "opacity-50" : "opacity-100"
            )}
          >
            {data?.feedback.map((feedback: Feedback) => (
              <li
                className="bg-white p-2 shadow col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 space-y-2"
                key={feedback.id}
              >
                <div className="flex space-x-1">
                  <p className="text-sm font-medium">Participant:</p>
                  <p className="text-gray-500 text-sm truncate">
                    {feedback.participant_name
                      ? feedback.participant_name
                      : "Anon"}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  Useful now? {feedback.useful ? "👍" : "👎"}
                </p>
                <p className="text-sm font-medium">
                  Filters useful? {feedback.filters ? "👍" : "👎"}
                </p>
                <div>
                  <p className="text-sm font-medium">More useful if:</p>
                  <p className="text-gray-500 text-sm">
                    {feedback.more_useful}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Comments:</p>
                  <p className="text-gray-500 text-sm">{feedback.comments}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

import Button from "@/components/button"

export default function AboutPage() {
  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          About The Cutting Edge
        </h1>
        <div className="mt-8 text-gray-500 space-y-4 max-w-screen-md">
          <p>
            This is a prototype of a tool developed by Dan K & Hannah B to
            investigate whether AI (specifically large language models) can help
            teams stay up-to-date with the latest news and research.
          </p>
          <p>
            The tool pulls in previews of academic papers from 24 journals and
            categorises them according to 23 policy areas, spanning BIT's four
            clusters. The tool could be extended to provide summaries of
            individual papers, or reader digests for a group of papers e.g.
            <span className="italic">
              "Summarise all research in social care from the last month."
            </span>
          </p>
          <p>
            Being a rough prototype, there is much that can be improved,
            including the quality of the categorisation. Please help us define
            the project's direction by completing the very short feedback form!
          </p>
          <Button href="/feedback">Leave feedback</Button>
        </div>
      </main>
    </div>
  )
}

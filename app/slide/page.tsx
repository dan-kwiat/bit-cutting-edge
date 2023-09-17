import Link from "next/link"

export default function Page() {
  return (
    <div className="bg-white fixed inset-0">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-screen text-6xl flex flex-col justify-around">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Staying up-to-date is hard.
          </h1>
          <ol className="list-decimal space-y-24">
            <li className="">
              Time to skim journals and pick out relevant papers.
            </li>
            <li>Time to read, understand & interrogate each paper.</li>
          </ol>
          <p className="text-4xl">
            Can AI (LLMs) help reduce these times?{" "}
            <Link href="/" className="text-sky-500">
              Demo {"->"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

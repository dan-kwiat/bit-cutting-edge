export default async function Loading() {
  return (
    <main className="px-2 py-12 text-gray-500">
      <h1 className="text-xl font-bold">Loading Articles</h1>
      <ul className="mt-12 space-y-6">
        <li key={1} className="">
          <h2 className="text-lg font-bold text-gray-700">Loading Article</h2>
          <p className="font-mono">xxxx-xx-xx</p>
          <p className="mt-1">...................................</p>
        </li>
      </ul>
    </main>
  )
}

import Button from "@/components/button"

export default function Page() {
  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        <h1 className="text-2xl font-bold tracking-tight text-sky-400">
          ✅ Thanks for your feedback!
        </h1>
        <Button href="/" className="mt-4">
          Back to the platform
        </Button>
      </main>
    </div>
  )
}

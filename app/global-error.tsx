"use client"
import Button from "@/components/button"
import Main from "@/components/main"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error({ error })
  }, [error])

  return (
    <html>
      <body>
        <Main>
          <h2>Something went wrong!</h2>
          <div className="mt-2">
            <Button
              onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
              }
            >
              Try again
            </Button>
          </div>
        </Main>
      </body>
    </html>
  )
}

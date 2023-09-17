"use client"
import { create } from "./actions"
import { useState } from "react"
import { experimental_useFormStatus as useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import Button from "@/components/button"
import Link from "next/link"

function ButtonSubmit() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </Button>
  )
}

function Form() {
  const [errorMessage, setErrorMessage] = useState<string>("")
  const router = useRouter()

  async function onCreate(formData: FormData) {
    const res = await create(formData)
    if (res.type === "error") {
      setErrorMessage(res.message)
    } else {
      router.push("/feedback/thanks")
    }
  }

  return (
    <form action={onCreate}>
      <div className="mt-12 space-y-12">
        <div className="border-y border-gray-900/10 pb-12">
          {/* <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p> */}

          <div className="mt-12 sm:max-w-sm">
            <label
              htmlFor="participant_name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <p className="text-sm text-gray-500">Optional</p>
            <div className="mt-2">
              <input
                type="text"
                name="participant_name"
                id="participant_name"
                autoComplete="given-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                placeholder=""
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Anonymous & honest is better than named & kind!
            </p>
          </div>

          <fieldset className="mt-12">
            <legend className="text-sm font-semibold leading-6 text-gray-900">
              Would you use the platform as it is now in your work?
            </legend>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              i.e. is it already useful enough to browse weekly/monthly?
            </p>
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-x-3">
                <input
                  required
                  id="useful-yes"
                  name="useful"
                  value="yes"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                />
                <label
                  htmlFor="useful-yes"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Yes
                </label>
              </div>
              <div className="flex items-center gap-x-3">
                <input
                  required
                  id="useful-no"
                  name="useful"
                  value="no"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                />
                <label
                  htmlFor="useful-no"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  No
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset className="mt-12">
            <legend className="text-sm font-semibold leading-6 text-gray-900">
              Are the filters useful?
            </legend>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              e.g. being able to filter by cluster / policy area / source
            </p>
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-x-3">
                <input
                  required
                  id="filters-yes"
                  name="filters"
                  value="yes"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                />
                <label
                  htmlFor="filters-yes"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Yes
                </label>
              </div>
              <div className="flex items-center gap-x-3">
                <input
                  required
                  id="filters-no"
                  name="filters"
                  value="no"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                />
                <label
                  htmlFor="filters-no"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  No
                </label>
              </div>
            </div>
          </fieldset>

          <div className="mt-12 sm:max-w-lg">
            <label
              htmlFor="more_useful"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              What would make it more useful to you?
            </label>
            <p className="text-sm text-gray-500">Optional</p>
            <div className="mt-2">
              <textarea
                id="more_useful"
                name="more_useful"
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                defaultValue={""}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              e.g. more sources/filters? an automatic summary of the papers from
              a particular search?
            </p>
          </div>

          <div className="mt-12 sm:max-w-lg">
            <label
              htmlFor="comments"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Comments
            </label>
            <p className="text-sm text-gray-500">Optional</p>
            <div className="mt-2">
              <textarea
                id="comments"
                name="comments"
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                defaultValue={""}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Anything else? Bugs? Criticism? Compliments? 🎣
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <div className="flex flex-col items-end">
          <ButtonSubmit />
          <p className="mt-2 text-sm font-medium leading-6 text-red-500">
            {errorMessage}
          </p>
        </div>
      </div>
    </form>
  )
}

export default function Page() {
  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Leave feedback
        </h1>
        <p className="mt-2 text-gray-500">
          Please help us out by leaving feedback on the initial prototype (which
          you can try{" "}
          <Link href="/" className="underline font-medium">
            here
          </Link>
          ).
        </p>
        <Form />
      </main>
    </div>
  )
}

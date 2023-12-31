"use client"
import { Fragment, useEffect, useState } from "react"
import { Dialog, Menu, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/20/solid"
import FilterSection from "./filter-section"
import { classNames } from "@/lib/format/classNames"
import ArticleList from "../article-list"
import useSWR from "swr"
import { ReqArticles } from "@/app/api/articles/route"
import { fetchWithDateRevival } from "@/lib/fetch"
import { articleDateReviver } from "@/lib/format/date"
import { TopicUmbrella } from "@/lib/db/db"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import SearchInput from "./search"
import Main from "@/components/main"
import Alert from "../alert"
// import Image from "next/image"
// import scissors from "@/public/scissors.jpeg"

const sortOptions = [{ name: "Newest", href: "#", current: true }]

const umbrellas: Array<TopicUmbrella> = [
  "HASED",
  "IP",
  "Economy",
  "Health & Wellbeing",
  // "Cross-cutting",
  // "Other",
]

export interface FilterOptions {
  id: string
  name: string
  options: Array<{
    id: number
    label: string
    group: string | null
    checked?: boolean
  }>
}

function getIdsArray(filters: Array<FilterOptions>, id: string) {
  return filters.reduce((acc, filter) => {
    if (filter.id !== id) return acc
    const checked = filter.options.filter((option) => option.checked)
    if (checked.length > 0) {
      acc.push(...checked.map((option) => option.id))
    }
    return acc
  }, [] as number[])
}

export default function FiltersPage({
  defaultFilters,
  placeholder,
}: {
  defaultFilters: Array<FilterOptions>
  placeholder?: boolean
}) {
  const [filters, setFilters] = useState(defaultFilters)

  const sourceIds = getIdsArray(filters, "source")
  const topicIds = getIdsArray(filters, "topic")

  const router = useRouter()
  const query = useSearchParams()
  const umbrella = query.get("umbrella")
  const search = query.get("search")

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const { data, error, isLoading } = useSWR<ReqArticles["get"]["response"]>(
    placeholder
      ? null
      : `/api/articles?source_ids=${
          sourceIds?.length > 0 ? JSON.stringify(sourceIds) : ""
        }&topic_ids=${
          topicIds?.length > 0 ? JSON.stringify(topicIds) : ""
        }&search=${search || ""}`,
    fetchWithDateRevival(articleDateReviver)
  )

  useEffect(() => {
    resetFilterSection("topic", umbrella || undefined)
  }, [umbrella])

  function resetFilterSection(id: string, exceptGroup?: string) {
    setFilters((prev) => {
      return prev.map((section) => {
        return section.id === id
          ? {
              ...section,
              options: section.options.map((option) => {
                return {
                  ...option,
                  checked: !!exceptGroup && option.group === exceptGroup,
                }
              }),
            }
          : section
      })
    })
  }

  function onFilter(id: string, optionIdx: number, checked: boolean) {
    setFilters((prev) => {
      const sectionIdx = prev.findIndex((section) => section.id === id)
      const option = prev[sectionIdx].options[optionIdx]
      return [
        ...prev.slice(0, sectionIdx),
        {
          ...prev[sectionIdx],
          options: [
            ...prev[sectionIdx].options.slice(0, optionIdx),
            {
              ...option,
              checked,
            },
            ...prev[sectionIdx].options.slice(optionIdx + 1),
          ],
        },
        ...prev.slice(sectionIdx + 1),
      ]
    })
  }

  return (
    <div className="bg-white">
      {/* <div className="absolute inset-0 top-16 h-80 bg-gray-300">
        <Image
          src={scissors}
          layout="fill"
          objectFit="cover"
          alt="The Cutting Edge"
        />
        <div className="absolute inset-0 bg-teal-50/50"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-teal-50/0 to-teal-50" />
      </div> */}
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>
                    <ul
                      role="list"
                      className="px-2 py-3 font-medium text-gray-900"
                    >
                      <li>
                        <Link href="/" className="block px-2 py-3">
                          All
                        </Link>
                      </li>
                      {umbrellas.map((category) => (
                        <li key={category}>
                          <Link
                            href={`?umbrella=${encodeURIComponent(category)}`}
                            className={classNames(
                              "block px-2 py-3",
                              umbrella === category
                                ? "font-bold"
                                : "font-medium"
                            )}
                          >
                            {category}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {filters.map((section) => (
                      <FilterSection
                        key={section.id}
                        filters={section}
                        onFilter={onFilter}
                        mobile
                      />
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <Main>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            The Cutting Edge
          </h1>
          <div className="flex items-baseline justify-between mt-6 border-b border-gray-200 pb-6">
            <div className="hidden sm:block flex-1 mr-4">
              <SearchInput
                onSearch={(search) => {
                  router.push(`?search=${search}`)
                }}
              />
            </div>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              href={option.href}
                              className={classNames(
                                option.current
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button> */}
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="articles-heading" className="pb-24 pt-6">
            <h2 id="articles-heading" className="sr-only">
              Articles
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>
                <ul
                  role="list"
                  className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
                >
                  <li>
                    <Link href="/">All</Link>
                  </li>
                  {umbrellas.map((category) => (
                    <li key={category}>
                      <Link
                        href={`?umbrella=${encodeURIComponent(category)}`}
                        className={
                          umbrella === category ? "font-bold" : "font-medium"
                        }
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>

                {filters.map((section) => (
                  <FilterSection
                    key={section.id}
                    filters={section}
                    onFilter={onFilter}
                  />
                ))}
              </form>

              {/* Items */}
              <div className="lg:col-span-3">
                {error ? (
                  <Alert
                    title={error?.message || "Oops, something went wrong"}
                  />
                ) : (
                  <ArticleList
                    // title={`Topic: ${item.title} (${item.umbrella})`}
                    articles={data ? data.articles : []}
                    loading={isLoading}
                  />
                )}
              </div>
            </div>
          </section>
        </Main>
      </div>
    </div>
  )
}

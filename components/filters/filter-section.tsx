"use client"
import { Disclosure } from "@headlessui/react"
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid"
import { FilterOptions } from "."

export default function FilterSection({
  filters,
  mobile,
  onFilter,
}: {
  filters: FilterOptions
  mobile?: boolean
  onFilter: (filterId: string, optionIdx: number, checked: boolean) => void
}) {
  return (
    <Disclosure
      as="div"
      key={filters.id}
      className={`py-6 border-gray-200 ${
        mobile ? "border-t px-4" : "border-b"
      }`}
    >
      {({ open }) => (
        <>
          <h3 className={`-my-3 flow-root ${mobile ? "-mx-2 " : ""}`}>
            <Disclosure.Button
              className={`flex w-full items-center justify-between py-3 text-gray-400 hover:text-gray-500 ${
                mobile ? "px-2" : "text-sm"
              }`}
            >
              <span className="font-medium text-gray-900">{filters.name}</span>
              <span className="ml-6 flex items-center">
                {open ? (
                  <MinusIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </span>
            </Disclosure.Button>
          </h3>
          <Disclosure.Panel className="pt-6">
            <div className={mobile ? "space-y-6" : "space-y-4"}>
              {filters.options.map((option, optionIdx) => (
                <div key={option.id} className="flex items-center">
                  <input
                    id={`${mobile ? "filter-mobile" : "filter"}-${
                      filters.id
                    }-${optionIdx}`}
                    name={`${filters.id}[]`}
                    defaultValue={option.id}
                    type="checkbox"
                    checked={option.checked}
                    className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    onChange={(e) =>
                      onFilter(filters.id, optionIdx, e.target.checked)
                    }
                  />
                  <label
                    htmlFor={`${mobile ? "filter-mobile" : "filter"}-${
                      filters.id
                    }-${optionIdx}`}
                    className={`ml-3 ${
                      mobile
                        ? "min-w-0 flex-1 text-gray-500"
                        : "text-sm text-gray-600"
                    }`}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

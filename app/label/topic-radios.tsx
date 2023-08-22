"use client"
import { useState } from "react"
import { RadioGroup } from "@headlessui/react"
import { UmbrellaTopics } from "@/lib/db/topic"

export default function TopicRadios({
  umbrellaTopics,
}: {
  umbrellaTopics: UmbrellaTopics
}) {
  const [selected, setSelected] = useState(umbrellaTopics["HASED"][0])

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <RadioGroup.Label className="sr-only">Policy Area</RadioGroup.Label>
      <div className="grid grid-cols-12 gap-4">
        {Object.keys(umbrellaTopics).map((umbrella) => {
          return (
            <div className="col-span-3">
              <h2 className="text-lg font-bold">{umbrella}</h2>
              <div className="space-y-2">
                {umbrellaTopics[umbrella as keyof UmbrellaTopics].map(
                  (item) => (
                    <RadioGroup.Option
                      key={item.id}
                      value={item}
                      className={({ active, checked }) =>
                        `${
                          active
                            ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                            : ""
                        }
                      ${
                        checked
                          ? "bg-sky-900 bg-opacity-75 text-white"
                          : "bg-white"
                      }
                        relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                      }
                    >
                      {({ active, checked }) => (
                        <>
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <RadioGroup.Label
                                  as="p"
                                  className={`font-medium  ${
                                    checked ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {item.title}
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as="span"
                                  className={`inline ${
                                    checked ? "text-sky-100" : "text-gray-500"
                                  }`}
                                >
                                  <span>
                                    {item.umbrella}/
                                    {item.core ? "Core" : "Optional"}
                                  </span>{" "}
                                  <span aria-hidden="true">&middot;</span>{" "}
                                  <span>{item.created_at.toISOString()}</span>
                                </RadioGroup.Description>
                              </div>
                            </div>
                            {checked && (
                              <div className="shrink-0 text-white">
                                <CheckIcon className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </RadioGroup.Option>
                  )
                )}
              </div>
            </div>
          )
        })}
      </div>
    </RadioGroup>
  )
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

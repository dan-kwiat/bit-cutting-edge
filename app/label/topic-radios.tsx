import { RadioGroup } from "@headlessui/react"
import { Topic, UmbrellaTopics } from "@/lib/db/topic"
import Badge from "@/components/badge"

const colorsOfRainbow = [
  // "bg-red-50 border-red-200",
  "bg-orange-50 border-orange-200",
  "bg-yellow-50 border-yellow-200",
  "bg-green-50 border-green-200",
  "bg-blue-50 border-blue-200",
  "bg-indigo-50 border-indigo-200",
  "bg-purple-50 border-purple-200",
  "bg-pink-50 border-pink-200",
]

export default function TopicRadios({
  umbrellaTopics,
  selected,
  setSelected,
  disabled,
}: {
  umbrellaTopics: UmbrellaTopics
  selected: Topic | null
  setSelected: (topic: Topic) => void
  disabled?: boolean
}) {
  const others = umbrellaTopics["Other"]
  return (
    <RadioGroup value={selected} onChange={setSelected} disabled={disabled}>
      <RadioGroup.Label className="sr-only">Policy Area</RadioGroup.Label>
      <div className="flex justify-end space-x-2">
        {others.map((item, idx) => (
          <RadioGroup.Option
            key={item.id}
            value={item}
            className={({ active, checked, disabled }) =>
              `${
                active
                  ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                  : ""
              }
              ${
                checked
                  ? "bg-sky-900 bg-opacity-75 text-white"
                  : idx === 0
                  ? "bg-white"
                  : "bg-red-50"
              }
              ${disabled ? "opacity-50" : ""}
              font-normal w-full sm:w-auto relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
            }
          >
            {({ active, checked }) => (
              <RadioGroup.Label
                as="p"
                className={checked ? "text-white" : "text-gray-900"}
              >
                {item.title}
              </RadioGroup.Label>
            )}
          </RadioGroup.Option>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-12 gap-1">
        {Object.keys(umbrellaTopics).map((umbrella, idx) => {
          if (umbrella === "Other") {
            return null
          }
          return (
            <div
              key={umbrella}
              className={`col-span-12 sm:col-span-6 lg:col-span-3 p-2 border rounded ${colorsOfRainbow[idx]}`}
            >
              <h2 className="text-lg font-bold text-gray-800 text-center">
                {umbrella}
              </h2>
              <div className="space-y-2 mt-2">
                {umbrellaTopics[umbrella as keyof UmbrellaTopics].map(
                  (item) => (
                    <RadioGroup.Option
                      key={item.id}
                      value={item}
                      className={({ active, checked, disabled }) =>
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
                        ${disabled ? "opacity-50" : ""}
                        h-24 relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                      }
                    >
                      {({ active, checked }) => (
                        <div className="flex items-center">
                          <div className="text-md">
                            <RadioGroup.Label
                              as="p"
                              className={`font-normal  ${
                                checked ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {item.title}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                              as="span"
                              className="absolute bottom-2 right-2"
                            >
                              {item.core ? (
                                <Badge title="Core" color="green" />
                              ) : (
                                <Badge title="Emerging" color="yellow" />
                              )}
                            </RadioGroup.Description>
                          </div>
                        </div>
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

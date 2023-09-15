import { classNames } from "@/lib/format/classNames"
import Link from "next/link"

type ButtonProps = React.ComponentProps<"button">
type LinkProps = React.ComponentProps<typeof Link>

export default function Button(props: ButtonProps | LinkProps) {
  const className = classNames(
    "inline-block cursor-pointer disabled:cursor-not-allowed rounded-md bg-sky-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600",
    props.className || false
  )
  return "href" in props ? (
    <Link {...props} className={className} />
  ) : (
    <button type="button" {...props} className={className} />
  )
}

export default function Main(
  mainProps: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) {
  return (
    <main
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-24 text-gray-500"
      {...mainProps}
    />
  )
}

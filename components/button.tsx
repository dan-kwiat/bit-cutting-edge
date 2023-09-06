export default function Button(
  buttonProps: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <button
      type="button"
      className="rounded-md bg-sky-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
      {...buttonProps}
    />
  )
}

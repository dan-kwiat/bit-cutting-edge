import { getMetadata } from "./meta"
import { expect, test } from "@jest/globals"

test("gets undefined description", async () => {
  const meta = await getMetadata(
    `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body>
    <h1>Your Webpage Title</h1>
  </body>
</html>
`.trim()
  )
  expect(meta.description).toBe(undefined)
})

test("gets meta description", async () => {
  const description = "Description of your webpage"
  const meta = await getMetadata(
    `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="description" content="${description}">
  </head>
  <body>
    <h1>Your Webpage Title</h1>
  </body>
</html>
`.trim()
  )
  expect(meta.description).toBe(description)
})

test("gets og:description contents", async () => {
  const description = "Description of your webpage"
  const meta = await getMetadata(
    `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta property="og:description" content="${description}">
  </head>
  <body>
    <h1>Your Webpage Title</h1>
  </body>
</html>
`.trim()
  )
  expect(meta.description).toBe(description)
})

test("gets article:published_time iso string", async () => {
  const date = new Date("2021-01-01")
  const meta = await getMetadata(
    `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta property="article:published_time" content="${date.toISOString()}">
  </head>
  <body>
    <h1>Your Webpage Title</h1>
  </body>
</html>
`.trim()
  )
  expect(meta.date?.getTime()).toBe(date.getTime())
})

test("gets og:published_time epoch time", async () => {
  const ms = new Date("2023-05-01").getTime()
  const meta = await getMetadata(
    `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta property="article:published_time" content="${Math.floor(0.001 * ms)}">
  </head>
  <body>
    <h1>Your Webpage Title</h1>
  </body>
</html>
`.trim()
  )
  expect(meta.date?.getTime()).toBe(ms)
})

test("gets citation_publication_date", async () => {
  const date = new Date("2021-01-01")
  const meta = await getMetadata(
    `
<!DOCTYPE html>
<html>
  <head>
    <meta name="citation_publication_date" content="${date.toISOString()}">
  </head>
  <body>
    <h1>Your Webpage Title</h1>
  </body>
</html>
`.trim()
  )
  expect(meta.date?.getTime()).toBe(date.getTime())
})

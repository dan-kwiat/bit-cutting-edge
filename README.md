# RSS-AI

## Steps

On a cronjob:

1. Read multiple RSS feeds from different sources
2. Parse the feeds in to js with `rss-parser` (todo: implement this internally
   to reduce bloat?)
3. Filter out URLs which have already been seen i.e. are in our db
4. Filter & classify each item according to domain-specific interests (using
   embedding cosine similarity, or prompting)
5. Persist items into db
6. Refetch data from db to render on static web page, for each category
7. Make it easy for an admin to delete/reclassify items

## Notes on RSS

- Often RSS URLs end with .xml, .rss or .atom but not always
- Are feed items usually chronological vs reverse-chrono? Are they ever random
  date sorted?
# bit-cutting-edge

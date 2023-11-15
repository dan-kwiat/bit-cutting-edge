# BIT Cutting Edge

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

## Installation

```
cp .env.example .env
pnpm install
```

## DB setup

1. `pnpm run migrate-latest` - creates db tables
2. `pnpm run seed_db` - inserts sources & topics
3. `pnpm run pull_sources` - reads feeds from sources and inserts articles

## DB updates

1. Create a migration file (alphabetical order)
2. Run the migration (check it works going back down too)
3. `pnpm run generate_db_types` to update typescript types in
   [/lib/db/db.d.ts](/lib/db/db.d.ts)

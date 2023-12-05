# BIT Cutting Edge

For a higher-level overview of this tool, see [./ABOUT.md](./ABOUT.md)

## Requirements

NodeJS and pnpm

## Installation

```bash
cp .env.example .env
cp .env.example .env.local
pnpm install
```

Update the values in both [./.env](./.env) and [./.env.local](./.env.local).

## DB setup

We're using a Neon Postgres database via Vercel:

https://vercel.com/integrations/neon

This relies on the `pg_embedding` extension which is now deprecated and should
be replaced with `pgvector`. See migration guide here -
https://neon.tech/docs/extensions/pg_embedding - contents of this page have been
copied to [./pg_embedding_migration.txt](./pg_embedding_migration.txt) for
posterity.

1. `pnpm run migrate-latest` - creates db tables
2. `pnpm run seed_db` - inserts sources & topics
3. `pnpm run pull_sources` - reads feeds from sources and inserts articles

## DB migrations

To make changes to the database schema:

1. Create a migration file in [./migrations](./migrations) (alphabetical order)
2. Run the migration with `pnpm run migrate-latest` (check it works going back
   down too with `pnpm run migrate-down`)
3. `pnpm run generate_db_types` to auto update typescript types in
   [/lib/db/db.d.ts](/lib/db/db.d.ts)

## Pull & classify articles

### `pnpm run run_script scripts/pull-sources.ts`

Pull new articles from all journals

### `pnpm run run_script scripts/classify-articles-with-prompt.ts`

This classifies the latest 10 articles using GPT-4 (zero-shot).

## Run the web app locally

```bash
pnpm run dev
```

## Build for deployment

Easiest way is via vercel github integration (automatically deploys on each
commit).

Can also build for prod using `pnpm run build`.

## Other scripts:

Some of these might be useful during development

#### get-and-persist-embeddings.ts

This embeds the article title + description and saves to database. Note that
`pull-sources` already does this, so you shouldn't need to use
`get-and-persist-embeddings`.

#### count-articles-by-source.ts

#### count-errata.ts

#### count-labels-by-date.ts

#### count-labels-by-topic.ts

## Challenges

- Volume of articles from rss feeds is quite low, to the extent that human
  labelling might be more appropriate
- There is a lot of variation between rss sources e.g. item description lengths

## Articles by source

American Economic Review dominates, but mainly because it goes back further.

```json
[
  { "title": "American Economic Review", "count": "671" },
  { "title": "Social Psychology and Personality Science", "count": "72" },
  {
    "title": "Journal of Articles in support of the Null Hypothesis",
    "count": "53"
  },
  { "title": "Cognition", "count": "51" },
  {
    "title": "Journal of Behavioral and Experimental Economics",
    "count": "46"
  },
  { "title": "Journal of Behavioural Decision Making", "count": "45" },
  { "title": "Judgment & Decision Making", "count": "31" },
  { "title": "World Bank Blogs", "count": "30" },
  { "title": "The 20% statistician (methods)", "count": "25" },
  { "title": "Jason Collins (Academic & Consultant)", "count": "20" },
  { "title": "Behavioural Public Policy", "count": "18" },
  { "title": "Psychological Science (APS)", "count": "17" },
  { "title": "Journal of Economic Psychology", "count": "16" },
  { "title": "Behavioural Science & Policy Association", "count": "12" },
  { "title": "The Behavioural Scientist", "count": "10" },
  { "title": "BE Hub", "count": "10" },
  { "title": "J-PAL", "count": "8" },
  { "title": "Nature: Human Behaviour", "count": "8" },
  { "title": "APA Psychological Bulletin", "count": "4" },
  { "title": "Quaterly Journal of Economics", "count": "1" }
]
```

In the period Aug 2022 - Aug 2023:

```
72 articles: Social Psychology and Personality Science
50 articles: American Economic Review
45 articles: Journal of Behavioural Decision Making
31 articles: Judgment & Decision Making
30 articles: World Bank Blogs
17 articles: Psychological Science (APS)
10 articles: BE Hub
10 articles: The Behavioural Scientist
8 articles: Nature: Human Behaviour
8 articles: Behavioural Public Policy
8 articles: J-PAL
4 articles: The 20% statistician (methods)
4 articles: APA Psychological Bulletin
3 articles: Jason Collins (Academic & Consultant)
2 articles: Journal of Articles in support of the Null Hypothesis
1 articles: Quaterly Journal of Economics
0 articles: Behavioural Science & Policy Association
```

## Zero-shot classification costs

`gpt-4-0613, 110 requests: 34,654 prompt + 110 completion = 34,764 tokens`

- Roughly 300 tokens per zero-shot prompt classification (with description field
  capped at 1000 chars)
- $0.03/1k input tokens for GPT4 8k (we assume output is negligible for
  classification task)
- Therefore roughly $1 to zero-shot classify 100 samples

## Embedding classification costs

Embedding 1000 docs `$0.0001/1k tokens * 0.3k tokens * 1000 docs` = `$0.03`

**Embedding is 300 times cheaper than gpt4 8k for classification** (not taking
into account cost of vector db)

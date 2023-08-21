import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type TopicUmbrella = "Cross-cutting" | "Economy" | "HASED" | "Health & Wellbeing" | "IP";

export interface Article {
  id: Generated<number>;
  content: string | null;
  contentSnippet: string | null;
  creator: string | null;
  guid: string | null;
  isoDate: Timestamp | null;
  link: string;
  pubDate: Timestamp | null;
  title: string | null;
  summary: string | null;
  source_id: number;
  topic_id: number | null;
  created_at: Generated<Timestamp>;
}

export interface Source {
  id: Generated<number>;
  title: string;
  type: string | null;
  url_home: string;
  url_feed: string | null;
  url_rss: string | null;
  update_frequency: string | null;
  last_checked: Timestamp | null;
  last_pulled: Timestamp | null;
  geo_region: string | null;
  open_access: boolean | null;
  notes: string | null;
  created_at: Generated<Timestamp>;
}

export interface Topic {
  id: Generated<number>;
  umbrella: TopicUmbrella;
  title: string;
  core: boolean;
  notes: string | null;
  created_at: Generated<Timestamp>;
}

export interface DB {
  article: Article;
  source: Source;
  topic: Topic;
}

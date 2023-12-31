import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type TopicUmbrella = "Cross-cutting" | "Economy" | "HASED" | "Health & Wellbeing" | "IP" | "Other";

export interface Article {
  id: Generated<number>;
  description_meta: string | null;
  categories: string[] | null;
  content: string | null;
  content_snippet: string | null;
  creator: string | null;
  guid: string | null;
  date: Timestamp | null;
  image: string | null;
  link: string;
  title: string | null;
  summary: string | null;
  source_id: number;
  topic_id: number | null;
  reserved_at: Timestamp | null;
  labelled_at: Timestamp | null;
  reserved_by_email: string | null;
  created_at: Generated<Timestamp>;
  embedding_title_desc: number[];
}

export interface ArticleTopicZeroShot {
  id: Generated<number>;
  article_id: number;
  topic_id: number;
  created_at: Generated<Timestamp>;
}

export interface Feedback {
  id: Generated<number>;
  participant_name: string | null;
  useful: boolean;
  filters: boolean;
  more_useful: string | null;
  comments: string | null;
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
  article_topic_zero_shot: ArticleTopicZeroShot;
  feedback: Feedback;
  source: Source;
  topic: Topic;
}

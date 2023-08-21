require("dotenv").config({ path: ".env" })
import { TopicNew, insertTopics } from "../lib/db/topic"

const TOPICS: Array<TopicNew> = [
  { umbrella: "HASED", title: "Education", core: true, notes: "" },
  { umbrella: "HASED", title: "Early Years", core: true, notes: "" },
  {
    umbrella: "HASED",
    title: "Home Affairs & Security",
    core: true,
    notes: "",
  },
  {
    umbrella: "HASED",
    title: "Social Capital and Cohesion",
    core: true,
    notes: "Overlaps with IP Peacebuilding & Social Cohesion",
  },
  { umbrella: "HASED", title: "Social mobility", core: false, notes: "" },
  {
    umbrella: "HASED",
    title: "Digital/tech interventions",
    core: false,
    notes: "",
  },
  { umbrella: "IP", title: "International Development", core: true, notes: "" },
  {
    umbrella: "IP",
    title: "International Development Capacity Building",
    core: true,
    notes: "Reflects nature of the work rather than policy area",
  },
  { umbrella: "IP", title: "Conflict", core: true, notes: "" },
  {
    umbrella: "IP",
    title: "Violence against Women and Girls",
    core: true,
    notes: "",
  },
  {
    umbrella: "IP",
    title: "Peacebuilding & social cohesion",
    core: false,
    notes: "Overlaps with HASED Social Capital & Social Cohesion",
  },
  {
    umbrella: "IP",
    title: "EMEA expansion",
    core: false,
    notes: "Not sure this reflects external work or internal strategy",
  },
  {
    umbrella: "Economy",
    title: "Energy & Sustainability",
    core: true,
    notes: "",
  },
  {
    umbrella: "Economy",
    title: "Consumer & Business Markets",
    core: true,
    notes: "",
  },
  {
    umbrella: "Economy",
    title: "Labour Markets & Household finances",
    core: true,
    notes: "",
  },
  {
    umbrella: "Economy",
    title: "Equality, Diversity & Inclusion",
    core: true,
    notes: "",
  },
  {
    umbrella: "Economy",
    title: "Leveling Up & Regional Growth",
    core: false,
    notes: "",
  },
  { umbrella: "Health & Wellbeing", title: "Health", core: true, notes: "" },
  {
    umbrella: "Health & Wellbeing",
    title: "Mental Health & Wellbeing",
    core: true,
    notes: "",
  },
  {
    umbrella: "Health & Wellbeing",
    title: "Social Care",
    core: true,
    notes: "",
  },
  {
    umbrella: "Health & Wellbeing",
    title: "Homelessness",
    core: false,
    notes: "",
  },
  {
    umbrella: "Health & Wellbeing",
    title: "Loneliness",
    core: false,
    notes: "",
  },
  { umbrella: "Cross-cutting", title: "AI and BI", core: false, notes: "" },
  {
    umbrella: "Cross-cutting",
    title: "Methods innovation",
    core: false,
    notes: "",
  },
]

async function seed() {
  console.log("Inserting data...")
  await insertTopics(TOPICS)
  console.log("Done!")
}

seed()

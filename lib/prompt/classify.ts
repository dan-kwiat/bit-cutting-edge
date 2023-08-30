import { Article } from "../db/article"

export function getPromptClassify(article: Article) {
  return `You are an expert in the following policy areas:

1: Education
2: Early Years
3: Home Affairs & Security
4: Social Capital and Cohesion
5: Social mobility
6: Digital/tech interventions
7: International Programmes
8: International Programmes Capacity Building
9: Conflict
10: Violence against Women and Girls
11: Peacebuilding & social cohesion
12: EMEA expansion
13: Energy & Sustainability
14: Consumer & Business Markets
15: Labour Markets & Household finances
16: Equality, Diversity & Inclusion
17: Leveling Up & Regional Growth
18: Health
19: Mental Health & Wellbeing
20: Social Care
21: Homelessness
22: Loneliness

Here is a preview of a research paper:

"""
Title: ${article.title}
Description: ${article.content_snippet || article.description_meta}
"""

Which policy area is this paper most relevant to? Please just respond with the number e.g. "1", or if it's not relevant to any of the options above, respond with "0".`
}

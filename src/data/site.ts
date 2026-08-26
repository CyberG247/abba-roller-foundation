/**
 * Central content source for the Abba Roller Foundation site.
 *
 * Every collection here is shaped so it can be swapped for a CMS / database
 * read later without touching presentation code. Fields marked `CMS_PLACEHOLDER`
 * intentionally contain no invented figures.
 */

import campaignPadUp from "@/assets/campaign-padup.jpg";
import programAdvocacy from "@/assets/program-advocacy.jpg";
import programFood from "@/assets/program-food.jpg";
import programSkills from "@/assets/program-skills.jpg";
import programYouth from "@/assets/program-youth.jpg";

export const CMS_PLACEHOLDER = "—" as const;

export const org = {
  name: "Abba Roller Foundation",
  shortName: "ARF",
  tagline: "Empowering youth and women. Strengthening communities.",
  description:
    "Abba Roller Foundation (ARF) is a nonprofit dedicated to empowering youth & women through education, skills training, food aid, support.",
  country: "Nigeria",
  /** Contact details awaiting confirmation from the organisation. */
  email: "info@abbarollerfoundation.org",
  phone: CMS_PLACEHOLDER,
  address: CMS_PLACEHOLDER,
  /** Only official, confirmed accounts should be listed here. */
  socials: [] as { label: string; href: string }[],
};

export type Program = {
  slug: string;
  title: string;
  icon: "women" | "youth" | "education" | "food" | "advocacy";
  summary: string;
  image: string;
  imageAlt: string;
  focus: string[];
  body: string[];
};

export const programs: Program[] = [
  {
    slug: "women-and-girls-empowerment",
    title: "Women & Girls Empowerment",
    icon: "women",
    summary:
      "Initiatives supporting women's participation, dignity, wellbeing and access to opportunity.",
    image: programAdvocacy,
    imageAlt: "A woman addressing a gathering of women at a community meeting in Nigeria",
    focus: ["Dignity & wellbeing", "Girl-child development", "Economic participation"],
    body: [
      "Women and girls carry much of the weight of community life, yet they are often the last to be resourced. Our work in this area is built on a simple conviction: when a woman is supported with dignity, an entire household and community moves forward with her.",
      "We work through community-led sensitisation, practical support and follow-up engagement, so that participation is not a one-off event but a sustained relationship with the communities we serve.",
    ],
  },
  {
    slug: "youth-empowerment",
    title: "Youth Empowerment",
    icon: "youth",
    summary:
      "Education, skills development, mentorship and opportunity pathways for young people.",
    image: programYouth,
    imageAlt: "Young Nigerian people seated in a circle during an outdoor mentorship session",
    focus: ["Mentorship", "Career pathways", "Civic participation"],
    body: [
      "Nigeria's young population is its greatest asset. ARF focuses on the practical gap between potential and opportunity — guidance, mentorship, and access to learning that helps young people make their next decision with confidence.",
      "Programmes are designed with young people rather than for them, and are structured so that participants can continue to engage as mentors and volunteers themselves.",
    ],
  },
  {
    slug: "education-and-skills-development",
    title: "Education & Skills Development",
    icon: "education",
    summary:
      "Practical learning and capacity-building initiatives designed to improve opportunity.",
    image: programSkills,
    imageAlt: "A young woman working at a sewing machine in a vocational training workshop",
    focus: ["Vocational training", "Learning support", "Capacity building"],
    body: [
      "Skills that translate directly into livelihood remain one of the most reliable routes out of vulnerability. Our education and skills work concentrates on training that participants can put to use immediately in their own communities.",
      "We prioritise depth over reach: smaller cohorts, clear outcomes, and follow-up support after training concludes.",
    ],
  },
  {
    slug: "humanitarian-and-food-support",
    title: "Humanitarian & Food Support",
    icon: "food",
    summary:
      "Support for vulnerable individuals and communities through humanitarian assistance.",
    image: programFood,
    imageAlt: "A volunteer handing food staples to an elderly woman at a community distribution",
    focus: ["Food aid", "Emergency response", "Household support"],
    body: [
      "Humanitarian support is delivered where immediate need is greatest, and always in a manner that protects the dignity of the person receiving it. Distribution is coordinated with community leaders to reach households that are most often overlooked.",
      "Relief is treated as the beginning of a relationship, not the end of one — recipients are connected onward to our empowerment and skills programmes wherever possible.",
    ],
  },
  {
    slug: "health-and-social-advocacy",
    title: "Health & Social Advocacy",
    icon: "advocacy",
    summary:
      "Community sensitisation, awareness and advocacy on issues affecting vulnerable populations.",
    image: campaignPadUp,
    imageAlt: "A health educator speaking to schoolgirls during a menstrual health session",
    focus: ["Menstrual health", "Period poverty", "Community sensitisation"],
    body: [
      "Advocacy is how change outlives a single intervention. ARF works on the awareness, stigma and information gaps that keep people — particularly girls and women — from accessing what they are entitled to.",
      "Menstrual health awareness and period poverty reduction are a central strand of this work, delivered through school and community sensitisation.",
    ],
  },
];

export type Campaign = {
  slug: string;
  title: string;
  kicker: string;
  location: string;
  status: "Active" | "Completed" | "Upcoming";
  summary: string;
  image: string;
  imageAlt: string;
  activities: string[];
  body: string[];
};

export const campaigns: Campaign[] = [
  {
    slug: "pad-up-nigerian-girls",
    title: "Pad Up Nigerian Girls",
    kicker: "Menstrual health & girl-child empowerment",
    location: "Gumel Local Government Area, Jigawa State",
    status: "Active",
    summary:
      "A menstrual health education and sensitisation initiative working to reduce period poverty and break the stigma that keeps girls out of school.",
    image: campaignPadUp,
    imageAlt:
      "A health educator holding a sanitary pad while speaking to a classroom of Nigerian schoolgirls",
    activities: [
      "Menstrual health education",
      "Community sensitisation",
      "Distribution of sanitary supplies",
      "Breaking menstrual stigma",
      "Community engagement",
      "Period poverty awareness",
    ],
    body: [
      "For too many girls in Nigeria, menstruation is a monthly interruption to education. The cost of sanitary products, combined with silence and stigma around menstrual health, means days of school missed every month — and, over years, a widening gap in confidence and attainment.",
      "Pad Up Nigerian Girls addresses both sides of that problem at once: accurate, age-appropriate menstrual health education delivered in person, alongside the distribution of sanitary supplies so that knowledge is matched with practical means.",
      "According to the campaign material supplied by the Foundation, a sensitisation campaign for young girls was carried out in Gumel Local Government Area, Jigawa State, with the distribution of over 1,000 sanitary pads.",
      "The initiative continues to expand through partnership with schools, community leaders and volunteers. Documentation from each outreach is published here as it becomes available.",
    ],
  },
];

export type Story = {
  slug: string;
  title: string;
  category: "Campaign Update" | "Community Story" | "Announcement" | "Event";
  date: string;
  author: string;
  readingTime: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  body: string[];
};

export const stories: Story[] = [
  {
    slug: "pad-up-nigerian-girls-reaches-gumel",
    title: "Pad Up Nigerian Girls reaches schoolgirls in Gumel, Jigawa State",
    category: "Campaign Update",
    date: "2026-06-18",
    author: "ARF Communications",
    readingTime: "4 min read",
    excerpt:
      "A sensitisation campaign on menstrual health, delivered alongside the distribution of over 1,000 sanitary pads to young girls in Gumel Local Government Area.",
    image: campaignPadUp,
    imageAlt: "A health educator speaking with schoolgirls during a menstrual health session",
    body: [
      "Abba Roller Foundation carried out a menstrual health sensitisation campaign for young girls in Gumel Local Government Area, Jigawa State, under its Pad Up Nigerian Girls initiative.",
      "The session combined age-appropriate menstrual health education with open conversation about the stigma that surrounds menstruation in many communities, and concluded with the distribution of over 1,000 sanitary pads to participants.",
      "## Why this work matters",
      "Period poverty is rarely discussed as an education issue, but it is one. When a girl cannot manage her period safely and privately, she stays home. Repeated across a school term, those absences compound into lost learning and lost confidence.",
      "## What comes next",
      "The Foundation is working with schools, community leaders and volunteers to extend the initiative to further communities. Documentation and outcomes from each outreach will be published as they are confirmed.",
    ],
  },
  {
    slug: "why-skills-training-changes-households",
    title: "Why skills training changes households, not just individuals",
    category: "Community Story",
    date: "2026-05-02",
    author: "ARF Programmes Team",
    readingTime: "3 min read",
    excerpt:
      "A reflection from our education and skills work on why practical, immediately usable training remains one of the most reliable routes out of vulnerability.",
    image: programSkills,
    imageAlt: "A young woman working at a sewing machine during vocational training",
    body: [
      "Ask a participant what changed after a training programme and the answer is almost never about the certificate. It is about what the skill made possible at home.",
      "That is why our education and skills work concentrates on training that can be applied immediately, in the participant's own community, with tools and materials that are locally available.",
      "## Depth over reach",
      "Smaller cohorts allow us to follow up after training concludes — the point at which most programmes quietly end and most participants most need support.",
    ],
  },
  {
    slug: "how-we-approach-humanitarian-support",
    title: "How we approach humanitarian support with dignity",
    category: "Announcement",
    date: "2026-03-14",
    author: "ARF Communications",
    readingTime: "3 min read",
    excerpt:
      "Relief work carries a risk: that the person receiving support becomes a subject rather than a participant. Here is how we work to avoid it.",
    image: programFood,
    imageAlt: "A volunteer handing food staples to a woman at a community distribution",
    body: [
      "Humanitarian assistance is often photographed badly and delivered impersonally. Both failures come from the same place — treating people as recipients rather than participants.",
      "ARF coordinates distribution with community leaders, so that households most often overlooked are reached, and so that the process is accountable to the community itself.",
      "## Relief as a starting point",
      "Wherever possible, people supported through food and humanitarian aid are connected onward to our skills and empowerment programmes.",
    ],
  },
];

/**
 * Impact metrics. Values are intentionally placeholders until the Foundation
 * supplies verified figures — never substitute an invented number here.
 */
export type ImpactMetric = { label: string; value: string; note?: string };

export const impactMetrics: ImpactMetric[] = [
  { label: "Communities reached", value: CMS_PLACEHOLDER },
  { label: "Young people empowered", value: CMS_PLACEHOLDER },
  { label: "Women supported", value: CMS_PLACEHOLDER },
  { label: "Training participants", value: CMS_PLACEHOLDER },
];

export const verifiedFigures: ImpactMetric[] = [
  {
    label: "Sanitary pads distributed",
    value: "1,000+",
    note: "Pad Up Nigerian Girls, Gumel LGA, Jigawa State",
  },
];

export const values = [
  {
    title: "Empowerment",
    body: "Creating pathways for people to build better futures.",
  },
  {
    title: "Dignity",
    body: "Supporting people with respect, compassion and humanity.",
  },
  {
    title: "Inclusion",
    body: "Ensuring vulnerable and underserved communities are not left behind.",
  },
  {
    title: "Integrity",
    body: "Operating with transparency, accountability and responsibility.",
  },
  {
    title: "Collaboration",
    body: "Working with communities, partners and institutions to create meaningful impact.",
  },
  {
    title: "Sustainability",
    body: "Focusing on interventions that create lasting value.",
  },
];

export const involvementOptions = [
  {
    title: "Volunteer",
    body: "Give your time, skills and energy to community programmes and outreach.",
    cta: "Apply to volunteer",
    to: "/volunteer",
  },
  {
    title: "Partner With Us",
    body: "Collaborate with ARF on meaningful community initiatives and shared programmes.",
    cta: "Discuss a partnership",
    to: "/partners",
  },
  {
    title: "Support Our Work",
    body: "Contribute resources to help expand programmes and reach more communities.",
    cta: "Support ARF",
    to: "/donate",
  },
  {
    title: "Advocate",
    body: "Help raise awareness of the social issues affecting the communities we serve.",
    cta: "Share the mission",
    to: "/stories",
  },
] as const;

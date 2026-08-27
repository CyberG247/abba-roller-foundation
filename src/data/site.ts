/**
 * Central content source for the Abba Roller Foundation site.
 *
 * Every collection here is shaped so it can be swapped for a CMS / database
 * read later without touching presentation code. Fields marked `CMS_PLACEHOLDER`
 * intentionally contain no invented figures.
 */

import campaignPadUp from "@/assets/campaign-padup.jpg";
import correctionalCentreOutreach from "@/assets/correctional-centre-outreach.jpg";
import founderPortrait from "@/assets/founder-portrait.jpg";
import gumelHospitalOutreach from "@/assets/gumel-hospital-outreach.jpg";
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
    summary: "Education, skills development, mentorship and opportunity pathways for young people.",
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
    summary: "Support for vulnerable individuals and communities through humanitarian assistance.",
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
  imagePosition?: string;
  body: string[];
};

export const stories: Story[] = [
  {
    slug: "custodial-centre-humanitarian-food-support",
    title: "Extending dignity: Food relief outreach to inmates at the Custodial Centre",
    category: "Community Story",
    date: "2026-08-15",
    author: "ARF Humanitarian Desk",
    readingTime: "3 min read",
    excerpt:
      "Hon. Usman Aminu Usman (Abba Roller) and the Foundation delegation delivered essential food provisions and nutritional staples to support inmates at the Nigerian Correctional Service Custodial Centre.",
    image: correctionalCentreOutreach,
    imageAlt:
      "Hon. Usman Aminu Usman (Abba Roller) and Foundation delegates presenting food provisions to Nigerian Correctional Service officials",
    imagePosition: "object-[center_15%]",
    body: [
      "In accordance with the Abba Roller Foundation’s foundational principle that no human being should be forgotten or left behind, Founder & Chairman Hon. Usman Aminu Usman led a humanitarian outreach to the Nigerian Correctional Service (NCoS) Custodial Centre in Jigawa State.",
      "The Foundation delegation provided substantial supplies of staple foodstuffs — including cartons of nutritious pasta and food parcels — specifically coordinated with custodial facility command to supplement inmate sustenance.",
      "## Restoring Dignity Across All Spheres of Society",
      "Individuals in correctional facilities represent one of the most overlooked demographics in social welfare initiatives. The Foundation believes that compassionate support, adequate nutrition, and human dignity are unconditional values that must reach every person.",
      "## Accountable Institutional Collaboration",
      "Working in close collaboration with custodial officers and facility administrators, the Foundation ensured a structured, transparent, and direct handover of provisions. ARF remains committed to continuous community-wide humanitarian interventions that uplift the vulnerable throughout Nigeria.",
    ],
  },
  {
    slug: "gumel-hospital-medical-relief-and-sanitation-outreach",
    title: "Hospital outreach and sanitation intervention at Gumel General Hospital",
    category: "Campaign Update",
    date: "2026-08-20",
    author: "ARF Communications",
    readingTime: "3 min read",
    excerpt:
      "Hon. Usman Aminu Usman (Abba Roller) and the Foundation delegation visited Gumel General Hospital to defray medical bills for indigent patients and donate vital sanitation supplies.",
    image: gumelHospitalOutreach,
    imageAlt:
      "Hon. Usman Aminu Usman and Foundation team presenting cleaning supplies and patient support outside Gumel General Hospital",
    body: [
      "Hon. Usman Aminu Usman (Abba Roller) led an official humanitarian delegation to Gumel General Hospital in Jigawa State, extending direct financial relief to vulnerable patients unable to defray their medical bills.",
      "Beyond providing immediate financial assistance to ensure indigent patients could access necessary care without distress, the Foundation presented essential sanitation supplies and conducted an on-site assessment of hospital hygiene facilities.",
      "## Relieving the Burden of Healthcare Costs",
      "No patient should face deepened distress simply because they cannot afford clinical treatment. By settling overdue medical liabilities and hospital fees directly, the Foundation restored hope and dignity to affected families in Gumel.",
      "## Strengthening Clinical Hygiene and Patient Safety",
      "Cleanliness in healthcare environments is a frontline requirement for infection prevention. The Foundation supplied brooms, buckets, disinfectants, and specialized cleaning detergents to support hospital staff, while evaluating ongoing sanitary needs to help safeguard patients from preventable hospital-acquired complications.",
      "Abba Roller Foundation remains committed to hands-on, accountable interventions that directly enhance community wellbeing across Nigeria.",
    ],
  },
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

/* ------------------------------------------------------------ media & updates */

export type UpdateCategory =
  | "Food Distribution"
  | "Financial Support"
  | "Empowerment"
  | "Pad Disbursement"
  | "Education & Skills"
  | "Humanitarian Support"
  | "Community Advocacy";

export type Update = {
  id: string;
  title: string;
  category: UpdateCategory;
  /** ISO date, or CMS_PLACEHOLDER where the Foundation has not confirmed a date. */
  date: string;
  location: string;
  summary: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  /** Confirmed detail only — never an invented figure. */
  highlights: string[];
};

export const updateCategories: UpdateCategory[] = [
  "Food Distribution",
  "Financial Support",
  "Empowerment",
  "Pad Disbursement",
  "Education & Skills",
  "Humanitarian Support",
  "Community Advocacy",
];

export const updates: Update[] = [
  {
    id: "correctional-centre-food-distribution",
    title: "Humanitarian food relief & nutritional support at Custodial Centre",
    category: "Food Distribution",
    date: "2026-08-15",
    location: "Nigerian Correctional Service (NCoS) Custodial Centre, Jigawa State",
    summary:
      "Hon. Usman Aminu Usman (Abba Roller) and the Foundation delegation conducted a humanitarian outreach to the Nigerian Correctional Service Custodial Centre, presenting cartons of pasta and vital food provisions to support inmate nutrition and reinforce our commitment to universal human dignity.",
    image: correctionalCentreOutreach,
    imageAlt:
      "Hon. Usman Aminu Usman and Foundation delegates presenting food provisions to Nigerian Correctional Service officials",
    imagePosition: "object-[center_15%]",
    highlights: [
      "Distribution of bulk food items and pasta cartons for inmates",
      "Official coordination with Nigerian Correctional Service (NCoS) leadership",
      "Upholding compassionate care, basic nutrition, and universal dignity",
    ],
  },
  {
    id: "gumel-hospital-medical-relief-hygiene",
    title: "Medical bill relief & clinical hygiene intervention at Gumel General Hospital",
    category: "Humanitarian Support",
    date: "2026-08-20",
    location: "Gumel General Hospital, Jigawa State",
    summary:
      "Hon. Usman Aminu Usman (Abba Roller) led a humanitarian outreach to Gumel General Hospital, providing financial assistance to settle outstanding medical bills for vulnerable patients and donating vital sanitation provisions to elevate hospital hygiene and infection control standards.",
    image: gumelHospitalOutreach,
    imageAlt:
      "Hon. Usman Aminu Usman and Foundation team presenting cleaning supplies and patient support outside Gumel General Hospital",
    imagePosition: "object-[center_20%]",
    highlights: [
      "Direct settlement of hospital and medical bills for indigent patients",
      "Donation of essential cleaning utilities, disinfectants, and sanitation materials",
      "Facility assessment to identify critical hygiene requirements and protect patient safety",
    ],
  },
  {
    id: "pad-disbursement-gumel",
    title: "Pad disbursement and menstrual health sensitisation in Gumel",
    category: "Pad Disbursement",
    date: "2026-06-18",
    location: "Gumel LGA, Jigawa State",
    summary:
      "Under the Pad Up Nigerian Girls initiative, ARF held a menstrual health sensitisation session for young girls and disbursed sanitary pads to participants.",
    image: campaignPadUp,
    imageAlt: "A health educator speaking with schoolgirls during a menstrual health session",
    highlights: [
      "Over 1,000 sanitary pads distributed",
      "Age-appropriate menstrual health education",
      "Open conversation on menstrual stigma",
    ],
  },
  {
    id: "food-distribution-households",
    title: "Food distribution to vulnerable households",
    category: "Food Distribution",
    date: CMS_PLACEHOLDER,
    location: "Community distribution — location to be confirmed",
    summary:
      "Food staples distributed to households identified with community leaders, prioritising elderly residents, widows and families carrying the heaviest need.",
    image: programFood,
    imageAlt: "A volunteer handing food staples to an elderly woman at a community distribution",
    highlights: [
      "Beneficiary list drawn up with community leaders",
      "Distribution handled to protect the dignity of every recipient",
      "Households connected onward to empowerment programmes",
    ],
  },
  {
    id: "financial-support-petty-trade",
    title: "Financial support for women in petty trade",
    category: "Financial Support",
    date: CMS_PLACEHOLDER,
    location: "Location to be confirmed",
    summary:
      "Direct financial support provided to women running small trades, so that working capital is restored and daily income can be sustained.",
    image: programAdvocacy,
    imageAlt: "A woman addressing a gathering of women at a community meeting in Nigeria",
    highlights: [
      "Support directed at existing, active trades",
      "Follow-up engagement after disbursement",
      "Amounts and beneficiary numbers published once verified",
    ],
  },
  {
    id: "women-empowerment-outreach",
    title: "Women's empowerment outreach and sensitisation",
    category: "Empowerment",
    date: CMS_PLACEHOLDER,
    location: "Location to be confirmed",
    summary:
      "A community gathering focused on women's participation, wellbeing and access to opportunity, delivered with local women's leaders.",
    image: programAdvocacy,
    imageAlt: "Women gathered at a community empowerment session in Nigeria",
    highlights: [
      "Led together with community women's leaders",
      "Pathways into skills training explained",
      "Ongoing engagement rather than a one-off event",
    ],
  },
  {
    id: "youth-mentorship-session",
    title: "Youth mentorship and guidance session",
    category: "Empowerment",
    date: CMS_PLACEHOLDER,
    location: "Location to be confirmed",
    summary:
      "Young people met with mentors for guidance on education, career pathways and civic participation, with participants invited to return as volunteers.",
    image: programYouth,
    imageAlt: "Young Nigerian people seated in a circle during an outdoor mentorship session",
    highlights: [
      "Mentorship on next-step decisions",
      "Volunteer pathway opened to participants",
      "Designed with young people, not for them",
    ],
  },
  {
    id: "skills-training-cohort",
    title: "Vocational skills training cohort",
    category: "Education & Skills",
    date: CMS_PLACEHOLDER,
    location: "Location to be confirmed",
    summary:
      "A practical training cohort covering skills participants can apply immediately in their own communities, with follow-up after training concludes.",
    image: programSkills,
    imageAlt: "A young woman working at a sewing machine in a vocational training workshop",
    highlights: [
      "Small cohort, clear outcomes",
      "Locally available tools and materials",
      "Post-training follow-up support",
    ],
  },
  {
    id: "humanitarian-relief-response",
    title: "Humanitarian relief for families in immediate need",
    category: "Humanitarian Support",
    date: CMS_PLACEHOLDER,
    location: "Location to be confirmed",
    summary:
      "Emergency household support delivered where need was most acute, coordinated with community structures for accountability.",
    image: programFood,
    imageAlt: "Volunteers preparing relief items for distribution",
    highlights: [
      "Coordinated with community leadership",
      "Reaches households most often overlooked",
      "Relief treated as the start of a relationship",
    ],
  },
  {
    id: "health-advocacy-sensitisation",
    title: "Community health and social advocacy sensitisation",
    category: "Community Advocacy",
    date: CMS_PLACEHOLDER,
    location: "Location to be confirmed",
    summary:
      "Awareness sessions addressing the information and stigma gaps that keep women and girls from accessing what they are entitled to.",
    image: campaignPadUp,
    imageAlt: "A health educator speaking to a community group during an advocacy session",
    highlights: [
      "Focus on stigma and information gaps",
      "Delivered in schools and community settings",
      "Feeds directly into programme design",
    ],
  },
];

/* ----------------------------------------------------------- founder's desk */

export const founder = {
  name: "Hon. Usman Aminu Usman",
  alias: "Abba Roller",
  role: "Founder & Chairman, Abba Roller Foundation",
  initials: "UAU",
  image: founderPortrait,
  location: "Nigeria",
  portraitAlt: "Portrait of Hon. Usman Aminu Usman (Abba Roller), Founder of ARF",
  lede: "The Foundation began with a conviction rather than a structure: that no one should be left behind simply because nobody came looking for them.",
  message: [
    "Abba Roller Foundation was established out of a personal commitment to the young people and women of our communities — people full of capability who have too often been overlooked when resources are shared.",
    "Our approach is deliberately close to the ground. We sit with community leaders, we listen before we plan, and we deliver support in a way that protects the dignity of every person who receives it. Whether it is food reaching a household, financial support restoring a woman's small trade, a young person finding direction through mentorship, or a girl receiving sanitary pads and honest health education — the intention is the same: to restore dignity and open a door.",
    "We also hold ourselves to honesty in what we report. We publish what has been verified and we say plainly when a figure is still being confirmed. Trust is built slowly, and we would rather earn it than claim it.",
    "To everyone who has volunteered, partnered or given — thank you. The work ahead is larger than any one of us, and there is room for you in it.",
  ],
  focusAreas: [
    "Youth and women empowerment",
    "Humanitarian and food support",
    "Education and skills development",
    "Health advocacy and period poverty",
  ],
  /** Biography details awaiting confirmation from the Foundation — never invented. */
  profile: [
    { label: "Full name", value: "Hon. Usman Aminu Usman" },
    { label: "Popularly known as", value: "Abba Roller" },
    { label: "Position", value: "Founder & Chairman, Abba Roller Foundation" },
    { label: "State of origin", value: CMS_PLACEHOLDER },
    { label: "Education", value: CMS_PLACEHOLDER },
    { label: "Public service", value: CMS_PLACEHOLDER },
    { label: "Professional background", value: CMS_PLACEHOLDER },
  ],
};

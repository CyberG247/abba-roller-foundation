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
import weeklyFoodMeals from "@/assets/weekly-food-distribution-meals.jpg";
import weeklyFoodBeneficiaries from "@/assets/weekly-food-distribution-beneficiaries.jpg";
import ramadanFoodPackages from "@/assets/ramadan-food-packages-10-states.jpg";
import visuallyImpairedSchoolDutse1 from "@/assets/visually-impaired-school-dutse-1.jpg";
import footballTournamentTrophyPresentation from "@/assets/football-tournament-trophy-presentation.jpg";

export const CMS_PLACEHOLDER = "—" as const;

export const org = {
  name: "Abba Roller Foundation",
  shortName: "ARF",
  tagline: "Empowering youth and women. Strengthening communities.",
  description:
    "Abba Roller Foundation (ARF) is a nonprofit dedicated to empowering youth & women through education, skills training, food aid, support.",
  country: "Nigeria",
  url: "https://arffoundation.org",
  /** Contact details awaiting confirmation from the organisation. */
  email: "abbarollerfoundation@gmail.com",
  phone: CMS_PLACEHOLDER,
  address: CMS_PLACEHOLDER,
  /** Official verified banking details */
  bankDetails: {
    bankName: "POLARIS BANK",
    accountName: "ABBA ROLLER FOUNDATION",
    accountNumber: "4092448499",
    accountType: "Corporate / Nonprofit Account",
  },
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
    slug: "ramadan-food-support-10-states",
    title: "Ramadan Food Support: 1,500 Packages Across 10 States",
    kicker: "Nationwide Ramadan Humanitarian Relief",
    location:
      "10 States Across Nigeria (Jigawa, Kano, Yobe, Borno, Kaduna, Katsina, Bauchi, Sokoto, Gombe, Zamfara)",
    status: "Active",
    summary:
      "A landmark nationwide Ramadan humanitarian campaign distributing 1,500 wholesome food package pieces across 10 Nigerian states to support vulnerable fasting households, orphans, and indigent community members.",
    image: ramadanFoodPackages,
    imageAlt:
      "Packed green bundles and freshly prepared takeaway food containers featuring whole fish, rice, and fresh greens ready for ARF Ramadan distribution across 10 states",
    activities: [
      "Distribution of 1,500 food package pieces nationwide",
      "Multi-state logistics across 10 Nigerian States",
      "High-protein cooked meals with fish, seasoned rice, and fresh salad",
      "Dedicated Iftar and Sahur nutritional support for indigent families",
      "Direct grassroots handover through trusted community leaders",
      "Accountable field verification and beneficiary documentation",
    ],
    body: [
      "The holy month of Ramadan is a time of spiritual devotion, community solidarity, and profound charity. To ensure that vulnerable households and indigent individuals are supported during their fast, the Abba Roller Foundation mounted a multi-state humanitarian operation distributing 1,500 complete food package pieces across 10 states in Nigeria.",
      "Each package is prepared with utmost care, featuring hygienically sealed takeaway meal packs with seasoned rice, fresh salad greens, and wholesome whole fish, alongside bundled food parcels organized for safe multi-ward distribution.",
      "The outreach spanned urban wards, rural councils, and peri-urban settlements in 10 states, bringing essential relief, warmth, and dignity directly to fasting families, street youth, widows, and orphans who needed it most.",
      "This 10-state intervention underscores the Foundation's expanding capacity to coordinate large-scale, accountable humanitarian relief across regional borders while preserving the personal dignity of every single beneficiary.",
    ],
  },
  {
    slug: "weekly-community-food-distribution",
    title: "Weekly Community Food Distribution",
    kicker: "Grassroots Nutrition & 250+ Weekly Meals",
    location: "Kano & Jigawa Municipal Wards, Nigeria",
    status: "Active",
    summary:
      "A weekly grassroots nutrition outreach preparing and distributing 250+ hot, balanced, high-protein takeaway meal packs every week to street children, orphans, and vulnerable families.",
    image: weeklyFoodBeneficiaries,
    imageAlt:
      "Young boys, youths and children happily holding fresh takeout meals during ARF weekly food distribution",
    activities: [
      "Weekly distribution of 250+ cooked takeaway meal packs",
      "Balanced protein nutrition with fresh salad & whole fish, fried/jollof rice & chicken",
      "Direct neighborhood outreach to vulnerable street children and orphans",
      "Structured community handover preserving beneficiary dignity",
      "Regular hygiene and nutritional quality checks",
      "Targeting 1,000+ hot meals disbursed each month",
    ],
    body: [
      "No child or vulnerable individual should face severe hunger or malnutrition. The Abba Roller Foundation Weekly Food Distribution programme operates on a dependable weekly cycle, ensuring that at least 250 freshly cooked, balanced meals are delivered directly to individuals and families carrying the greatest vulnerability.",
      "Each takeaway meal pack is prepared under rigorous hygienic standards and features nutrient-rich seasoned rice, fresh salad greens, wholesome fresh salad & whole fish, or savory fried/jollof rice & chicken, packaged securely in food containers and distributed directly across high-need wards.",
      "Beyond providing immediate sustenance, our weekly presence allows Foundation volunteers to build meaningful, caring relationships with neighborhood children, monitor acute community welfare needs, and connect households to long-term skills and empowerment pathways.",
    ],
  },
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
    slug: "ramadan-food-packages-10-states-distribution",
    title: "Ramadan of compassion: 1,500 food package pieces distributed across 10 Nigerian States",
    category: "Campaign Update",
    date: "2026-04-05",
    author: "ARF Ramadan Outreach Desk",
    readingTime: "4 min read",
    excerpt:
      "Under the leadership of Hon. Usman Aminu Usman (Abba Roller), the Foundation conducted a 10-state Ramadan relief campaign delivering 1,500 food packages to vulnerable fasting households.",
    image: ramadanFoodPackages,
    imageAlt:
      "ARF Ramadan relief packages: stacks of packaged green sacks and open containers with whole fish and seasoned rice",
    body: [
      "In observance of the sacred month of Ramadan, the Abba Roller Foundation successfully executed a wide-reaching humanitarian outreach, delivering 1,500 food package pieces to vulnerable populations across 10 states in Nigeria.",
      "Led by the Foundation's field coordination teams under Founder & Chairman Hon. Usman Aminu Usman (Abba Roller), the intervention targeted households facing severe economic strain, providing vital nutrition for Iftar and Sahur.",
      "## Comprehensive Nutritional Support Across 10 States",
      "Each distribution package consisted of freshly prepared, high-protein hot meals — including whole fish, seasoned rice, and nutrient-dense salad greens — hygienically packed in takeaway containers and organized in sturdy delivery sacks.",
      "The 10-state operation covered key hubs and grassroots communities across Northern Nigeria, including Jigawa, Kano, Yobe, Borno, Kaduna, Katsina, Bauchi, Sokoto, Gombe, and Zamfara.",
      "## Grassroots Delivery with Uncompromised Dignity",
      "Working closely with local elders and community focal persons, Foundation teams carried out direct handovers, ensuring that relief reached the most deserving households without administrative bottlenecks or loss of recipient dignity.",
    ],
  },
  {
    slug: "weekly-community-food-distribution-250-people",
    title: "Nourishing 250+ lives weekly: Direct grassroots food relief outreach",
    category: "Community Story",
    date: "2026-08-28",
    author: "ARF Food Security Desk",
    readingTime: "3 min read",
    excerpt:
      "Every week, ARF prepares and distributes over 250 hot, balanced, nutritious meal packs to street children, orphans, and indigent families across local communities.",
    image: weeklyFoodMeals,
    imageAlt:
      "Freshly prepared nutritious takeaway meal packs containing fresh salad & whole fish, fried/jollof rice & chicken ready for ARF weekly distribution",
    body: [
      "Every week across high-need municipal wards in Northern Nigeria, the Abba Roller Foundation team mobilizes to prepare and distribute over 250 wholesome, freshly cooked meal packs directly to vulnerable children, orphans, and indigent community members.",
      "Each meal container is thoughtfully assembled with fresh salad & whole fish, fried/jollof rice & chicken, providing essential protein and vital micronutrients that are often out of reach for struggling households.",
      "## Direct, Dignified Community Delivery",
      "Rather than impersonal handouts, ARF's weekly distribution is conducted with warmth, respect, and direct engagement. Team members hand each pack directly to recipients, ensuring transparent delivery without administrative intermediaries.",
      "## Reaching 1,000+ Meals Every Month",
      "With 250+ meals disbursed every single week, the Foundation achieves a consistent monthly impact of over 1,000 hot meals. This ongoing commitment ensures that direct nutritional relief remains a reliable lifeline for vulnerable youth across Northern Nigeria.",
    ],
  },
  {
    slug: "visually-impaired-school-dutse-jigawa",
    title:
      "Compassion in action: Comprehensive welfare relief for Visually Impaired School in Dutse, Jigawa State",
    category: "Community Story",
    date: "2026-09-12",
    author: "ARF Special Education Desk",
    readingTime: "4 min read",
    excerpt:
      "ARF mobilized extensive humanitarian relief to the Visually Impaired School in Dutse, delivering nutritious food, laundry detergents, sanitary pads, and bathing materials directly to students in their residential hostel.",
    image: visuallyImpairedSchoolDutse1,
    imageAlt:
      "A young visually impaired student in Dutse school hostel during ARF comprehensive welfare outreach",
    body: [
      "Special needs education demands not only dedicated instructional care but an uncompromising commitment to basic human dignity, proper nutrition, and hygiene.",
      "The Abba Roller Foundation team, led by Founder & Chairman Hon. Usman Aminu Usman (Abba Roller), carried out a comprehensive welfare outreach at the Jigawa State School for the Visually Impaired, located in Limawa, Dutse, Jigawa State.",
      "Under the school's inspiring motto — 'Education is light for All' — visually impaired pupils study and live on-campus in residential hostels. The Foundation delegation met with school administrators, teachers, and pupils directly in their hostels and assembly grounds to conduct an extensive, direct handover of living and nutritional support.",
      "## Multidimensional Relief: Food, Hygiene & Personal Dignity",
      "During the outreach, Foundation volunteers presented an extensive consignment of essential provisions tailored to the pupils' immediate needs:",
      "- **Nutritious Food Provisions**: Wholesome cooked takeaway meals, seasoned rice, protein provisions, and kitchen staples to support student nutrition in the hostel.",
      "- **Laundry Detergents & Cleaners**: Cartons of heavy-duty washing detergent powders, Viva washing packs, antiseptic solutions, and cleaning soaps to safeguard hostel cleanliness.",
      "- **Sanitary Pads for Female Students**: High-grade sanitary pads and menstrual health supplies under the Foundation's Pad Up initiative, ensuring young visually impaired girls manage their periods with absolute confidence.",
      "- **Bathing Materials & Toiletries**: Antibacterial bathing soaps, personal body sponges, toothbrushes, toothpaste, and personal grooming packs distributed in individual washing buckets to students.",
      "- **Custom Foundation Sports Kits**: Specially branded Abba Roller Foundation athletic jerseys presented to senior students to foster confidence, inclusion, and belonging.",
      "## Inclusion, Warmth, and Respect",
      "Interacting warmly with the students and hostel staff, the Foundation reaffirmed its guiding principle: every vulnerable child deserves protection, empathy, and equal access to clean, healthy living conditions. ARF will continue to champion targeted interventions that uplift special needs institutions across Northern Nigeria.",
    ],
  },
  {
    slug: "grassroots-football-championship-peace-cup",
    title:
      "Uniting youth through sport: Abba Roller Foundation hosts grassroots football championship",
    category: "Community Story",
    date: "2026-09-18",
    author: "ARF Youth & Sports Directorate",
    readingTime: "4 min read",
    excerpt:
      "Hon. Usman Aminu Usman (Abba Roller) sponsored and hosted a premier grassroots football tournament, donating full sets of team kits, awarding cash prizes, and presenting the prestigious Golden Championship Cup.",
    image: footballTournamentTrophyPresentation,
    imageAlt:
      "Founder Hon. Usman Aminu Usman presenting the golden championship trophy and team jerseys to captains",
    body: [
      "Sport possesses an unmatched power to transcend divisions, spark healthy ambition, and unite diverse youth around a shared goal of excellence and sportsmanship.",
      "Recognizing this vital role in youth development, the Abba Roller Foundation, under the direct stewardship of Founder & Chairman Hon. Usman Aminu Usman (Abba Roller), hosted and sponsored a premier grassroots football tournament bringing together grassroots clubs across Jigawa State and northern Nigeria, including KAFC Dandidibabs FC Gumel.",
      "The tournament drew energetic crowds, community leaders, and scouts, culminating in a spirited grand finale celebrated for fair play, mutual respect, and electrifying athletic display.",
      "## Comprehensive Tournament Sponsorship & Player Incentives",
      "To ensure grassroots players experienced professional-grade competition and felt valued for their commitment, the Abba Roller Foundation provided all-inclusive support:",
      "- **Official ARF Golden Championship Cup**: Awarded to the champions alongside commemorative gold medals and certificates of merit.",
      "- **Substantial Cash Prize Awards**: Presented direct cash envelopes to finalists, runners-up, tournament MVPs, and standout players to support their athletic journeys.",
      "- **Complete Sets of Team Match Kits**: Donated factory-fresh, branded team jerseys and shorts to equip competing community clubs lacking standardized uniforms.",
      "- **Mentorship and Youth Anti-Vice Campaign**: Keynote address by Hon. Usman Aminu Usman emphasizing discipline, education, avoidance of illicit drugs, and peaceful coexistence.",
      "## Transforming Communities Through Youth Empowerment",
      "The Foundation continues to pioneer interventions that engage young minds constructively, creating platforms where talent is discovered, friendships are forged, and hope is restored for a brighter communal future.",
    ],
  },
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
    label: "Ramadan food packages",
    value: "1,500+",
    note: "Distributed across 10 States in Nigeria",
  },
  {
    label: "States reached (Ramadan)",
    value: "10 States",
    note: "Multi-state nationwide humanitarian relief corridor",
  },
  {
    label: "Weekly meals distributed",
    value: "250+",
    note: "Direct weekly community feeding programme across target wards",
  },
  {
    label: "Monthly meal delivery",
    value: "1,000+",
    note: "Sustained hot nutritious meal distribution to children & households",
  },
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
    id: "grassroots-football-championship-peace-cup",
    title:
      "Youth unity & sports development: Abba Roller Foundation hosts grassroots football championship",
    category: "Empowerment",
    date: "2026-09-18",
    location: "Gumel & Jigawa State Community Stadiums",
    summary:
      "Hon. Usman Aminu Usman (Abba Roller) sponsored and hosted a premier grassroots football tournament, donating complete sets of team kits, awarding substantial cash prizes, and presenting the Golden Championship Cup.",
    image: footballTournamentTrophyPresentation,
    imageAlt:
      "Founder Hon. Usman Aminu Usman presenting the golden championship trophy and team jerseys to captains",
    highlights: [
      "Official ARF Golden Championship Cup and gold medals awarded to winners",
      "Direct cash prize envelopes for winning squads, finalists & tournament MVPs",
      "Complete sets of branded jerseys and match equipment donated to community clubs",
    ],
  },
  {
    id: "visually-impaired-school-dutse-outreach",
    title: "Comprehensive welfare & humanitarian relief at Visually Impaired School, Dutse",
    category: "Humanitarian Support",
    date: "2026-09-12",
    location: "Visually Impaired School, Dutse, Jigawa State",
    summary:
      "ARF conducted a compassionate intervention at the Visually Impaired School in Dutse, delivering wholesome cooked food, heavy-duty laundry detergents, sanitary pads, and bathing materials directly to students in their hostel.",
    image: visuallyImpairedSchoolDutse1,
    imageAlt:
      "Visually impaired pupil in hostel room during ARF welfare intervention in Dutse, Jigawa State",
    highlights: [
      "Direct distribution of food, detergents, sanitary pads & bathing toiletries",
      "Hostel dormitory welfare and student living support",
      "Pad Up personal menstrual hygiene supplies for visually impaired girls",
    ],
  },
  {
    id: "ramadan-food-packages-10-states",
    title: "Ramadan relief: 1,500 food package pieces distributed across 10 States in Nigeria",
    category: "Food Distribution",
    date: "2026-04-05",
    location:
      "10 States across Nigeria (Jigawa, Kano, Yobe, Borno, Kaduna, Katsina, Bauchi, Sokoto, Gombe, Zamfara)",
    summary:
      "ARF conducted a major seasonal outreach distributing 1,500 nutritious food package pieces across 10 Nigerian states to provide immediate Iftar and Sahur sustenance to indigent families, orphans, and fasting individuals.",
    image: ramadanFoodPackages,
    imageAlt:
      "Stacks of packaged green food bundles and freshly prepared meal containers with whole fish, rice, and fresh vegetables",
    highlights: [
      "1,500 food package pieces disbursed across 10 Nigerian States",
      "Nutritious cooked meals with whole fish, rice, and fresh vegetables",
      "Targeted Iftar and Sahur relief for vulnerable fasting households",
    ],
  },
  {
    id: "weekly-food-distribution-250-beneficiaries",
    title: "Weekly food distribution: Providing 250+ hot meals to children & families in need",
    category: "Food Distribution",
    date: "2026-08-28",
    location: "Grassroots community wards across Kano & Jigawa State",
    summary:
      "ARF conducts ongoing weekly food distributions delivering 250+ balanced, freshly prepared takeaway meals (featuring fresh salad & whole fish, fried/jollof rice & chicken) directly to street children, orphans, and vulnerable families in our communities.",
    image: weeklyFoodBeneficiaries,
    imageAlt:
      "Children and young beneficiaries holding freshly prepared meal packs during ARF weekly food distribution",
    highlights: [
      "250+ freshly prepared hot takeaway meals distributed every week",
      "Balanced protein nutrition with fresh salad & whole fish, fried/jollof rice & chicken",
      "Direct grassroots delivery targeting 1,000+ meals disbursed monthly",
    ],
  },
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

export type EducationItem = {
  degree: string;
  institution: string;
  location: string;
  period: string;
  grade?: string;
  highlights?: string;
};

export type ExperienceItem = {
  role: string;
  organization: string;
  location: string;
  period: string;
  type: string;
  summary: string;
  achievements: string[];
};

export type AwardItem = {
  title: string;
  issuer: string;
  year: string;
  description: string;
};

export const founder = {
  name: "Hon. Usman Aminu Usman",
  alias: "Abba Roller",
  role: "Founder & Chairman, Abba Roller Foundation",
  initials: "UAU",
  image: founderPortrait,
  location: "Birmingham, United Kingdom & Nigeria",
  portraitAlt: "Portrait of Hon. Usman Aminu Usman (Abba Roller), Founder of ARF",
  lede: "The Foundation began with a conviction rather than a structure: that no one should be left behind simply because nobody came looking for them.",
  profileStatement:
    "Visionary entrepreneur, international business strategist, and compassionate humanitarian leader with over 8 years of cross-border executive experience spanning the United Kingdom and Nigeria. Combines advanced business management acumen obtained from Birmingham City University with hands-on grassroots philanthropy to empower vulnerable communities, youth, and women.",
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
  profile: [
    { label: "Full name", value: "Hon. Usman Aminu Usman" },
    { label: "Popularly known as", value: "Abba Roller" },
    { label: "Position", value: "Founder & Chairman, Abba Roller Foundation" },
    { label: "Global Presence", value: "Birmingham, UK & Nigeria" },
    {
      label: "Education",
      value: "MSc (Merit) & BA (2:1), Birmingham City University, UK",
    },
    {
      label: "Professional background",
      value: "CEO, International Trade Analyst & Tech Founder (8+ Years Experience)",
    },
    {
      label: "Public service",
      value: "Chairperson & Founder, Abba Roller Care Foundation",
    },
  ],
  education: [
    {
      degree: "Master's Degree in International Business & Management",
      institution: "Birmingham City University",
      location: "Birmingham, United Kingdom",
      period: "January 2023 – January 2024",
      grade: "Grade: Merit",
      highlights:
        "Specialized in global market strategy, international supply chain dynamics, executive decision-making, and organizational leadership.",
    },
    {
      degree: "Bachelor's Degree in Business Management",
      institution: "Birmingham City University",
      location: "Birmingham, United Kingdom",
      period: "September 2019 – June 2022",
      grade: "Grade: 2:1 (Second Class Upper)",
      highlights:
        "Comprehensive training in corporate strategy, business analytics, organizational behavior, marketing strategy, and financial planning.",
    },
    {
      degree: "Foundation in Business Management",
      institution: "Birmingham City University International College",
      location: "Birmingham, United Kingdom",
      period: "September 2018 – June 2019",
      highlights:
        "Foundational principles of international commerce, business communications, and macroeconomics.",
    },
    {
      degree: "Certificate of Higher Education in Commerce",
      institution: "Ultimate International College",
      location: "Kano, Nigeria",
      period: "September 2014 – July 2017",
      highlights: "Commercial practice, accountancy fundamentals, and commercial law.",
    },
  ] as EducationItem[],
  experiences: [
    {
      role: "Chairperson & Founder",
      organization: "Abba Roller Care Foundation (ARF)",
      location: "Nigeria",
      period: "Dec 2024 – Present",
      type: "Nonprofit Leadership & Humanitarian Service",
      summary:
        "Founded and leads the operational direction of ARF, mobilizing resources, partner networks, and hundreds of verified volunteers to alleviate hardship across Northern Nigeria.",
      achievements: [
        "Pioneered sustained weekly community feeding delivering 250+ balanced, hot takeaway meals to orphans and street children.",
        "Mounted a landmark 10-state Ramadan humanitarian corridor distributing 1,500 wholesome food package pieces.",
        "Launched Pad Up Nigerian Girls, providing menstrual health education and distributing 1,000+ sanitary pads in Jigawa State.",
        "Delivered comprehensive student welfare, food, and hygiene supplies to the Visually Impaired School in Dutse.",
        "Conducted medical bill relief for indigent hospital patients in Gumel and provided food relief to Custodial Centre inmates.",
        "Sponsored grassroots football championships and donated team kits to foster youth discipline and sportsmanship.",
      ],
    },
    {
      role: "Chief Executive Officer & Founder",
      organization: "Bizplug App & Bizplug Agency",
      location: "London / Birmingham, United Kingdom",
      period: "Sep 2022 – Present",
      type: "Technology & Digital Platforms",
      summary:
        "Leads product innovation, digital solutions architecture, and business development for a dynamic platform connecting service providers and clients.",
      achievements: [
        "Conceived and founded Bizplug from the ground up, directing product roadmap, UX, and technical architecture.",
        "Developed custom web and mobile applications enabling businesses and startups to scale their online presence.",
        "Oversees cross-border digital marketing, client acquisition, and workflow optimization across the UK and internationally.",
      ],
    },
    {
      role: "CEO & Import/Export Analyst",
      organization: "Uxbridge LTD",
      location: "Nigeria & Global Corridors",
      period: "May 2024 – Present",
      type: "Global Trade, Commodities & Asset Management",
      summary:
        "Directs international commercial procurement, agricultural commodity export, and commercial asset portfolios.",
      achievements: [
        "Orchestrates large-scale agricultural exports (hibiscus flowers and sesame seeds) from Nigeria to Mexico, China, and Germany.",
        "Manages cross-continental supply chains for commercial vehicles, machinery, and automotive spare parts from Europe, the UK, and China.",
        "Oversees portfolio of residential short-let properties and real estate investments.",
      ],
    },
    {
      role: "Project Coordinator & Operations Lead",
      organization: "PA Automobiles Ltd & Hanne Ltd",
      location: "Kano, Nigeria",
      period: "2016 – 2026",
      type: "Logistics & Multimodal Procurement",
      summary:
        "Coordinated multimodal freight forwarding (air & ocean), customs clearance logistics, and project team performance.",
      achievements: [
        "Managed operational procurement budgets and cross-border commercial transactions.",
        "Supervised vehicle bidding, freight tracking, inspection, and customer delivery standards.",
        "Mentored and trained cross-functional operational teams to exceed project KPIs.",
      ],
    },
  ] as ExperienceItem[],
  awards: [
    {
      title: "Graduate Plus Bronze Award",
      issuer: "Birmingham City University, United Kingdom",
      year: "2019",
      description:
        "Awarded in recognition of proactive engagement in high-impact extracurricular leadership and community initiatives.",
    },
    {
      title: "Award Certificate in Project Management",
      issuer: "Corporate Project Board",
      year: "2018",
      description:
        "Conferred in recognition and appreciation of exceptional project leadership, operational efficiency, and team dedication.",
    },
    {
      title: "Certificate of Excellence in Sales & Marketing",
      issuer: "Regional Sales & Commerce Forum, UK",
      year: "2021",
      description:
        "Honored for outstanding achievement in client relations, regional market expansion, and business development.",
    },
  ] as AwardItem[],
  executiveSkills: [
    "Strategic Leadership & Execution",
    "International Trade & Commodity Export",
    "Grassroots Humanitarian Operations",
    "Multimodal Logistics & Supply Chain",
    "Digital Platform Architecture",
    "Financial & Commercial Analysis",
    "Stakeholder & Community Relations",
    "Cross-Cultural Team Management",
  ],
};

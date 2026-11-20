export type ChapterZone = "All Zones" | "North-West" | "North-East" | "North-Central & FCT";

export const CHAPTER_ZONE_FILTERS: readonly ChapterZone[] = [
  "All Zones",
  "North-West",
  "North-East",
  "North-Central & FCT",
];

export type ChapterTier =
  | "Primary Operations Hub"
  | "Urban & Skills Hub"
  | "10-State Humanitarian Corridor"
  | "National Policy & Legal Liaison";

export interface ChapterRegion {
  id: string;
  /** Exact matching state name inside ALL_STATES (src/data/nigeriaStatesLgas.ts) */
  stateKey: string;
  displayName: string;
  zone: Exclude<ChapterZone, "All Zones">;
  tier: ChapterTier;
  headquarters: string;
  baselineBeneficiaries: string;
  activeLgas: readonly string[];
  focusMandates: readonly string[];
  summary: string;
}

export const REGIONAL_CHAPTERS: readonly ChapterRegion[] = [
  {
    id: "jigawa",
    stateKey: "Jigawa",
    displayName: "Jigawa State",
    zone: "North-West",
    tier: "Primary Operations Hub",
    headquarters: "Gumel & Dutse",
    baselineBeneficiaries: "8,650+",
    activeLgas: ["Gumel", "Dutse", "Hadejia", "Ringim", "Birnin Kudu", "Babura"],
    focusMandates: [
      "Pad Up Nigerian Girls (Gumel)",
      "Gumel General Hospital Debt Relief",
      "Dutse Visually Impaired School Welfare",
      "Grassroots Football Championship",
    ],
    summary:
      "Foundational operational headquarters anchor covering weekly hot meals, hospital medical bill clearances, special education outreach, and women's petty-trade grants.",
  },
  {
    id: "kano",
    stateKey: "Kano",
    displayName: "Kano State",
    zone: "North-West",
    tier: "Urban & Skills Hub",
    headquarters: "Kano Municipal",
    baselineBeneficiaries: "6,750+",
    activeLgas: [
      "Kano Municipal",
      "Dala",
      "Fagge",
      "Nassarawa",
      "Gwale",
      "Tarauni",
      "Ungogo",
      "Kumbotso",
    ],
    focusMandates: [
      "Weekly Community Meal Distribution",
      "Youth Vocational & Tailoring Cohorts",
      "Pro Bono Legal Aid Desk (BUK Bar Liaison)",
      "Emergency Household Food Relief",
    ],
    summary:
      "High-density urban hub coordinating youth enterprise training, weekly neighborhood meal distributions, and metropolitan pro bono legal advocacy.",
  },
  {
    id: "fct-abuja",
    stateKey: "Federal Capital Territory",
    displayName: "FCT Abuja",
    zone: "North-Central & FCT",
    tier: "National Policy & Legal Liaison",
    headquarters: "Abuja Municipal (AMAC)",
    baselineBeneficiaries: "National Legal & Policy Liaison",
    activeLgas: ["Abuja Municipal (AMAC)", "Bwari", "Gwagwalada", "Kuje", "Abaji", "Kwali"],
    focusMandates: [
      "Supreme Court & Appellate Pro Bono Advocacy",
      "Institutional & Donor Partnerships",
      "National Volunteer & Civic Coordination",
    ],
    summary:
      "Strategic policy, legal advocacy, and institutional partnership hub connecting civil society actors and pro bono senior counsel nationwide.",
  },
  {
    id: "kaduna",
    stateKey: "Kaduna",
    displayName: "Kaduna State",
    zone: "North-West",
    tier: "10-State Humanitarian Corridor",
    headquarters: "Kaduna North / Zaria",
    baselineBeneficiaries: "Corridor Relief Hub",
    activeLgas: ["Kaduna North", "Kaduna South", "Zaria", "Igabi"],
    focusMandates: [
      "Ramadan Food Package Distribution",
      "Pro Bono Legal Aid & ABU Alumni Cadre",
      "Youth Civic Mentorship",
    ],
    summary:
      "Key corridor chapter supporting interstate Ramadan food consignments and legal aid mobilization alongside academic & legal alumni networks.",
  },
  {
    id: "katsina",
    stateKey: "Katsina",
    displayName: "Katsina State",
    zone: "North-West",
    tier: "10-State Humanitarian Corridor",
    headquarters: "Katsina Municipal",
    baselineBeneficiaries: "Corridor Relief Hub",
    activeLgas: ["Katsina", "Daura", "Funtua", "Malumfashi"],
    focusMandates: [
      "Seasonal Ramadan Sustenance Packs",
      "Rural Women Welfare Outreach",
      "Indigent Legal Representation",
    ],
    summary:
      "Regional northern relief node coordinating seasonal pantry distributions and grassroots citizen membership across Katsina Senatorial zones.",
  },
  {
    id: "bauchi",
    stateKey: "Bauchi",
    displayName: "Bauchi State",
    zone: "North-East",
    tier: "10-State Humanitarian Corridor",
    headquarters: "Bauchi",
    baselineBeneficiaries: "Corridor Relief Hub",
    activeLgas: ["Bauchi", "Azare (Katagum)", "Misau", "Ningí"],
    focusMandates: [
      "North-East Ramadan Logistics Staging",
      "Girl-Child Education Advocacy",
      "Community Legal Rights Awareness",
    ],
    summary:
      "Eastern gateway supporting humanitarian supply transit and community food aid across Bauchi and neighboring Yobe/Gombe districts.",
  },
  {
    id: "yobe",
    stateKey: "Yobe",
    displayName: "Yobe State",
    zone: "North-East",
    tier: "10-State Humanitarian Corridor",
    headquarters: "Damaturu / Potiskum",
    baselineBeneficiaries: "Corridor Relief Hub",
    activeLgas: ["Damaturu", "Potiskum", "Nguru", "Gashua"],
    focusMandates: ["Ramadan Household Food Packages", "Widows & Orphans Vulnerability Support"],
    summary:
      "Frontline North-East humanitarian corridor delivering staple food cartons and emergency household aid through trusted ward leaders.",
  },
  {
    id: "borno",
    stateKey: "Borno",
    displayName: "Borno State",
    zone: "North-East",
    tier: "10-State Humanitarian Corridor",
    headquarters: "Maiduguri",
    baselineBeneficiaries: "Corridor Relief Hub",
    activeLgas: ["Maiduguri", "Jere", "Biu"],
    focusMandates: [
      "10-State Ramadan Relief Distribution",
      "Displaced Family Food Security Support",
    ],
    summary:
      "Partner-assisted humanitarian relief point prioritizing displaced families, orphans, and food-insecure wards during peak relief cycles.",
  },
  {
    id: "gombe",
    stateKey: "Gombe",
    displayName: "Gombe State",
    zone: "North-East",
    tier: "10-State Humanitarian Corridor",
    headquarters: "Gombe",
    baselineBeneficiaries: "Corridor Relief Hub",
    activeLgas: ["Gombe", "Akko", "Kaltungo"],
    focusMandates: ["Ramadan Pantry Support", "Youth Empowerment Mobilization"],
    summary:
      "Central North-East distribution chapter connecting youth volunteer coordinators and regional Ramadan welfare deliveries.",
  },
  {
    id: "sokoto",
    stateKey: "Sokoto",
    displayName: "Sokoto State",
    zone: "North-West",
    tier: "10-State Humanitarian Corridor",
    headquarters: "Sokoto North",
    baselineBeneficiaries: "Corridor Relief Hub",
    activeLgas: ["Sokoto North", "Sokoto South", "Wamakko"],
    focusMandates: ["Ramadan Sustenance Packages", "Girl-Child Dignity Sensitisation"],
    summary:
      "North-West outreach chapter coordinating fasting household relief cartons and expanding youth volunteer participation.",
  },
  {
    id: "zamfara",
    stateKey: "Zamfara",
    displayName: "Zamfara State",
    zone: "North-West",
    tier: "10-State Humanitarian Corridor",
    headquarters: "Gusau",
    baselineBeneficiaries: "Corridor Relief Hub",
    activeLgas: ["Gusau", "Kaura Namoda", "Talata Mafara"],
    focusMandates: ["Vulnerable Family Food Relief", "Rural Humanitarian Coordination"],
    summary:
      "Corridor outreach point supporting displaced rural families, orphans, and seasonal Ramadan nutrition packages.",
  },
];

export interface ChapterGovernanceStandard {
  title: string;
  description: string;
}

export const CHAPTER_GOVERNANCE_STANDARDS: readonly ChapterGovernanceStandard[] = [
  {
    title: "LGA Cadre Authentication",
    description:
      "Every state and LGA member application receives a unique regional registry code linking citizens directly to verified local coordinators.",
  },
  {
    title: "Dual-Sign Disbursement Control",
    description:
      "Regional relief consignments require counter-signature between visiting HQ monitors and host ward community leaders upon delivery.",
  },
  {
    title: "Quarterly Field Reporting",
    description:
      "Active hubs submit beneficiary counts, school attendance sheets, and photographic evidence before subsequent grant disbursements.",
  },
  {
    title: "Zero-Partisan, Zero-Fee Charter",
    description:
      "Chapter membership and humanitarian relief are open to all citizens regardless of affiliation and never attract hidden administrative charges.",
  },
];

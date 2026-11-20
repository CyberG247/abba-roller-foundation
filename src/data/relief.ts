import type { AppStaticRoute } from "./navigation";

export type ReliefFilterCategory =
  "All Channels" | "Food & Nutrition" | "Medical & Special Needs" | "Women & Girls";

export const RELIEF_TARGET_FILTERS: readonly ReliefFilterCategory[] = [
  "All Channels",
  "Food & Nutrition",
  "Medical & Special Needs",
  "Women & Girls",
];

export interface ReliefChannel {
  id: string;
  title: string;
  kicker: string;
  category: Exclude<ReliefFilterCategory, "All Channels">;
  scaleMetric: string;
  cadence: string;
  coverage: string;
  summary: string;
  targetGroups: readonly string[];
  verificationMethod: string;
  anchorId?: string | undefined;
  campaignSlug?: string | undefined;
  routeTo?: AppStaticRoute | undefined;
}

export const RELIEF_CHANNELS: readonly ReliefChannel[] = [
  {
    id: "weekly-feeding",
    title: "Weekly Community Nutrition & Hot Meals",
    kicker: "Channel 01 · Direct Street & Household Feeding",
    category: "Food & Nutrition",
    scaleMetric: "250+ hot meals weekly (1,000+/month)",
    cadence: "Every week",
    coverage: "Gumel & Kano Municipal Wards",
    summary:
      "Hygienically prepared high-protein takeaway meal packs (jollof/fried rice, whole fish or chicken, fresh greens) handed directly to street children, widows, and vulnerable households with zero middlemen.",
    targetGroups: [
      "Street Children & Orphans",
      "Widows & Elderly Residents",
      "Food-Insecure Households",
    ],
    verificationMethod: "Ward focal verification & direct volunteer handover",
    anchorId: "food-distribution",
  },
  {
    id: "ramadan-10-states",
    title: "Nationwide 10-State Ramadan Sustenance Relief",
    kicker: "Channel 02 · Multi-State Pantry & Iftar Aid",
    category: "Food & Nutrition",
    scaleMetric: "1,500+ food packages delivered",
    cadence: "Annual Holy Month",
    coverage: "Jigawa, Kano, Yobe, Borno, Kaduna, Katsina, Bauchi, Sokoto, Gombe, Zamfara",
    summary:
      "Coordinated interstate humanitarian logistics supplying dry staple cartons, clean bottled water, dates, sugar, grains, and prepared Iftar packs across 10 Northern Nigerian states.",
    targetGroups: ["Fasting Indigent Families", "Persons with Disabilities", "Orphanages & Widows"],
    verificationMethod: "State chapter sign-off & beneficiary register audit",
    anchorId: "ramadan-support",
  },
  {
    id: "dutse-special-needs",
    title: "Special Education, Hospital Debt Relief & Custodial Aid",
    kicker: "Channel 03 · Institutional Care & Clinical Support",
    category: "Medical & Special Needs",
    scaleMetric: "480+ medical reliefs · 100+ Dutse students · 350+ inmates",
    cadence: "Scheduled cycles & urgent medical calls",
    coverage:
      "School for the Visually Impaired (Dutse), Gumel General Hospital & Custodial Centres",
    summary:
      "Targeted institutional disbursements covering urgent medical bill clearances for indigent patients, four-pillar hostel hygiene and nutrition packs for visually impaired pupils, and custodial food staples.",
    targetGroups: [
      "Visually Impaired Students",
      "Indigent Hospital Patients",
      "Correctional Inmates",
    ],
    verificationMethod: "Direct hospital billing settlement & school/centre headteacher receipt",
    anchorId: "dutse-outreach",
  },
  {
    id: "pad-up-girls",
    title: "Pad Up Nigerian Girls — Menstrual Dignity & Youth Pathways",
    kicker: "Channel 04 · Adolescent Health & Grassroots Sports",
    category: "Women & Girls",
    scaleMetric: "1,200+ sanitary packs · 11 youth football clubs",
    cadence: "School termly outreaches & annual tournament",
    coverage: "Gumel LGA, Jigawa State & Kano Youth Corridors",
    summary:
      "Combining free sanitary pad packs and menstrual health education in secondary schools with female petty-trade micro-grants and community youth championship sponsorships.",
    targetGroups: [
      "Adolescent Schoolgirls",
      "Low-Income Women Traders",
      "Grassroots Youth Athletes",
    ],
    verificationMethod: "School principal attendance logs & petty-trade beneficiary verification",
    campaignSlug: "pad-up-nigerian-girls",
    anchorId: "football-tournament",
  },
];

export interface EligibilityGroup {
  category: string;
  qualifyingCriteria: string;
  nominationPathway: string;
  disbursementCadence: string;
}

export const ELIGIBILITY_GROUPS: readonly EligibilityGroup[] = [
  {
    category: "Orphans, Street Youth & Vulnerable Households",
    qualifyingCriteria:
      "Lack of reliable daily nutrition, single-earner widow household, or severe seasonal food hardship within active ward corridors.",
    nominationPathway:
      "Ward community head nomination, local ARF volunteer field verification, or direct weekly outreach attendance.",
    disbursementCadence: "Weekly cooked meal packs & seasonal Ramadan staples.",
  },
  {
    category: "Indigent Hospital & Maternity Patients",
    qualifyingCriteria:
      "Verified inability to settle urgent prescription, emergency admission, or discharge bills at partner public hospitals such as Gumel General Hospital.",
    nominationPathway:
      "Hospital social welfare unit referral verified directly against official hospital invoice by an ARF coordinator.",
    disbursementCadence:
      "Rolling medical grant settled directly to facility accounts (never via middlemen).",
  },
  {
    category: "Persons with Disabilities & Special Schools",
    qualifyingCriteria:
      "Enrolled pupils at special education facilities (e.g., School for the Visually Impaired, Dutse) or registered persons with mobility/visual impairments.",
    nominationPathway:
      "School administration assessment or verified disability community association endorsement.",
    disbursementCadence:
      "Bulk hostel hygiene, detergent, sanitary pad, and nutrition consignments.",
  },
  {
    category: "Adolescent Schoolgirls (Menstrual Health)",
    qualifyingCriteria:
      "Female pupils in public primary/secondary schools facing financial barriers to monthly sanitary supplies.",
    nominationPathway:
      "Participating school outreach schedules coordinated with principals and local education authorities.",
    disbursementCadence:
      "On-site school sensitisation seminars paired with multi-pack sanitary pad distribution.",
  },
  {
    category: "Indigent Pretrial Detainees & Wronged Citizens",
    qualifyingCriteria:
      "Individuals unable to afford private legal representation facing prolonged pretrial detention, bail delays, or rights violations.",
    nominationPathway:
      "Custodial centre social desk, family petition via Contact Helpdesk, or Legal Aid Referral portal (/legal-aid).",
    disbursementCadence:
      "Matched within 48–72 hours with an active practitioner in the ARF Pro Bono Legal Corps.",
  },
  {
    category: "Women Petty Traders & Youth Apprentices",
    qualifyingCriteria:
      "Active micro-entrepreneurs or youth trainees committed to productive community livelihoods in Jigawa and Kano LGAs.",
    nominationPathway: "LGA chapter endorsement & baseline household trade verification.",
    disbursementCadence: "Cohort-based micro-capital support & vocational kit grants.",
  },
];

export interface DisbursementStep {
  step: string;
  title: string;
  detail: string;
}

export const DISBURSEMENT_PROTOCOL: readonly DisbursementStep[] = [
  {
    step: "01",
    title: "Community & Institutional Nomination",
    detail:
      "Need is surfaced through ward leaders, public hospitals, school principals, or direct citizen petitions — never political gatekeeping.",
  },
  {
    step: "02",
    title: "Independent Field Cadre Verification",
    detail:
      "ARF state/LGA coordinators cross-check beneficiary circumstances, hospital bills, or institutional lists before approving allocation.",
  },
  {
    step: "03",
    title: "Zero-Middleman Direct Handover",
    detail:
      "Relief packs, medical settlements, and supplies are handed directly to verified recipients or accredited hospitals—100% free of fees.",
  },
  {
    step: "04",
    title: "Audit Log & Photographic Accountability",
    detail:
      "Every cycle reconciles headcounts, unit quantities, and field photography for publication on Impact (/impact) and Gallery (/gallery).",
  },
];

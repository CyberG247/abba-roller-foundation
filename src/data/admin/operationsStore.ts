import correctionalImg from "@/assets/correctional-centre-outreach.jpg";
import gumelHospitalImg from "@/assets/gumel-hospital-outreach.jpg";
import ramadanImg from "@/assets/ramadan-food-packages-10-states.jpg";
import dutseImg from "@/assets/visually-impaired-school-dutse-supplies-display.jpg";
import weeklyMealsImg from "@/assets/weekly-food-distribution-meals.jpg";
import { REGIONAL_CHAPTERS, type ChapterTier } from "@/data/chapters";
import { exportRecordsToCsv, getTodayIsoDate } from "@/lib/utils";

export const RELIEF_PIPELINES = [
  "Food & Palliative Distribution",
  "Direct Financial Grants",
  "Student Scholarships & Bursaries",
  "Disability Support Aid",
  "Correctional Facility / Inmate Welfare",
] as const;

export type ReliefPipeline = (typeof RELIEF_PIPELINES)[number];

export type VulnerabilityClass =
  "Persons with Disabilities" | "Students" | "Inmates" | "Widows & Orphans" | "Indigent Household";

export type BeneficiaryAidStatus =
  "Applied" | "Under Verification" | "Approved" | "Disbursed" | "Rejected";

export interface BeneficiaryRecord {
  id: string;
  fullName: string;
  phone: string;
  state: string;
  lga: string;
  wardOrInstitution: string;
  vulnerabilityClass: VulnerabilityClass;
  programPipeline: ReliefPipeline;
  ninMasked: string;
  ninVerified: boolean;
  aidValueNgn: number;
  status: BeneficiaryAidStatus;
  appliedDate: string;
  notes?: string | undefined;
}

export interface DisbursementBatch {
  id: string;
  title: string;
  pipeline: ReliefPipeline;
  state: string;
  lga: string;
  unitCount: number;
  unitLabel: string;
  totalValueNgn: number;
  status: "Scheduled" | "In Transit" | "Verified & Disbursed";
  disbursedDate: string;
  proofPhotoUrl?: string | undefined;
  coordinatorName: string;
}

export const LEGAL_MILESTONES = [
  "Intake",
  "Assigned",
  "Court Filing",
  "Hearing",
  "Resolved / Acquitted",
] as const;

export type LegalMilestone = (typeof LEGAL_MILESTONES)[number];

export interface LegalCaseRecord {
  id: string;
  caseTitle: string;
  clientInitials: string;
  isInmate: boolean;
  facilityOrCourt: string;
  state: string;
  category: string;
  priority: "Urgent" | "High" | "Standard";
  milestone: LegalMilestone;
  assignedLawyerId?: string | undefined;
  assignedLawyerName?: string | undefined;
  filedDate: string;
  nextHearingDate?: string | undefined;
  summary: string;
}

export interface ChapterCoordinationRecord {
  id: string;
  stateKey: string;
  displayName: string;
  zone: string;
  tier: ChapterTier;
  headquarters: string;
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorEmail: string;
  activeLgas: string[];
  announcements: {
    id: string;
    title: string;
    body: string;
    publishedAt: string;
  }[];
}

export interface MonthlyTrendPoint {
  month: string;
  reliefDisbursedNgnThousands: number;
  casesResolved: number;
  beneficiariesReached: number;
}

export const MONTHLY_TREND_DATA: readonly MonthlyTrendPoint[] = [
  { month: "Jun", reliefDisbursedNgnThousands: 2850, casesResolved: 9, beneficiariesReached: 1420 },
  {
    month: "Jul",
    reliefDisbursedNgnThousands: 3420,
    casesResolved: 12,
    beneficiariesReached: 1890,
  },
  {
    month: "Aug",
    reliefDisbursedNgnThousands: 4100,
    casesResolved: 15,
    beneficiariesReached: 2340,
  },
  {
    month: "Sep",
    reliefDisbursedNgnThousands: 3790,
    casesResolved: 18,
    beneficiariesReached: 2150,
  },
  {
    month: "Oct",
    reliefDisbursedNgnThousands: 5250,
    casesResolved: 21,
    beneficiariesReached: 3120,
  },
  {
    month: "Nov",
    reliefDisbursedNgnThousands: 6180,
    casesResolved: 26,
    beneficiariesReached: 4480,
  },
];

const BENEFICIARY_KEY = "arf_beneficiaries_v1";
const BATCH_KEY = "arf_batches_v1";
const LEGAL_CASES_KEY = "arf_legal_cases_v1";
const CHAPTER_COORD_KEY = "arf_chapters_coord_v1";

const INITIAL_BENEFICIARIES: BeneficiaryRecord[] = [
  {
    id: "BEN-2026-0412",
    fullName: "Musa Abdullahi Dutse",
    phone: "+234 803 441 1189",
    state: "Jigawa",
    lga: "Dutse",
    wardOrInstitution: "School for the Visually Impaired, Dutse",
    vulnerabilityClass: "Persons with Disabilities",
    programPipeline: "Disability Support Aid",
    ninMasked: "•••• •••• 8412",
    ninVerified: true,
    aidValueNgn: 45000,
    status: "Disbursed",
    appliedDate: "2026-10-12",
    notes:
      "Hostel hygiene kit, Braille slate support & dormitory provisions verified by headteacher.",
  },
  {
    id: "BEN-2026-0413",
    fullName: "Fatima Aliyu Gumel",
    phone: "+234 812 990 4421",
    state: "Jigawa",
    lga: "Gumel",
    wardOrInstitution: "Gumel General Hospital Maternity Ward",
    vulnerabilityClass: "Indigent Household",
    programPipeline: "Direct Financial Grants",
    ninMasked: "•••• •••• 3920",
    ninVerified: true,
    aidValueNgn: 85000,
    status: "Disbursed",
    appliedDate: "2026-10-18",
    notes: "Hospital discharge invoice settled directly via Polaris Bank hospital welfare officer.",
  },
  {
    id: "BEN-2026-0414",
    fullName: "Aisha Sani Ringim",
    phone: "+234 805 221 7743",
    state: "Jigawa",
    lga: "Ringim",
    wardOrInstitution: "Government Girls Sec. School Ringim",
    vulnerabilityClass: "Students",
    programPipeline: "Student Scholarships & Bursaries",
    ninMasked: "•••• •••• 1175",
    ninVerified: true,
    aidValueNgn: 38000,
    status: "Approved",
    appliedDate: "2026-11-02",
    notes: "SS3 WAEC registration bursary + 6-month sanitary dignity supply.",
  },
  {
    id: "BEN-2026-0415",
    fullName: "Detainee Ward B-14 (M.I.)",
    phone: "Custodial Welfare Desk",
    state: "Jigawa",
    lga: "Gumel",
    wardOrInstitution: "Gumel Medium Custodial Centre",
    vulnerabilityClass: "Inmates",
    programPipeline: "Correctional Facility / Inmate Welfare",
    ninMasked: "CUST-REF-902",
    ninVerified: true,
    aidValueNgn: 30000,
    status: "Disbursed",
    appliedDate: "2026-11-04",
    notes: "Dry staple provisions & referral cross-checked for pretrial bail hearing.",
  },
  {
    id: "BEN-2026-0416",
    fullName: "Hauwa Garba Dala",
    phone: "+234 814 309 5510",
    state: "Kano",
    lga: "Dala",
    wardOrInstitution: "Kantin Kwari Women Traders Cooperative",
    vulnerabilityClass: "Widows & Orphans",
    programPipeline: "Direct Financial Grants",
    ninMasked: "•••• •••• 6204",
    ninVerified: true,
    aidValueNgn: 100000,
    status: "Disbursed",
    appliedDate: "2026-11-06",
    notes: "Zero-interest women's petty-trade restocking micro-grant.",
  },
  {
    id: "BEN-2026-0417",
    fullName: "Yusuf Lawal Fagge",
    phone: "+234 809 778 1022",
    state: "Kano",
    lga: "Fagge",
    wardOrInstitution: "Fagge Youth Vocational Annex",
    vulnerabilityClass: "Students",
    programPipeline: "Student Scholarships & Bursaries",
    ninMasked: "•••• •••• 7749",
    ninVerified: false,
    aidValueNgn: 65000,
    status: "Under Verification",
    appliedDate: "2026-11-12",
    notes: "Pending coordinator verification of tailoring apprentice workshop placement.",
  },
  {
    id: "BEN-2026-0418",
    fullName: "Zainab Bukar Potiskum",
    phone: "+234 803 882 3411",
    state: "Yobe",
    lga: "Potiskum",
    wardOrInstitution: "Potiskum Central Displaced Relief Hub",
    vulnerabilityClass: "Widows & Orphans",
    programPipeline: "Food & Palliative Distribution",
    ninMasked: "•••• •••• 5018",
    ninVerified: false,
    aidValueNgn: 28000,
    status: "Applied",
    appliedDate: "2026-11-16",
    notes: "Household of 6 children nominated by Potiskum community elder.",
  },
  {
    id: "BEN-2026-0419",
    fullName: "Suleiman Adamu Zaria",
    phone: "+234 806 514 9001",
    state: "Kaduna",
    lga: "Zaria",
    wardOrInstitution: "Ahmadu Bello Special Assistance Network",
    vulnerabilityClass: "Persons with Disabilities",
    programPipeline: "Disability Support Aid",
    ninMasked: "•••• •••• 2231",
    ninVerified: true,
    aidValueNgn: 120000,
    status: "Approved",
    appliedDate: "2026-11-17",
    notes: "Approved for adaptive wheelchair mobility unit.",
  },
  {
    id: "BEN-2026-0420",
    fullName: "Amina Kaita Katsina",
    phone: "+234 818 204 6618",
    state: "Katsina",
    lga: "Katsina",
    wardOrInstitution: "Katsina Municipal Orphanage Liaison",
    vulnerabilityClass: "Widows & Orphans",
    programPipeline: "Food & Palliative Distribution",
    ninMasked: "•••• •••• 9145",
    ninVerified: true,
    aidValueNgn: 55000,
    status: "Disbursed",
    appliedDate: "2026-11-08",
  },
  {
    id: "BEN-2026-0421",
    fullName: "Inmate Welfare Roll C-09",
    phone: "Kano Kurmawa Desk",
    state: "Kano",
    lga: "Kano Municipal",
    wardOrInstitution: "Kano Central Correctional Facility",
    vulnerabilityClass: "Inmates",
    programPipeline: "Correctional Facility / Inmate Welfare",
    ninMasked: "CUST-KN-411",
    ninVerified: true,
    aidValueNgn: 75000,
    status: "Under Verification",
    appliedDate: "2026-11-18",
    notes: "Hygiene, medication & legal clinic intake requested.",
  },
  {
    id: "BEN-2026-0422",
    fullName: "Maryam Abubakar Bauchi",
    phone: "+234 802 119 4500",
    state: "Bauchi",
    lga: "Bauchi",
    wardOrInstitution: "Bauchi Girls Polytechnic Support",
    vulnerabilityClass: "Students",
    programPipeline: "Student Scholarships & Bursaries",
    ninMasked: "•••• •••• 6670",
    ninVerified: false,
    aidValueNgn: 50000,
    status: "Applied",
    appliedDate: "2026-11-19",
  },
  {
    id: "BEN-2026-0423",
    fullName: "Bello Umar Maiduguri",
    phone: "+234 807 654 2219",
    state: "Borno",
    lga: "Maiduguri",
    wardOrInstitution: "Maiduguri Jere Ward",
    vulnerabilityClass: "Indigent Household",
    programPipeline: "Food & Palliative Distribution",
    ninMasked: "•••• •••• 4401",
    ninVerified: true,
    aidValueNgn: 35000,
    status: "Disbursed",
    appliedDate: "2026-11-01",
  },
];

const INITIAL_BATCHES: DisbursementBatch[] = [
  {
    id: "BATCH-JG-2026-014",
    title: "Dutse Special Education Four-Pillar Care Consignment",
    pipeline: "Disability Support Aid",
    state: "Jigawa",
    lga: "Dutse",
    unitCount: 180,
    unitLabel: "Students & Hygiene Kits",
    totalValueNgn: 1650000,
    status: "Verified & Disbursed",
    disbursedDate: "2026-11-19",
    proofPhotoUrl: dutseImg,
    coordinatorName: "Ibrahim Sani Garba",
  },
  {
    id: "BATCH-JG-2026-013",
    title: "Gumel General Hospital Medical Debt Clearance Cohort",
    pipeline: "Direct Financial Grants",
    state: "Jigawa",
    lga: "Gumel",
    unitCount: 64,
    unitLabel: "Indigent Patients Cleared",
    totalValueNgn: 2450000,
    status: "Verified & Disbursed",
    disbursedDate: "2026-11-14",
    proofPhotoUrl: gumelHospitalImg,
    coordinatorName: "Hon. Usman Aminu Usman",
  },
  {
    id: "BATCH-KN-2026-012",
    title: "Kano Metropolitan Weekly Hot Meals & Orphan Nutrition",
    pipeline: "Food & Palliative Distribution",
    state: "Kano",
    lga: "Kano Municipal",
    unitCount: 1000,
    unitLabel: "Cooked Protein Meal Packs",
    totalValueNgn: 1480000,
    status: "Verified & Disbursed",
    disbursedDate: "2026-11-12",
    proofPhotoUrl: weeklyMealsImg,
    coordinatorName: "Hauwa Mustapha Bello",
  },
  {
    id: "BATCH-COR-2026-011",
    title: "10-State Ramadan Sustenance Food Cartons Dispatch",
    pipeline: "Food & Palliative Distribution",
    state: "Kano",
    lga: "Dala",
    unitCount: 1500,
    unitLabel: "Dry Staple Food Cartons",
    totalValueNgn: 8900000,
    status: "Verified & Disbursed",
    disbursedDate: "2026-10-28",
    proofPhotoUrl: ramadanImg,
    coordinatorName: "Hajiya Zainab Garba",
  },
  {
    id: "BATCH-JG-2026-010",
    title: "Gumel Custodial Centre Staple Provisions & Welfare",
    pipeline: "Correctional Facility / Inmate Welfare",
    state: "Jigawa",
    lga: "Gumel",
    unitCount: 350,
    unitLabel: "Inmate Welfare Packs",
    totalValueNgn: 980000,
    status: "Verified & Disbursed",
    disbursedDate: "2026-10-19",
    proofPhotoUrl: correctionalImg,
    coordinatorName: "Barr. Aminu Kabir Dutse",
  },
  {
    id: "BATCH-KD-2026-009",
    title: "Zaria & Kaduna Public School Girl-Child Bursary Batch",
    pipeline: "Student Scholarships & Bursaries",
    state: "Kaduna",
    lga: "Zaria",
    unitCount: 120,
    unitLabel: "Bursaries & Exam Vouchers",
    totalValueNgn: 1920000,
    status: "In Transit",
    disbursedDate: "2026-11-22",
    coordinatorName: "Salisu Umar Zaria",
  },
];

const INITIAL_LEGAL_CASES: LegalCaseRecord[] = [
  {
    id: "ARF-CASE-2026-104",
    caseTitle: "Prolonged Pretrial Remand Bail Application (M.I.)",
    clientInitials: "M. I. (Gumel Remand)",
    isInmate: true,
    facilityOrCourt: "Gumel Medium Custodial Centre / High Court II",
    state: "Jigawa",
    category: "Unlawful Detention & Emergency Bail Defense",
    priority: "Urgent",
    milestone: "Hearing",
    assignedLawyerId: "ARF-BAR-2026-0012",
    assignedLawyerName: "Barr. Aminu Kabir Dutse",
    filedDate: "2026-11-04",
    nextHearingDate: "2026-11-26",
    summary:
      "Held 11 months without DPP legal advice filing; habeas & constitutional bail motion scheduled for ruling.",
  },
  {
    id: "ARF-CASE-2026-105",
    caseTitle: "Minor Remand Age-Verification & Diversion Petition",
    clientInitials: "S. A. (Aged 16)",
    isInmate: true,
    facilityOrCourt: "Kano Juvenile & Magistrate Court IV",
    state: "Kano",
    category: "Juvenile & Vulnerable Youth Protection",
    priority: "Urgent",
    milestone: "Intake",
    filedDate: "2026-11-18",
    nextHearingDate: "2026-11-29",
    summary:
      "Orphaned apprentice remanded in adult holding wing; requires immediate age verification order and release to guardian.",
  },
  {
    id: "ARF-CASE-2026-106",
    caseTitle: "Widow Matrimonial Property Dispossession Injunction",
    clientInitials: "H. B.",
    isInmate: false,
    facilityOrCourt: "Upper Sharia / Family Court, Kano Municipal",
    state: "Kano",
    category: "Widows, Orphans & Family Rights Protection",
    priority: "High",
    milestone: "Court Filing",
    assignedLawyerId: "ARF-BAR-2026-0025",
    assignedLawyerName: "Barr. Halima Suleiman Esq.",
    filedDate: "2026-11-09",
    nextHearingDate: "2026-12-03",
    summary:
      "Emergency protective injunction safeguarding surviving widow and 4 school-age children from forced eviction.",
  },
  {
    id: "ARF-CASE-2026-107",
    caseTitle: "Artisan Confiscated Equipment Constitutional Writ",
    clientInitials: "U. T. (Metalworker)",
    isInmate: false,
    facilityOrCourt: "Kaduna High Court Judicial Division",
    state: "Kaduna",
    category: "Wrongful Eviction & Artisan Livelihood Rights",
    priority: "Standard",
    milestone: "Assigned",
    assignedLawyerId: "ARF-BAR-2026-0049",
    assignedLawyerName: "Barr. Sadiq Musa Zaria",
    filedDate: "2026-11-12",
    nextHearingDate: "2026-12-10",
    summary: "Challenging unlawful seizure of workshop welding generator without court warrant.",
  },
  {
    id: "ARF-CASE-2026-108",
    caseTitle: "Indigent Custodial Holding Charge Dismissal",
    clientInitials: "Y. K. (Inmate #312)",
    isInmate: true,
    facilityOrCourt: "Federal High Court / Dutse Correctional Wing",
    state: "Jigawa",
    category: "Indigent Pretrial Criminal Defense",
    priority: "Urgent",
    milestone: "Intake",
    filedDate: "2026-11-19",
    summary:
      "Urgent pro bono intake referred by Custodial Welfare Desk; defendant unrepresented for 7 months.",
  },
  {
    id: "ARF-CASE-2026-101",
    caseTitle: "Acquittal & Discharge of Wrongfully Charged Vendor",
    clientInitials: "A. D.",
    isInmate: false,
    facilityOrCourt: "Chief Magistrate Court I, Katsina",
    state: "Katsina",
    category: "Criminal & Bail Defense",
    priority: "High",
    milestone: "Resolved / Acquitted",
    assignedLawyerId: "ARF-BAR-2026-0074",
    assignedLawyerName: "Barr. Ibrahim Bello Kaita",
    filedDate: "2026-09-10",
    summary: "Full discharge and restitution secured on lack of prima facie prosecution evidence.",
  },
];

function buildInitialChapterCoordination(): ChapterCoordinationRecord[] {
  const defaultCoordinators: Record<string, { name: string; phone: string; email: string }> = {
    Jigawa: {
      name: "Ibrahim Sani Garba",
      phone: "+234 803 214 7890",
      email: "jigawa.chapter@abbarollerfoundation.com.ng",
    },
    Kano: {
      name: "Hauwa Mustapha Bello",
      phone: "+234 814 678 1234",
      email: "kano.chapter@abbarollerfoundation.com.ng",
    },
    "Federal Capital Territory": {
      name: "Barr. Chukwuemeka Okoye",
      phone: "+234 806 789 0123",
      email: "abuja.liaison@abbarollerfoundation.com.ng",
    },
    Kaduna: {
      name: "Salisu Umar Zaria",
      phone: "+234 805 612 8891",
      email: "kaduna.chapter@abbarollerfoundation.com.ng",
    },
  };

  return REGIONAL_CHAPTERS.map((ch) => {
    const lead = defaultCoordinators[ch.stateKey];
    return {
      id: ch.id,
      stateKey: ch.stateKey,
      displayName: ch.displayName,
      zone: ch.zone,
      tier: ch.tier,
      headquarters: ch.headquarters,
      coordinatorName: lead?.name ?? "Chapter Desk (Recruitment Open)",
      coordinatorPhone: lead?.phone ?? "+234 906 666 6633",
      coordinatorEmail: lead?.email ?? "abbarollerfoundation@gmail.com",
      activeLgas: [...ch.activeLgas],
      announcements: [
        {
          id: `ann-${ch.id}-1`,
          title: `${ch.displayName} Q4 Verification & Relief Schedule`,
          body: `LGA ward coordinators across ${ch.headquarters} are consolidating beneficiary & member logs prior to the next quarterly disbursement.`,
          publishedAt: "2026-11-15",
        },
      ],
    };
  });
}

function dispatchAdminUpdate(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("arf_admin_updated"));
  }
}

export function loadBeneficiaries(): BeneficiaryRecord[] {
  if (typeof window === "undefined") return INITIAL_BENEFICIARIES;
  try {
    const raw = localStorage.getItem(BENEFICIARY_KEY);
    if (!raw) {
      localStorage.setItem(BENEFICIARY_KEY, JSON.stringify(INITIAL_BENEFICIARIES));
      return INITIAL_BENEFICIARIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? (parsed as BeneficiaryRecord[])
      : INITIAL_BENEFICIARIES;
  } catch {
    return INITIAL_BENEFICIARIES;
  }
}

export function saveBeneficiary(
  input: Omit<BeneficiaryRecord, "id" | "appliedDate" | "status" | "ninMasked"> & {
    ninRaw?: string | undefined;
    status?: BeneficiaryAidStatus | undefined;
  },
): BeneficiaryRecord {
  const digits = (input.ninRaw || "").replace(/\D/g, "");
  const ninMasked = digits.length >= 4 ? `•••• •••• ${digits.slice(-4)}` : "•••• •••• PENDING";
  const record: BeneficiaryRecord = {
    id: `BEN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`,
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    state: input.state,
    lga: input.lga,
    wardOrInstitution: input.wardOrInstitution.trim(),
    vulnerabilityClass: input.vulnerabilityClass,
    programPipeline: input.programPipeline,
    ninMasked,
    ninVerified: input.ninVerified,
    aidValueNgn: input.aidValueNgn,
    status: input.status ?? "Under Verification",
    appliedDate: getTodayIsoDate(),
    notes: input.notes,
  };
  const updated = [record, ...loadBeneficiaries()];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(BENEFICIARY_KEY, JSON.stringify(updated));
      dispatchAdminUpdate();
    } catch {
      // ignore
    }
  }
  return record;
}

export function updateBeneficiaryStatus(
  id: string,
  updates: Partial<Pick<BeneficiaryRecord, "status" | "ninVerified" | "notes">>,
): BeneficiaryRecord[] {
  const updated = loadBeneficiaries().map((b) => (b.id === id ? { ...b, ...updates } : b));
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(BENEFICIARY_KEY, JSON.stringify(updated));
      dispatchAdminUpdate();
    } catch {
      // ignore
    }
  }
  return updated;
}

export function bulkUpdateBeneficiaryStatus(
  ids: readonly string[],
  status: BeneficiaryAidStatus,
): BeneficiaryRecord[] {
  const targetIds = new Set(ids);
  const updated = loadBeneficiaries().map((b) => (targetIds.has(b.id) ? { ...b, status } : b));
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(BENEFICIARY_KEY, JSON.stringify(updated));
      dispatchAdminUpdate();
    } catch {
      // ignore
    }
  }
  return updated;
}

export function deleteBeneficiary(id: string): BeneficiaryRecord[] {
  const updated = loadBeneficiaries().filter((b) => b.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(BENEFICIARY_KEY, JSON.stringify(updated));
      dispatchAdminUpdate();
    } catch {
      // ignore
    }
  }
  return updated;
}

export function exportBeneficiariesCsv(records: BeneficiaryRecord[]): void {
  const headers = [
    "Beneficiary ID",
    "Full Name",
    "Phone",
    "State",
    "LGA",
    "Ward / Institution",
    "Vulnerability Class",
    "Program Pipeline",
    "Masked NIN",
    "NIN Verified",
    "Aid Value (NGN)",
    "Status",
    "Applied Date",
  ];
  const rows = records.map((b) => [
    b.id,
    b.fullName,
    b.phone,
    b.state,
    b.lga,
    b.wardOrInstitution,
    b.vulnerabilityClass,
    b.programPipeline,
    b.ninMasked,
    b.ninVerified ? "Yes" : "Pending",
    b.aidValueNgn,
    b.status,
    b.appliedDate,
  ]);
  exportRecordsToCsv(`ARF-Beneficiaries-Audit-${getTodayIsoDate()}.csv`, headers, rows);
}

export function loadBatches(): DisbursementBatch[] {
  if (typeof window === "undefined") return INITIAL_BATCHES;
  try {
    const raw = localStorage.getItem(BATCH_KEY);
    if (!raw) {
      localStorage.setItem(BATCH_KEY, JSON.stringify(INITIAL_BATCHES));
      return INITIAL_BATCHES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? (parsed as DisbursementBatch[])
      : INITIAL_BATCHES;
  } catch {
    return INITIAL_BATCHES;
  }
}

export function saveBatch(input: Omit<DisbursementBatch, "id">): DisbursementBatch {
  const batch: DisbursementBatch = {
    ...input,
    id: `BATCH-${input.state.slice(0, 2).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 899)}`,
  };
  const updated = [batch, ...loadBatches()];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(BATCH_KEY, JSON.stringify(updated));
      dispatchAdminUpdate();
    } catch {
      // ignore
    }
  }
  return batch;
}

export function updateBatchStatus(
  id: string,
  status: DisbursementBatch["status"],
): DisbursementBatch[] {
  const updated = loadBatches().map((b) => (b.id === id ? { ...b, status } : b));
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(BATCH_KEY, JSON.stringify(updated));
      dispatchAdminUpdate();
    } catch {
      // ignore
    }
  }
  return updated;
}

export function exportBatchesCsv(batches: DisbursementBatch[]): void {
  const headers = [
    "Batch Code",
    "Title",
    "Pipeline",
    "State",
    "LGA",
    "Units",
    "Unit Type",
    "Total Value (NGN)",
    "Status",
    "Disbursed Date",
    "Coordinator",
  ];
  const rows = batches.map((b) => [
    b.id,
    b.title,
    b.pipeline,
    b.state,
    b.lga,
    b.unitCount,
    b.unitLabel,
    b.totalValueNgn,
    b.status,
    b.disbursedDate,
    b.coordinatorName,
  ]);
  exportRecordsToCsv(`ARF-Disbursement-Batches-${getTodayIsoDate()}.csv`, headers, rows);
}

export function loadLegalCases(): LegalCaseRecord[] {
  if (typeof window === "undefined") return INITIAL_LEGAL_CASES;
  try {
    const raw = localStorage.getItem(LEGAL_CASES_KEY);
    if (!raw) {
      localStorage.setItem(LEGAL_CASES_KEY, JSON.stringify(INITIAL_LEGAL_CASES));
      return INITIAL_LEGAL_CASES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? (parsed as LegalCaseRecord[])
      : INITIAL_LEGAL_CASES;
  } catch {
    return INITIAL_LEGAL_CASES;
  }
}

export function saveLegalCase(input: Omit<LegalCaseRecord, "id" | "filedDate">): LegalCaseRecord {
  const record: LegalCaseRecord = {
    ...input,
    id: `ARF-CASE-${new Date().getFullYear()}-${Math.floor(200 + Math.random() * 799)}`,
    filedDate: getTodayIsoDate(),
  };
  const updated = [record, ...loadLegalCases()];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LEGAL_CASES_KEY, JSON.stringify(updated));
      dispatchAdminUpdate();
    } catch {
      // ignore
    }
  }
  return record;
}

export function assignLawyerToCase(
  caseId: string,
  lawyerId: string,
  lawyerName: string,
): LegalCaseRecord[] {
  const updated = loadLegalCases().map((c) =>
    c.id === caseId
      ? {
          ...c,
          assignedLawyerId: lawyerId,
          assignedLawyerName: lawyerName,
          milestone: c.milestone === "Intake" ? ("Assigned" as const) : c.milestone,
        }
      : c,
  );
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LEGAL_CASES_KEY, JSON.stringify(updated));
      dispatchAdminUpdate();
    } catch {
      // ignore
    }
  }
  return updated;
}

export function updateLegalCaseMilestone(
  caseId: string,
  milestone: LegalMilestone,
): LegalCaseRecord[] {
  const updated = loadLegalCases().map((c) => (c.id === caseId ? { ...c, milestone } : c));
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LEGAL_CASES_KEY, JSON.stringify(updated));
      dispatchAdminUpdate();
    } catch {
      // ignore
    }
  }
  return updated;
}

export function deleteLegalCase(caseId: string): LegalCaseRecord[] {
  const updated = loadLegalCases().filter((c) => c.id !== caseId);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LEGAL_CASES_KEY, JSON.stringify(updated));
      dispatchAdminUpdate();
    } catch {
      // ignore
    }
  }
  return updated;
}

export function exportLegalCasesCsv(cases: LegalCaseRecord[]): void {
  const headers = [
    "Case ID",
    "Case Title",
    "Client Ref",
    "Inmate Matter",
    "Court / Facility",
    "State",
    "Category",
    "Priority",
    "Milestone",
    "Assigned Counsel",
    "Filed Date",
    "Next Hearing",
  ];
  const rows = cases.map((c) => [
    c.id,
    c.caseTitle,
    c.clientInitials,
    c.isInmate ? "Yes" : "No",
    c.facilityOrCourt,
    c.state,
    c.category,
    c.priority,
    c.milestone,
    c.assignedLawyerName || "Unassigned",
    c.filedDate,
    c.nextHearingDate || "",
  ]);
  exportRecordsToCsv(`ARF-Legal-Aid-Cases-${getTodayIsoDate()}.csv`, headers, rows);
}

export function loadChapterCoordination(): ChapterCoordinationRecord[] {
  const initial = buildInitialChapterCoordination();
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(CHAPTER_COORD_KEY);
    if (!raw) {
      localStorage.setItem(CHAPTER_COORD_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? (parsed as ChapterCoordinationRecord[])
      : initial;
  } catch {
    return initial;
  }
}

export function updateChapterCoordinator(
  chapterId: string,
  coordinator: {
    coordinatorName: string;
    coordinatorPhone: string;
    coordinatorEmail: string;
  },
): ChapterCoordinationRecord[] {
  const updated = loadChapterCoordination().map((ch) =>
    ch.id === chapterId ? { ...ch, ...coordinator } : ch,
  );
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CHAPTER_COORD_KEY, JSON.stringify(updated));
      dispatchAdminUpdate();
    } catch {
      // ignore
    }
  }
  return updated;
}

export function addChapterAnnouncement(
  chapterId: string,
  title: string,
  body: string,
): ChapterCoordinationRecord[] {
  const updated = loadChapterCoordination().map((ch) =>
    ch.id === chapterId
      ? {
          ...ch,
          announcements: [
            {
              id: `ann-${Date.now()}`,
              title: title.trim(),
              body: body.trim(),
              publishedAt: getTodayIsoDate(),
            },
            ...ch.announcements,
          ],
        }
      : ch,
  );
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CHAPTER_COORD_KEY, JSON.stringify(updated));
      dispatchAdminUpdate();
    } catch {
      // ignore
    }
  }
  return updated;
}

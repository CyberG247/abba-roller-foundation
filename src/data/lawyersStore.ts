import { recordDeletedCredential } from "@/data/deletedCredentialsStore";
import { exportRecordsToCsv, getTodayIsoDate } from "@/lib/utils";

export interface LawyerVolunteer {
  id: string;
  nbaNumber?: string | undefined;
  fullName: string;
  lawFirm?: string | undefined;
  email: string;
  university: string;
  phone: string;
  callToBarYear: string;
  casesWon: number;
  jurisdictionState?: string | undefined;
  practiceAreas?: string[] | undefined;
  bio?: string | undefined;
  languages?: string[] | undefined;
  availability?: string | undefined;
  submissionDate: string;
  status: "Verified Advocate" | "Under Review" | "Active Pro Bono" | "Removed";
}

export interface LegalEligibilityCase {
  title: string;
  criteria: string;
  urgency: "High Priority" | "Standard Referral";
}

export const LEGAL_CASE_ELIGIBILITY: readonly LegalEligibilityCase[] = [
  {
    title: "Unlawful Detention & Emergency Bail Defense",
    criteria:
      "Indigent citizens held beyond constitutional statutory limits without formal arraignment or unable to meet onerous bail representation costs.",
    urgency: "High Priority",
  },
  {
    title: "Indigent Pretrial Criminal Defense",
    criteria:
      "Verified low-income defendants in Magistrate and High Courts requiring diligent courtroom defense against prolonged remand.",
    urgency: "High Priority",
  },
  {
    title: "Widows, Orphans & Family Rights Protection",
    criteria:
      "Disputed inheritance dispossession, domestic abuse protection orders, and maintenance enforcement for vulnerable women and children.",
    urgency: "High Priority",
  },
  {
    title: "Juvenile & Vulnerable Youth Protection",
    criteria:
      "Young persons (under 18) or students requiring diversion advocacy, birth/age verification defense, or safeguards against institutional abuse.",
    urgency: "Standard Referral",
  },
  {
    title: "Wrongful Eviction & Artisan Livelihood Rights",
    criteria:
      "Small-scale petty traders or low-income tenants facing illegal seizure of livelihood tools or arbitrary eviction without due notice.",
    urgency: "Standard Referral",
  },
];

export const LEGAL_PRACTICE_FILTERS: readonly string[] = [
  "All Practice Areas",
  "Criminal & Bail Defense",
  "Human Rights & Fundamental Enforcement",
  "Family, Women & Child Rights",
  "Civil Litigation & Property",
  "Public Interest Advocacy",
];

const STORAGE_KEY = "arf_lawyers_volunteers_v1";

export const INITIAL_LAWYERS: LawyerVolunteer[] = [
  {
    id: "ARF-BAR-2026-0012",
    nbaNumber: "SCN/084122",
    fullName: "Barr. Aminu Kabir Dutse",
    lawFirm: "Dutse Chambers & Associates",
    email: "aminu.dutse@chambers.ng",
    university: "Ahmadu Bello University (ABU) Zaria",
    phone: "+234 802 345 6789",
    callToBarYear: "2016",
    casesWon: 24,
    jurisdictionState: "Jigawa",
    practiceAreas: ["Criminal & Bail Defense", "Human Rights & Fundamental Enforcement"],
    bio: "Lead pro bono trial advocate across Dutse and Gumel Magistrate and High Courts, specializing in decongesting custodial facilities and defending indigent detainees.",
    languages: ["English", "Hausa"],
    availability: "Weekly Court Roster (Jigawa)",
    submissionDate: "2026-01-20",
    status: "Active Pro Bono",
  },
  {
    id: "ARF-BAR-2026-0025",
    nbaNumber: "SCN/109438",
    fullName: "Barr. Halima Suleiman Esq.",
    lawFirm: "Equitas Legal Advocates",
    email: "halima.suleiman@equitaslaw.com",
    university: "Bayero University Kano (BUK)",
    phone: "+234 813 456 7890",
    callToBarYear: "2019",
    casesWon: 14,
    jurisdictionState: "Kano",
    practiceAreas: ["Family, Women & Child Rights", "Human Rights & Fundamental Enforcement"],
    bio: "Advocate for women's inheritance protection, gender-based violence legal relief, and adolescent girl-child safeguarding across Kano Municipal.",
    languages: ["English", "Hausa", "Fulfulde"],
    availability: "Bi-weekly Pro Bono Clinic",
    submissionDate: "2026-02-14",
    status: "Verified Advocate",
  },
  {
    id: "ARF-BAR-2026-0038",
    nbaNumber: "SCN/071890",
    fullName: "Barr. Chukwuemeka Okoye",
    lawFirm: "Justice & Partners LP",
    email: "c.okoye@justicepartners.ng",
    university: "University of Nigeria Nsukka (UNN)",
    phone: "+234 806 789 0123",
    callToBarYear: "2014",
    casesWon: 42,
    jurisdictionState: "FCT Abuja",
    practiceAreas: [
      "Human Rights & Fundamental Enforcement",
      "Public Interest Advocacy",
      "Civil Litigation & Property",
    ],
    bio: "Appellate litigator coordinating fundamental rights enforcement petitions, public-interest writ applications, and national pro bono case escalation.",
    languages: ["English", "Igbo", "Pidgin"],
    availability: "On-Call Appellate Desk",
    submissionDate: "2026-03-02",
    status: "Active Pro Bono",
  },
  {
    id: "ARF-BAR-2026-0049",
    nbaNumber: "SCN/098214",
    fullName: "Barr. Sadiq Musa Zaria",
    lawFirm: "Arewa Veritas Solicitors",
    email: "sadiq.zaria@arewaveritas.ng",
    university: "Ahmadu Bello University (ABU) Zaria",
    phone: "+234 805 612 8891",
    callToBarYear: "2018",
    casesWon: 19,
    jurisdictionState: "Kaduna",
    practiceAreas: ["Criminal & Bail Defense", "Civil Litigation & Property"],
    bio: "Handles pro bono criminal defense, pretrial bail perfection, and artisan wrongful seizure disputes across Kaduna and Zaria judicial divisions.",
    languages: ["English", "Hausa"],
    availability: "Two Cases / Month",
    submissionDate: "2026-03-19",
    status: "Verified Advocate",
  },
  {
    id: "ARF-BAR-2026-0061",
    nbaNumber: "SCN/115602",
    fullName: "Barr. Amina Ibrahim Bauchi",
    lawFirm: "Gidauniya Public Counsel",
    email: "amina.ibrahim@gidauniyacounsel.org",
    university: "University of Jos (UNIJOS)",
    phone: "+234 809 341 2207",
    callToBarYear: "2020",
    casesWon: 11,
    jurisdictionState: "Bauchi",
    practiceAreas: ["Family, Women & Child Rights", "Public Interest Advocacy"],
    bio: "Provides legal clinic counseling and courtroom defense for low-income widows, juvenile minors, and displaced households in Bauchi State.",
    languages: ["English", "Hausa"],
    availability: "Active Pro Bono",
    submissionDate: "2026-04-04",
    status: "Active Pro Bono",
  },
  {
    id: "ARF-BAR-2026-0074",
    nbaNumber: "SCN/079341",
    fullName: "Barr. Ibrahim Bello Kaita",
    lawFirm: "Katsina Civic Chambers",
    email: "ibrahim.kaita@katsinachambers.ng",
    university: "Usmanu Danfodiyo University Sokoto (UDUS)",
    phone: "+234 803 771 4520",
    callToBarYear: "2015",
    casesWon: 29,
    jurisdictionState: "Katsina",
    practiceAreas: ["Criminal & Bail Defense", "Human Rights & Fundamental Enforcement"],
    bio: "Senior magistrate and high court practitioner assisting prolonged remand detainees with statutory bail enforcement across Katsina and Daura.",
    languages: ["English", "Hausa", "Arabic"],
    availability: "Weekly Legal Aid Desk",
    submissionDate: "2026-04-12",
    status: "Verified Advocate",
  },
];

function hydrateBaselineFields(records: LawyerVolunteer[]): LawyerVolunteer[] {
  const baselineById = new Map(INITIAL_LAWYERS.map((item) => [item.id, item]));
  const seenIds = new Set<string>();

  const merged = records.map((record) => {
    seenIds.add(record.id);
    const seed = baselineById.get(record.id);
    if (!seed) return record;
    return {
      ...seed,
      ...record,
      nbaNumber: record.nbaNumber || seed.nbaNumber,
      practiceAreas:
        record.practiceAreas && record.practiceAreas.length > 0
          ? record.practiceAreas
          : seed.practiceAreas,
      bio: record.bio || seed.bio,
      languages:
        record.languages && record.languages.length > 0 ? record.languages : seed.languages,
      availability: record.availability || seed.availability,
    };
  });

  // Preserve user-added records while ensuring any newly added baseline advocates appear cleanly
  const missingSeeds = INITIAL_LAWYERS.filter((seed) => !seenIds.has(seed.id));
  return [...merged, ...missingSeeds];
}

export function getLawyersList(): LawyerVolunteer[] {
  if (typeof window === "undefined") return INITIAL_LAWYERS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LAWYERS));
      return INITIAL_LAWYERS;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return INITIAL_LAWYERS;
    return hydrateBaselineFields(parsed as LawyerVolunteer[]);
  } catch {
    return INITIAL_LAWYERS;
  }
}

export function saveLawyerVolunteer(
  lawyer: Omit<LawyerVolunteer, "id" | "submissionDate" | "status">,
): LawyerVolunteer {
  const current = getLawyersList();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newLawyer: LawyerVolunteer = {
    ...lawyer,
    id: `ARF-BAR-${new Date().getFullYear()}-${randomSuffix}`,
    submissionDate: getTodayIsoDate(),
    status: "Under Review",
  };

  const updated = [newLawyer, ...current];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("arf_members_updated"));
    } catch {
      // ignore localStorage quota errors
    }
  }
  return newLawyer;
}

export function updateLawyerStatus(
  id: string,
  status: LawyerVolunteer["status"],
): LawyerVolunteer[] {
  const updated = getLawyersList().map((l) => (l.id === id ? { ...l, status } : l));
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("arf_members_updated"));
    } catch {
      // ignore
    }
  }
  return updated;
}

export function deleteLawyerFromStorage(id: string): LawyerVolunteer[] {
  const current = getLawyersList();
  const target = current.find((l) => l.id === id);
  if (target) {
    const jurisdiction = target.jurisdictionState ?? "Nigeria";
    recordDeletedCredential({
      kind: "lawyer",
      id: target.id,
      fullName: target.fullName,
      phone: target.phone,
      state: jurisdiction,
      subtitle: `Pro Bono Advocate • ${target.lawFirm ?? "Independent Counsel"} (${jurisdiction})`,
      submittedDate: target.submissionDate,
    });
  }
  const updated = current.filter((l) => l.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("arf_members_updated"));
    } catch {
      // ignore
    }
  }
  return updated;
}

export function exportLawyersToCsv(lawyers: LawyerVolunteer[]): void {
  const headers = [
    "Bar Advocate ID",
    "NBA Enrollment No.",
    "Full Name",
    "Law Firm",
    "Email",
    "Phone",
    "University (LL.B)",
    "Call to Bar Year",
    "Cases Won",
    "Jurisdiction State",
    "Practice Areas",
    "Enrollment Date",
    "Status",
  ];

  const rows = lawyers.map((l) => [
    l.id,
    l.nbaNumber || "",
    l.fullName,
    l.lawFirm || "",
    l.email,
    l.phone || "",
    l.university || "",
    l.callToBarYear,
    l.casesWon,
    l.jurisdictionState || "",
    l.practiceAreas?.join("; ") || "",
    l.submissionDate,
    l.status,
  ]);

  exportRecordsToCsv(`ARF-Lawyers-Pro-Bono-Directory-${getTodayIsoDate()}.csv`, headers, rows);
}

/** Bar accreditation slips are only unlocked once an administrator verifies the advocate. */
export function isLawyerCredentialIssued(lawyer: LawyerVolunteer): boolean {
  return lawyer.status === "Verified Advocate" || lawyer.status === "Active Pro Bono";
}

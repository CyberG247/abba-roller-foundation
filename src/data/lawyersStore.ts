export interface LawyerVolunteer {
  id: string;
  fullName: string;
  lawFirm?: string;
  email: string;
  university: string;
  phone: string;
  callToBarYear: string;
  casesWon: number;
  jurisdictionState?: string;
  practiceAreas?: string[];
  submissionDate: string;
  status: "Verified Advocate" | "Under Review" | "Active Pro Bono";
}

const STORAGE_KEY = "arf_lawyers_volunteers_v1";

export const INITIAL_LAWYERS: LawyerVolunteer[] = [
  {
    id: "ARF-BAR-2026-0012",
    fullName: "Barr. Aminu Kabir Dutse",
    lawFirm: "Dutse Chambers & Associates",
    email: "aminu.dutse@chambers.ng",
    university: "Ahmadu Bello University (ABU) Zaria",
    phone: "+234 802 345 6789",
    callToBarYear: "2016",
    casesWon: 24,
    jurisdictionState: "Jigawa",
    submissionDate: "2026-01-20",
    status: "Active Pro Bono",
  },
  {
    id: "ARF-BAR-2026-0025",
    fullName: "Barr. Halima Suleiman Esq.",
    lawFirm: "Equitas Legal Advocates",
    email: "halima.suleiman@equitaslaw.com",
    university: "Bayero University Kano (BUK)",
    phone: "+234 813 456 7890",
    callToBarYear: "2019",
    casesWon: 14,
    jurisdictionState: "Kano",
    submissionDate: "2026-02-14",
    status: "Verified Advocate",
  },
  {
    id: "ARF-BAR-2026-0038",
    fullName: "Barr. Chukwuemeka Okoye",
    lawFirm: "Justice & Partners LP",
    email: "c.okoye@justicepartners.ng",
    university: "University of Nigeria Nsukka (UNN)",
    phone: "+234 806 789 0123",
    callToBarYear: "2014",
    casesWon: 42,
    jurisdictionState: "FCT Abuja",
    submissionDate: "2026-03-02",
    status: "Active Pro Bono",
  },
];

export function getLawyersList(): LawyerVolunteer[] {
  if (typeof window === "undefined") return INITIAL_LAWYERS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LAWYERS));
      return INITIAL_LAWYERS;
    }
    return JSON.parse(data);
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
    id: `ARF-BAR-2026-${randomSuffix}`,
    submissionDate: new Date().toISOString().split("T")[0],
    status: "Active Pro Bono",
  };

  const updated = [newLawyer, ...current];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore localStorage quota errors
    }
  }
  return newLawyer;
}

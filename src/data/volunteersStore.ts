import { getTodayIsoDate } from "@/lib/utils";
import type { VolunteerSlipData } from "@/lib/generateVolunteerSlip";

export interface VolunteerRecord extends VolunteerSlipData {
  status: "Pending Briefing" | "Verified Volunteer" | "Deployed";
}

const STORAGE_KEY = "arf_general_volunteers_v1";

export function loadVolunteersFromStorage(): VolunteerRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveVolunteerToStorage(
  volunteer: Omit<VolunteerRecord, "status"> & { status?: VolunteerRecord["status"] | undefined },
): VolunteerRecord {
  const existing = loadVolunteersFromStorage();
  const record: VolunteerRecord = {
    ...volunteer,
    submissionDate: volunteer.submissionDate || getTodayIsoDate(),
    status: volunteer.status ?? "Pending Briefing",
  };
  const updated = [record, ...existing];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("arf_members_updated"));
    } catch {
      // Ignore storage quota errors
    }
  }
  return record;
}

export function updateVolunteerStatus(
  refNumber: string,
  status: VolunteerRecord["status"],
): VolunteerRecord[] {
  const updated = loadVolunteersFromStorage().map((v) =>
    v.refNumber === refNumber ? { ...v, status } : v,
  );
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

export function deleteVolunteerFromStorage(refNumber: string): VolunteerRecord[] {
  const updated = loadVolunteersFromStorage().filter((v) => v.refNumber !== refNumber);
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

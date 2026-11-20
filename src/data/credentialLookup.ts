import { loadDeletedCredentialsFromStorage } from "@/data/deletedCredentialsStore";
import {
  getLawyersList,
  isLawyerCredentialIssued,
  type LawyerVolunteer,
} from "@/data/lawyersStore";
import {
  isMemberCredentialIssued,
  loadMembersFromStorage,
  type Member,
} from "@/data/membershipStore";
import {
  isVolunteerCredentialIssued,
  loadVolunteersFromStorage,
  type VolunteerRecord,
} from "@/data/volunteersStore";

export type CredentialCategory = "member" | "lawyer" | "volunteer";

export type CredentialMatch =
  | {
      kind: "member";
      id: string;
      fullName: string;
      phone: string;
      state: string;
      subtitle: string;
      statusLabel: Member["status"] | "Deleted";
      submittedDate: string;
      removedDate?: string | undefined;
      photoUrl?: string | undefined;
      isIssued: boolean;
      isRemoved: boolean;
      pendingNote: string;
      record: Member | null;
    }
  | {
      kind: "lawyer";
      id: string;
      fullName: string;
      phone: string;
      state: string;
      subtitle: string;
      statusLabel: LawyerVolunteer["status"] | "Deleted";
      submittedDate: string;
      removedDate?: string | undefined;
      photoUrl?: string | undefined;
      isIssued: boolean;
      isRemoved: boolean;
      pendingNote: string;
      record: LawyerVolunteer | null;
    }
  | {
      kind: "volunteer";
      id: string;
      fullName: string;
      phone: string;
      state: string;
      subtitle: string;
      statusLabel: VolunteerRecord["status"] | "Deleted";
      submittedDate: string;
      removedDate?: string | undefined;
      photoUrl?: string | undefined;
      isIssued: boolean;
      isRemoved: boolean;
      pendingNote: string;
      record: VolunteerRecord | null;
    };

/**
 * Normalizes Nigerian (and common international) phone input for reliable lookup:
 * e.g. "+234 803 123 4567", "23408031234567", "8031234567", "0803-123-4567" -> "08031234567".
 */
export function normalizeNigerianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("234") && digits.length >= 12) {
    const local = digits.slice(3);
    return local.startsWith("0") ? local : `0${local}`;
  }

  if (
    digits.length === 10 &&
    (digits.startsWith("7") || digits.startsWith("8") || digits.startsWith("9"))
  ) {
    return `0${digits}`;
  }

  return digits;
}

export function isPhoneQueryValid(raw: string): boolean {
  return normalizeNigerianPhone(raw).length >= 7;
}

export function phonesMatch(storedPhone: string | undefined, queryPhone: string): boolean {
  if (!storedPhone) return false;
  const a = normalizeNigerianPhone(storedPhone);
  const b = normalizeNigerianPhone(queryPhone);
  if (!a || !b || b.length < 7) return false;
  if (a === b) return true;
  if (a.length >= 10 && b.length >= 10) {
    return a.slice(-10) === b.slice(-10);
  }
  return false;
}

const REMOVED_NOTICE =
  "This registration was removed or deleted from the Abba Roller Foundation registry by an Administrator. No ID Card or Accreditation Slip is valid or available for download.";

/**
 * Looks up all registered Members, Pro Bono Lawyers, and General Volunteers
 * (including Admin-removed / deleted entries) matching the phone number provided during registration.
 */
export function findCredentialsByPhone(
  rawPhone: string,
  filter: CredentialCategory | "all" = "all",
): CredentialMatch[] {
  if (!isPhoneQueryValid(rawPhone)) return [];

  const matches: CredentialMatch[] = [];
  const seenKeys = new Set<string>();

  if (filter === "all" || filter === "member") {
    for (const member of loadMembersFromStorage()) {
      if (!member.phone || !phonesMatch(member.phone, rawPhone)) continue;
      const isRemoved = member.status === "Removed";
      seenKeys.add(`member:${member.id}`);
      matches.push({
        kind: "member",
        id: member.id,
        fullName: member.fullName,
        phone: member.phone,
        state: member.state,
        subtitle: `${member.tier} • ${member.lga}, ${member.state}`,
        statusLabel: member.status,
        submittedDate: member.joinedDate,
        photoUrl: member.photoUrl,
        isIssued: !isRemoved && isMemberCredentialIssued(member),
        isRemoved,
        pendingNote: isRemoved
          ? REMOVED_NOTICE
          : "Your membership application is awaiting Admin Secretariat verification before your Digital ID Card is issued.",
        record: isRemoved ? null : member,
      });
    }
  }

  if (filter === "all" || filter === "lawyer") {
    for (const lawyer of getLawyersList()) {
      if (!lawyer.phone || !phonesMatch(lawyer.phone, rawPhone)) continue;
      const isRemoved = lawyer.status === "Removed";
      const jurisdiction = lawyer.jurisdictionState ?? "Nigeria";
      seenKeys.add(`lawyer:${lawyer.id}`);
      matches.push({
        kind: "lawyer",
        id: lawyer.id,
        fullName: lawyer.fullName,
        phone: lawyer.phone,
        state: jurisdiction,
        subtitle: `Pro Bono Advocate • ${lawyer.lawFirm ?? "Independent Counsel"} (${jurisdiction})`,
        statusLabel: lawyer.status,
        submittedDate: lawyer.submissionDate,
        isIssued: !isRemoved && isLawyerCredentialIssued(lawyer),
        isRemoved,
        pendingNote: isRemoved
          ? REMOVED_NOTICE
          : "Your NBA credentials and pro bono profile are currently under Admin Bar review before your Accreditation Slip is released.",
        record: isRemoved ? null : lawyer,
      });
    }
  }

  if (filter === "all" || filter === "volunteer") {
    for (const volunteer of loadVolunteersFromStorage()) {
      if (!phonesMatch(volunteer.phone, rawPhone)) continue;
      const isRemoved = volunteer.status === "Removed";
      seenKeys.add(`volunteer:${volunteer.refNumber}`);
      matches.push({
        kind: "volunteer",
        id: volunteer.refNumber,
        fullName: volunteer.fullName,
        phone: volunteer.phone,
        state: volunteer.state,
        subtitle: `${volunteer.activity} • ${volunteer.state} Chapter`,
        statusLabel: volunteer.status,
        submittedDate: volunteer.submissionDate,
        photoUrl: volunteer.photoUrl ?? undefined,
        isIssued: !isRemoved && isVolunteerCredentialIssued(volunteer),
        isRemoved,
        pendingNote: isRemoved
          ? REMOVED_NOTICE
          : "Your volunteer application is awaiting Chapter Admin verification and briefing clearance before your Accreditation Slip is unlocked.",
        record: isRemoved ? null : volunteer,
      });
    }
  }

  for (const deleted of loadDeletedCredentialsFromStorage()) {
    if (filter !== "all" && deleted.kind !== filter) continue;
    if (!deleted.phone || !phonesMatch(deleted.phone, rawPhone)) continue;
    const key = `${deleted.kind}:${deleted.id}`;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    matches.push({
      kind: deleted.kind,
      id: deleted.id,
      fullName: deleted.fullName,
      phone: deleted.phone,
      state: deleted.state,
      subtitle: deleted.subtitle,
      statusLabel: "Deleted",
      submittedDate: deleted.submittedDate,
      removedDate: deleted.removedDate,
      photoUrl: deleted.photoUrl,
      isIssued: false,
      isRemoved: true,
      pendingNote: REMOVED_NOTICE,
      record: null,
    });
  }

  return matches;
}

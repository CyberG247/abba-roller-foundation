import { getTodayIsoDate } from "@/lib/utils";

export type DeletedCredentialKind = "member" | "lawyer" | "volunteer";

export interface DeletedCredentialRecord {
  kind: DeletedCredentialKind;
  id: string;
  fullName: string;
  phone: string;
  state: string;
  subtitle: string;
  submittedDate: string;
  removedDate: string;
  photoUrl?: string | undefined;
}

const DELETED_STORAGE_KEY = "arf_deleted_credentials_v1";

export function loadDeletedCredentialsFromStorage(): DeletedCredentialRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DELETED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DeletedCredentialRecord[]) : [];
  } catch {
    return [];
  }
}

export function recordDeletedCredential(
  entry: Omit<DeletedCredentialRecord, "removedDate">,
): DeletedCredentialRecord[] {
  const existing = loadDeletedCredentialsFromStorage().filter(
    (item) => !(item.kind === entry.kind && item.id === entry.id),
  );
  const record: DeletedCredentialRecord = {
    ...entry,
    removedDate: getTodayIsoDate(),
  };
  const updated = [record, ...existing].slice(0, 500);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore quota errors
    }
  }
  return updated;
}

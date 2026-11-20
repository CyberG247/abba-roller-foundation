import { exportRecordsToCsv, getTodayIsoDate } from "@/lib/utils";

export type AdminRole =
  "SUPER_ADMIN" | "PROGRAM_OFFICER" | "LEGAL_COORDINATOR" | "STATE_CHAPTER_LEAD" | "CONTENT_EDITOR";

export type AdminPermission =
  | "cms:edit"
  | "cms:publish"
  | "media:manage"
  | "relief:manage"
  | "disbursements:approve"
  | "legal:manage"
  | "members:manage"
  | "chapters:manage"
  | "audit:view"
  | "settings:manage";

export interface AdminRoleProfile {
  role: AdminRole;
  label: string;
  actorName: string;
  actorEmail: string;
  scopeSummary: string;
  badgeClass: string;
  permissions: readonly AdminPermission[];
}

export const ROLE_PROFILES: readonly AdminRoleProfile[] = [
  {
    role: "SUPER_ADMIN",
    label: "Super Admin",
    actorName: "Hon. Usman Aminu Usman",
    actorEmail: "chairman@abbarollerfoundation.com.ng",
    scopeSummary: "Full institutional authority across CMS, relief approvals, legal aid & RBAC.",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
    permissions: [
      "cms:edit",
      "cms:publish",
      "media:manage",
      "relief:manage",
      "disbursements:approve",
      "legal:manage",
      "members:manage",
      "chapters:manage",
      "audit:view",
      "settings:manage",
    ],
  },
  {
    role: "PROGRAM_OFFICER",
    label: "Program Officer",
    actorName: "Hajiya Zainab Garba",
    actorEmail: "programs@abbarollerfoundation.com.ng",
    scopeSummary: "Manages relief pipelines, NIN beneficiary verification & disbursement batches.",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-800",
    permissions: ["relief:manage", "disbursements:approve", "audit:view"],
  },
  {
    role: "LEGAL_COORDINATOR",
    label: "Legal Coordinator",
    actorName: "Barr. Aminu Kabir Dutse",
    actorEmail: "legalaid@abbarollerfoundation.com.ng",
    scopeSummary: "Oversees NBA attorney verification, indigent/inmate case matching & hearings.",
    badgeClass: "border-indigo-200 bg-indigo-50 text-indigo-800",
    permissions: ["legal:manage", "audit:view"],
  },
  {
    role: "STATE_CHAPTER_LEAD",
    label: "State Chapter Lead",
    actorName: "Ibrahim Sani (Jigawa Hub)",
    actorEmail: "jigawa.chapter@abbarollerfoundation.com.ng",
    scopeSummary: "Coordinates state member approvals, announcements & local volunteer rosters.",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
    permissions: ["members:manage", "chapters:manage", "relief:manage"],
  },
  {
    role: "CONTENT_EDITOR",
    label: "Content Editor",
    actorName: "Sadiq Danjuma",
    actorEmail: "comms@abbarollerfoundation.com.ng",
    scopeSummary:
      "Builds CMS drafts, uploads media/video assets & previews page updates (cannot publish).",
    badgeClass: "border-slate-200 bg-slate-100 text-slate-700",
    permissions: ["cms:edit", "media:manage"],
  },
];

export interface PermissionMatrixRow {
  permission: AdminPermission;
  label: string;
  description: string;
}

export const PERMISSION_MATRIX_ROWS: readonly PermissionMatrixRow[] = [
  {
    permission: "cms:edit",
    label: "CMS Block & Page Drafting",
    description: "Create pages and edit Hero, Split, Gallery/Video & CTA blocks.",
  },
  {
    permission: "cms:publish",
    label: "Publish, Schedule & Rollback CMS",
    description: "Push drafts live, reorder top navigation & restore historical versions.",
  },
  {
    permission: "media:manage",
    label: "Centralized Media & Video Library",
    description: "Upload photos, configure S3/CDN tags & register YouTube/MP4 videos.",
  },
  {
    permission: "relief:manage",
    label: "Beneficiary Registry & Intake",
    description: "Verify applicant eligibility, vulnerability status & masked NIN checks.",
  },
  {
    permission: "disbursements:approve",
    label: "Approve & Release Relief Batches",
    description: "Authorize state/LGA palliative & grant batches and log proof receipts.",
  },
  {
    permission: "legal:manage",
    label: "Legal Case & NBA Attorney Engine",
    description: "Log indigent/inmate matters, verify Bar numbers & assign pro bono counsel.",
  },
  {
    permission: "members:manage",
    label: "Nationwide Member Approval & IDs",
    description: "Verify citizen applications across 36 states + FCT and issue IDs.",
  },
  {
    permission: "chapters:manage",
    label: "State Chapter Coordinators & Notices",
    description: "Assign regional leads and broadcast state-level announcements.",
  },
  {
    permission: "audit:view",
    label: "Immutable Audit Log Access",
    description: "Inspect and export cryptographic/timestamped operational change history.",
  },
  {
    permission: "settings:manage",
    label: "RBAC Governance & System Policy",
    description: "Manage foundation operator roles, NDPR controls & security configuration.",
  },
];

export function getRoleProfile(role: AdminRole): AdminRoleProfile {
  return ROLE_PROFILES.find((p) => p.role === role) ?? ROLE_PROFILES[0]!;
}

export function hasPermission(role: AdminRole, permission: AdminPermission): boolean {
  return getRoleProfile(role).permissions.includes(permission);
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: AdminRole;
  action: string;
  entityType:
    | "CmsPage"
    | "CmsNav"
    | "MediaAsset"
    | "Beneficiary"
    | "DisbursementBatch"
    | "LegalCase"
    | "Attorney"
    | "Member"
    | "Volunteer"
    | "StateChapter";
  entityId: string;
  summary: string;
}

const AUDIT_STORAGE_KEY = "arf_audit_log_v1";

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "AUD-2026-9041",
    timestamp: "2026-11-20T09:15:00Z",
    actorName: "Hon. Usman Aminu Usman",
    actorRole: "SUPER_ADMIN",
    action: "CMS_PAGE_PUBLISHED",
    entityType: "CmsPage",
    entityId: "scholarship-bursary-2026",
    summary:
      "Published custom CMS page '/p/scholarship-bursary-2026' (2026 Student Bursary Initiative).",
  },
  {
    id: "AUD-2026-9040",
    timestamp: "2026-11-19T16:40:00Z",
    actorName: "Hajiya Zainab Garba",
    actorRole: "PROGRAM_OFFICER",
    action: "BATCH_VERIFIED_DISBURSED",
    entityType: "DisbursementBatch",
    entityId: "BATCH-JG-2026-014",
    summary: "Verified delivery of 180 hygiene & sanitary packs at Dutse Visually Impaired School.",
  },
  {
    id: "AUD-2026-9039",
    timestamp: "2026-11-19T11:20:00Z",
    actorName: "Barr. Aminu Kabir Dutse",
    actorRole: "LEGAL_COORDINATOR",
    action: "CASE_COUNSEL_ASSIGNED",
    entityType: "LegalCase",
    entityId: "ARF-CASE-2026-104",
    summary:
      "Assigned Barr. Halima Suleiman Esq. (SCN/109438) to urgent Gumel remand bail application.",
  },
  {
    id: "AUD-2026-9038",
    timestamp: "2026-11-18T14:05:00Z",
    actorName: "Barr. Aminu Kabir Dutse",
    actorRole: "LEGAL_COORDINATOR",
    action: "ATTORNEY_NBA_VERIFIED",
    entityType: "Attorney",
    entityId: "ARF-BAR-2026-0061",
    summary: "Verified Supreme Court Enrollment No. SCN/115602 for Barr. Amina Ibrahim Bauchi.",
  },
  {
    id: "AUD-2026-9037",
    timestamp: "2026-11-17T09:50:00Z",
    actorName: "Ibrahim Sani (Jigawa Hub)",
    actorRole: "STATE_CHAPTER_LEAD",
    action: "MEMBER_VERIFIED",
    entityType: "Member",
    entityId: "ARF-JG-2026-0014",
    summary:
      "Confirmed state chapter verification & issued digital ID slip for Ibrahim Sani Garba.",
  },
  {
    id: "AUD-2026-9036",
    timestamp: "2026-11-16T17:10:00Z",
    actorName: "Sadiq Danjuma",
    actorRole: "CONTENT_EDITOR",
    action: "MEDIA_ASSET_UPLOADED",
    entityType: "MediaAsset",
    entityId: "MED-2026-08",
    summary: "Added Gumel General Hospital outreach field photography to CMS Media Library.",
  },
];

export function loadAuditLogs(): AuditLogEntry[] {
  if (typeof window === "undefined") return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? (parsed as AuditLogEntry[])
      : INITIAL_AUDIT_LOGS;
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function appendAuditLog(params: {
  role: AdminRole;
  action: string;
  entityType: AuditLogEntry["entityType"];
  entityId: string;
  summary: string;
}): AuditLogEntry {
  const profile = getRoleProfile(params.role);
  const entry: AuditLogEntry = {
    id: `AUD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    actorName: profile.actorName,
    actorRole: params.role,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    summary: params.summary,
  };
  const updated = [entry, ...loadAuditLogs()].slice(0, 250);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("arf_admin_updated"));
    } catch {
      // ignore localStorage quota errors
    }
  }
  return entry;
}

export function exportAuditLogsCsv(logs: AuditLogEntry[]): void {
  const headers = [
    "Audit ID",
    "Timestamp (UTC)",
    "Actor Name",
    "Actor Role",
    "Action",
    "Entity Type",
    "Entity ID",
    "Summary",
  ];
  const rows = logs.map((log) => [
    log.id,
    log.timestamp,
    log.actorName,
    log.actorRole,
    log.action,
    log.entityType,
    log.entityId,
    log.summary,
  ]);
  exportRecordsToCsv(`ARF-Immutable-Audit-Log-${getTodayIsoDate()}.csv`, headers, rows);
}

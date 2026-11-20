import { useMemo, useState } from "react";
import { Check, FileSpreadsheet, History, Lock, Minus, Shield } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  exportAuditLogsCsv,
  hasPermission,
  PERMISSION_MATRIX_ROWS,
  ROLE_PROFILES,
  type AdminRole,
  type AuditLogEntry,
} from "@/data/admin/rbac";

interface GovernanceAuditViewProps {
  activeRole: AdminRole;
  onSelectRole: (role: AdminRole) => void;
  auditLogs: AuditLogEntry[];
}

export function GovernanceAuditView({
  activeRole,
  onSelectRole,
  auditLogs,
}: GovernanceAuditViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("All");

  const canViewAudit = hasPermission(activeRole, "audit:view");

  const filteredLogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return auditLogs.filter((entry) => {
      if (entityFilter !== "All" && entry.entityType !== entityFilter) return false;
      if (!q) return true;
      return (
        entry.actorName.toLowerCase().includes(q) ||
        entry.action.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        entry.entityId.toLowerCase().includes(q)
      );
    });
  }, [auditLogs, entityFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* NDPR Security & Architecture Summary Strip */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
              <Lock className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">NDPR Encrypted PII Protection</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                National Identity Numbers and inmate client full names remain masked inside list
                DTOs and encrypted via AES-256-GCM in PostgreSQL.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-xs">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-900">
              <Shield className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">5-Role Least-Privilege RBAC</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Use the top bar Role Switcher (or click any role column below) to verify UI action
                gating across Content Editors, Officers, Lawyers, and Leads.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-xs">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-800">
              <History className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Immutable Audit Ledger</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Every relief approval, CMS publication, case assignment, and member verification is
                logged chronologically with actor attribution.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RBAC Matrix Card */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base font-bold text-slate-900">
            5-Role RBAC Permission Matrix
          </CardTitle>
          <p className="text-xs text-slate-500">
            Click any role header to preview its permissions live inside this console.
          </p>
        </CardHeader>

        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[820px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 font-bold text-slate-700 uppercase">Capability</th>
                {ROLE_PROFILES.map((profile) => {
                  const selected = profile.role === activeRole;
                  return (
                    <th key={profile.role} className="px-3 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onSelectRole(profile.role)}
                        className={`cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors ${
                          selected
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {profile.label}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PERMISSION_MATRIX_ROWS.map((row) => (
                <tr key={row.permission} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{row.label}</p>
                    <p className="text-[11px] text-slate-500">{row.description}</p>
                  </td>
                  {ROLE_PROFILES.map((profile) => {
                    const allowed = hasPermission(profile.role, row.permission);
                    return (
                      <td
                        key={profile.role}
                        className={`px-3 py-3 text-center ${
                          profile.role === activeRole ? "bg-emerald-50/40" : ""
                        }`}
                      >
                        {allowed ? (
                          <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                            <Check className="size-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <Minus className="size-3.5" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Immutable Audit Log Card */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Immutable Operations &amp; CMS Audit Trail ({auditLogs.length})
            </CardTitle>
            <p className="text-xs text-slate-500">
              Append-only event log of all administrative and publishing mutations.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!canViewAudit}
            onClick={() => {
              exportAuditLogsCsv(filteredLogs);
              toast.success(`Exported ${filteredLogs.length} audit log events.`);
            }}
            className="min-h-10 text-xs font-bold"
          >
            <FileSpreadsheet className="mr-1.5 size-4" />
            Export Audit CSV
          </Button>
        </CardHeader>

        <CardContent className="p-4">
          {!canViewAudit ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-6 text-center text-xs text-amber-900">
              <strong>Access Restricted:</strong> Audit log inspection requires{" "}
              <span className="font-mono">Super Admin</span>,{" "}
              <span className="font-mono">Program Officer</span>, or{" "}
              <span className="font-mono">Legal Coordinator</span> role.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search audit events by actor, action, entity ID, or summary..."
                  className="flex-1"
                />
                <select
                  aria-label="Filter audit logs by entity type"
                  value={entityFilter}
                  onChange={(e) => setEntityFilter(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="All">All Entities</option>
                  <option value="CmsPage">CMS Pages</option>
                  <option value="CmsNav">Navigation</option>
                  <option value="MediaAsset">Media Assets</option>
                  <option value="Beneficiary">Beneficiaries</option>
                  <option value="DisbursementBatch">Disbursement Batches</option>
                  <option value="LegalCase">Legal Cases</option>
                  <option value="Attorney">Attorneys</option>
                  <option value="Member">Members</option>
                  <option value="StateChapter">State Chapters</option>
                </select>
              </div>

              <div className="overflow-x-auto rounded-md border border-slate-200">
                <table className="w-full min-w-[780px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600 uppercase">
                      <th className="px-3.5 py-2.5">Timestamp (UTC)</th>
                      <th className="px-3.5 py-2.5">Actor &amp; Role</th>
                      <th className="px-3.5 py-2.5">Action / Entity</th>
                      <th className="px-3.5 py-2.5">Event Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70">
                        <td className="px-3.5 py-3 font-mono text-[11px] text-slate-500">
                          {log.timestamp.slice(0, 19).replace("T", " ")}
                        </td>
                        <td className="px-3.5 py-3">
                          <p className="font-bold text-slate-900">{log.actorName}</p>
                          <Badge variant="outline" className="mt-0.5 text-[10px]">
                            {log.actorRole}
                          </Badge>
                        </td>
                        <td className="px-3.5 py-3">
                          <span className="font-mono text-[11px] font-bold text-emerald-800">
                            {log.action}
                          </span>
                          <p className="font-mono text-[10px] text-slate-500">
                            {log.entityType} · {log.entityId}
                          </p>
                        </td>
                        <td className="px-3.5 py-3 text-slate-700">{log.summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

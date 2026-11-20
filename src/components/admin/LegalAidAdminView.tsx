import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Download,
  Eye,
  FileSpreadsheet,
  Gavel,
  Plus,
  Scale,
  Trash2,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  assignLawyerToCase,
  deleteLegalCase,
  exportLegalCasesCsv,
  LEGAL_MILESTONES,
  saveLegalCase,
  updateLegalCaseMilestone,
  type LegalCaseRecord,
  type LegalMilestone,
} from "@/data/admin/operationsStore";
import { appendAuditLog, hasPermission, type AdminRole } from "@/data/admin/rbac";
import {
  deleteLawyerFromStorage,
  exportLawyersToCsv,
  saveLawyerVolunteer,
  updateLawyerStatus,
  type LawyerVolunteer,
} from "@/data/lawyersStore";
import { ALL_STATES } from "@/data/nigeriaStatesLgas";
import { downloadLawyerSlip } from "@/lib/generateLawyerSlip";

interface LegalAidAdminViewProps {
  activeRole: AdminRole;
  legalCases: LegalCaseRecord[];
  lawyers: LawyerVolunteer[];
  onRefresh: () => void;
}

const LAWYER_STATUSES: LawyerVolunteer["status"][] = [
  "Active Pro Bono",
  "Verified Advocate",
  "Under Review",
  "Removed",
];

function getLawyerStatusClass(status: LawyerVolunteer["status"]): string {
  if (status === "Removed") {
    return "rounded-full border border-red-300 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700";
  }
  if (status === "Under Review") {
    return "rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900";
  }
  return "rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-900";
}

function getMilestoneColor(milestone: LegalMilestone): string {
  switch (milestone) {
    case "Resolved / Acquitted":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "Hearing":
    case "Court Filing":
      return "border-indigo-200 bg-indigo-50 text-indigo-800";
    case "Assigned":
      return "border-sky-200 bg-sky-50 text-sky-800";
    default:
      return "border-amber-200 bg-amber-50 text-amber-800";
  }
}

export function LegalAidAdminView({
  activeRole,
  legalCases,
  lawyers,
  onRefresh,
}: LegalAidAdminViewProps) {
  const [subTab, setSubTab] = useState<"cases" | "attorneys">("cases");
  const [searchQuery, setSearchQuery] = useState("");
  const [milestoneFilter, setMilestoneFilter] = useState<string>("All");
  const [lawyerStatusFilter, setLawyerStatusFilter] = useState<string>("All");

  const [selectedCase, setSelectedCase] = useState<LegalCaseRecord | null>(null);
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerVolunteer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    kind: "case" | "lawyer";
    id: string;
    label: string;
  } | null>(null);

  // New Case Modal
  const [addCaseOpen, setAddCaseOpen] = useState(false);
  const [caseTitle, setCaseTitle] = useState("");
  const [clientInitials, setClientInitials] = useState("");
  const [caseIsInmate, setCaseIsInmate] = useState(true);
  const [caseCourt, setCaseCourt] = useState("");
  const [caseState, setCaseState] = useState("Jigawa");
  const [casePriority, setCasePriority] = useState<"Urgent" | "High" | "Standard">("Urgent");
  const [caseSummary, setCaseSummary] = useState("");

  // New Attorney Modal
  const [addLawyerOpen, setAddLawyerOpen] = useState(false);
  const [attName, setAttName] = useState("");
  const [attNba, setAttNba] = useState("");
  const [attFirm, setAttFirm] = useState("");
  const [attEmail, setAttEmail] = useState("");
  const [attPhone, setAttPhone] = useState("");
  const [attUni, setAttUni] = useState("Bayero University Kano (BUK)");
  const [attCallYear, setAttCallYear] = useState("2018");
  const [attState, setAttState] = useState("Jigawa");
  const [attCasesWon, setAttCasesWon] = useState("10");

  const canManageLegal = hasPermission(activeRole, "legal:manage");

  const filteredCases = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return legalCases.filter((c) => {
      if (milestoneFilter !== "All" && c.milestone !== milestoneFilter) return false;
      if (!q) return true;
      return (
        c.caseTitle.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.clientInitials.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        (c.assignedLawyerName ?? "").toLowerCase().includes(q)
      );
    });
  }, [legalCases, milestoneFilter, searchQuery]);

  const filteredLawyers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return lawyers.filter((l) => {
      if (lawyerStatusFilter !== "All" && l.status !== lawyerStatusFilter) return false;
      if (!q) return true;
      return (
        l.fullName.toLowerCase().includes(q) ||
        (l.nbaNumber ?? "").toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        (l.lawFirm ?? "").toLowerCase().includes(q) ||
        (l.jurisdictionState ?? "").toLowerCase().includes(q)
      );
    });
  }, [lawyers, lawyerStatusFilter, searchQuery]);

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageLegal || !caseTitle.trim()) return;
    const created = saveLegalCase({
      caseTitle: caseTitle.trim(),
      clientInitials: clientInitials.trim() || "J. D.",
      isInmate: caseIsInmate,
      facilityOrCourt: caseCourt.trim() || `${caseState} High Court / Remand Centre`,
      state: caseState,
      category: caseIsInmate
        ? "Unlawful Detention & Emergency Bail Defense"
        : "Public Interest & Family Rights",
      priority: casePriority,
      milestone: "Intake",
      summary: caseSummary.trim() || "Logged via Legal Aid Coordinator Console.",
    });
    appendAuditLog({
      role: activeRole,
      action: "LEGAL_CASE_LOGGED",
      entityType: "LegalCase",
      entityId: created.id,
      summary: `Logged indigent legal matter '${created.caseTitle}' (${created.state}).`,
    });
    setAddCaseOpen(false);
    setCaseTitle("");
    setClientInitials("");
    setCaseCourt("");
    setCaseSummary("");
    toast.success(`Logged case ${created.id}.`);
    onRefresh();
  };

  const handleOnboardAttorney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageLegal || !attName.trim() || !attEmail.trim()) return;
    const saved = saveLawyerVolunteer({
      fullName: attName.trim(),
      nbaNumber: attNba.trim() || undefined,
      lawFirm: attFirm.trim() || undefined,
      email: attEmail.trim(),
      phone: attPhone.trim() || "+234 800 000 0000",
      university: attUni.trim(),
      callToBarYear: attCallYear,
      casesWon: Number(attCasesWon) || 0,
      jurisdictionState: attState,
      practiceAreas: ["Criminal & Bail Defense", "Human Rights & Fundamental Enforcement"],
    });
    appendAuditLog({
      role: activeRole,
      action: "ATTORNEY_ONBOARDED",
      entityType: "Attorney",
      entityId: saved.id,
      summary: `Onboarded ${saved.fullName} (NBA: ${saved.nbaNumber ?? "Pending"}) in ${attState}.`,
    });
    setAddLawyerOpen(false);
    setAttName("");
    setAttNba("");
    setAttFirm("");
    setAttEmail("");
    setAttPhone("");
    toast.success(`Enrolled ${saved.fullName} (${saved.id}).`);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setSubTab("cases")}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold sm:text-sm ${
                  subTab === "cases"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Gavel className="size-4" />
                <span>Case Matching Engine ({legalCases.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSubTab("attorneys")}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold sm:text-sm ${
                  subTab === "attorneys"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Scale className="size-4" />
                <span>NBA Attorney Directory ({lawyers.length})</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {subTab === "cases" ? (
                <>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!canManageLegal}
                    onClick={() => setAddCaseOpen(true)}
                    className="min-h-10 bg-slate-900 text-xs font-bold text-white"
                  >
                    <Plus className="mr-1.5 size-4" />
                    Log Indigent / Inmate Case
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      exportLegalCasesCsv(filteredCases);
                      toast.success(`Exported ${filteredCases.length} legal case records.`);
                    }}
                    className="min-h-10 text-xs font-bold"
                  >
                    <FileSpreadsheet className="mr-1.5 size-4" />
                    Export Cases CSV
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!canManageLegal}
                    onClick={() => setAddLawyerOpen(true)}
                    className="min-h-10 bg-emerald-800 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    <Plus className="mr-1.5 size-4" />
                    Onboard Pro Bono Counsel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      exportLawyersToCsv(filteredLawyers);
                      toast.success(`Exported ${filteredLawyers.length} NBA counsel profiles.`);
                    }}
                    className="min-h-10 text-xs font-bold"
                  >
                    <FileSpreadsheet className="mr-1.5 size-4" />
                    Export Counsel CSV
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                subTab === "cases"
                  ? "Search cases by ID, title, inmate reference, state, or assigned counsel..."
                  : "Search counsel by name, NBA enrollment no. (SCN/...), law firm, or jurisdiction..."
              }
              className="flex-1"
            />
            {subTab === "cases" ? (
              <select
                aria-label="Filter by case milestone"
                value={milestoneFilter}
                onChange={(e) => setMilestoneFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-xs"
              >
                <option value="All">All Milestones</option>
                {LEGAL_MILESTONES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            ) : (
              <select
                aria-label="Filter by attorney status"
                value={lawyerStatusFilter}
                onChange={(e) => setLawyerStatusFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-xs"
              >
                <option value="All">All Counsel Statuses</option>
                {LAWYER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {subTab === "cases" ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                    <th className="px-4 py-3">Case Matter &amp; Client Ref</th>
                    <th className="px-4 py-3">Jurisdiction / Facility</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Assigned Counsel</th>
                    <th className="px-4 py-3">Milestone</th>
                    <th className="px-4 py-3 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCases.map((legalCase) => (
                    <tr key={legalCase.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {legalCase.isInmate && (
                            <Badge className="bg-rose-50 text-[10px] font-bold text-rose-800">
                              Inmate
                            </Badge>
                          )}
                          <p className="font-bold text-slate-900">{legalCase.caseTitle}</p>
                        </div>
                        <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                          {legalCase.id} · Client: {legalCase.clientInitials}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <p className="font-bold text-slate-800">{legalCase.state}</p>
                        <p className="max-w-[210px] truncate text-slate-500">
                          {legalCase.facilityOrCourt}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant="outline"
                          className={
                            legalCase.priority === "Urgent"
                              ? "border-rose-200 bg-rose-50 text-rose-800"
                              : "border-slate-200 bg-slate-50 text-slate-700"
                          }
                        >
                          {legalCase.priority === "Urgent" && (
                            <AlertTriangle className="mr-1 size-3" />
                          )}
                          {legalCase.priority}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        {legalCase.assignedLawyerName ? (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-800">
                            <UserCheck className="size-3.5" />
                            {legalCase.assignedLawyerName}
                          </span>
                        ) : (
                          <span className="font-semibold text-amber-700">
                            Unassigned — Match Needed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-bold ${getMilestoneColor(
                            legalCase.milestone,
                          )}`}
                        >
                          {legalCase.milestone}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedCase(legalCase)}
                            className="h-8 gap-1 text-xs font-bold"
                          >
                            <Eye className="size-3.5" />
                            Match / Track
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={!canManageLegal}
                            onClick={() =>
                              setDeleteTarget({
                                kind: "case",
                                id: legalCase.id,
                                label: legalCase.caseTitle,
                              })
                            }
                            className="size-8 text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                    <th className="px-4 py-3">Legal Advocate &amp; Chambers</th>
                    <th className="px-4 py-3">NBA Enrollment &amp; Bar ID</th>
                    <th className="px-4 py-3">Jurisdiction &amp; Record</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLawyers.map((lawyer) => (
                    <tr key={lawyer.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-900">{lawyer.fullName}</p>
                        <p className="text-xs text-slate-500">
                          {lawyer.lawFirm || "Independent Pro Bono Counsel"} · {lawyer.university}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge className="bg-slate-900 font-mono text-[11px] text-white">
                          NBA: {lawyer.nbaNumber || "Pending Check"}
                        </Badge>
                        <p className="mt-1 font-mono text-[11px] text-slate-500">{lawyer.id}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <p className="font-bold text-slate-800">
                          {lawyer.jurisdictionState || "Nigeria"}
                        </p>
                        <p className="flex items-center gap-1 text-emerald-700">
                          <Award className="size-3" />
                          <span>
                            {lawyer.casesWon} cases won (Call {lawyer.callToBarYear})
                          </span>
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          aria-label={`Change status for ${lawyer.fullName}`}
                          value={lawyer.status}
                          disabled={!canManageLegal}
                          onChange={(e) => {
                            const status = e.target.value as LawyerVolunteer["status"];
                            updateLawyerStatus(lawyer.id, status);
                            appendAuditLog({
                              role: activeRole,
                              action: "ATTORNEY_STATUS_UPDATED",
                              entityType: "Attorney",
                              entityId: lawyer.id,
                              summary: `Updated advocate ${lawyer.fullName} status to '${status}'.`,
                            });
                            toast.success(
                              status === "Verified Advocate" || status === "Active Pro Bono"
                                ? `Verified "${lawyer.fullName}" — Bar Accreditation Slip unlocked for phone lookup.`
                                : `Advocate status set to "${status}".`,
                            );
                            onRefresh();
                          }}
                          className={getLawyerStatusClass(lawyer.status)}
                        >
                          {LAWYER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedLawyer(lawyer)}
                            title="Inspect counsel dossier"
                          >
                            <Eye className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              void downloadLawyerSlip({
                                refNumber: lawyer.id,
                                fullName: lawyer.fullName,
                                email: lawyer.email,
                                phone: lawyer.phone,
                                university: lawyer.university,
                                callToBarYear: lawyer.callToBarYear,
                                casesWon: String(lawyer.casesWon),
                                submissionDate: lawyer.submissionDate,
                                lawFirm: lawyer.lawFirm,
                                jurisdictionState: lawyer.jurisdictionState,
                                practiceAreas: lawyer.practiceAreas,
                              })
                            }
                            title="Download pro bono slip"
                          >
                            <Download className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={!canManageLegal}
                            onClick={() =>
                              setDeleteTarget({
                                kind: "lawyer",
                                id: lawyer.id,
                                label: lawyer.fullName,
                              })
                            }
                            className="text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SLIDE-OVER CASE MATCHING & MILESTONE DRAWER */}
      <Sheet
        open={selectedCase !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedCase(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selectedCase && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedCase.caseTitle}</SheetTitle>
                <SheetDescription className="font-mono text-xs">
                  {selectedCase.id} · {selectedCase.state} · Client: {selectedCase.clientInitials}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6 text-xs sm:text-sm">
                <div className="rounded-md bg-slate-50 p-3.5 text-xs">
                  <p className="font-bold text-slate-900">
                    Matter Summary &amp; Detention Facility
                  </p>
                  <p className="mt-1 text-slate-600">{selectedCase.facilityOrCourt}</p>
                  <p className="mt-2 leading-relaxed text-slate-700">{selectedCase.summary}</p>
                </div>

                {/* 5-Step Milestone Stepper */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                    Milestone Progression Stepper
                  </Label>
                  <div className="space-y-1.5">
                    {LEGAL_MILESTONES.map((step, idx) => {
                      const active = selectedCase.milestone === step;
                      const currentIdx = LEGAL_MILESTONES.indexOf(selectedCase.milestone);
                      const completed = idx < currentIdx;

                      return (
                        <button
                          key={step}
                          type="button"
                          disabled={!canManageLegal}
                          onClick={() => {
                            updateLegalCaseMilestone(selectedCase.id, step);
                            setSelectedCase({ ...selectedCase, milestone: step });
                            appendAuditLog({
                              role: activeRole,
                              action: "CASE_MILESTONE_UPDATED",
                              entityType: "LegalCase",
                              entityId: selectedCase.id,
                              summary: `Advanced legal case ${selectedCase.id} milestone to '${step}'.`,
                            });
                            toast.success(`Milestone updated to "${step}".`);
                            onRefresh();
                          }}
                          className={`flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left text-xs font-bold transition-colors ${
                            active
                              ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                              : completed
                                ? "border-emerald-200 bg-white text-emerald-700"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span>
                            0{idx + 1}. {step}
                          </span>
                          {(active || completed) && <CheckCircle2 className="size-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Assign NBA Pro Bono Counsel */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <Label className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                    Match Verified Pro Bono Attorney
                  </Label>
                  <select
                    value={selectedCase.assignedLawyerId ?? ""}
                    disabled={!canManageLegal}
                    onChange={(e) => {
                      const lawyer = lawyers.find((l) => l.id === e.target.value);
                      if (!lawyer) return;
                      assignLawyerToCase(selectedCase.id, lawyer.id, lawyer.fullName);
                      setSelectedCase({
                        ...selectedCase,
                        assignedLawyerId: lawyer.id,
                        assignedLawyerName: lawyer.fullName,
                        milestone:
                          selectedCase.milestone === "Intake" ? "Assigned" : selectedCase.milestone,
                      });
                      appendAuditLog({
                        role: activeRole,
                        action: "CASE_COUNSEL_ASSIGNED",
                        entityType: "LegalCase",
                        entityId: selectedCase.id,
                        summary: `Assigned ${lawyer.fullName} (${lawyer.nbaNumber ?? lawyer.id}) to case ${selectedCase.id}.`,
                      });
                      toast.success(`Assigned ${lawyer.fullName} to case.`);
                      onRefresh();
                    }}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs font-semibold"
                  >
                    <option value="">-- Select Verified NBA Counsel --</option>
                    {lawyers.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.fullName} ({l.jurisdictionState || "Nigeria"} · {l.nbaNumber || l.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ATTORNEY DETAIL DRAWER */}
      <Sheet
        open={selectedLawyer !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedLawyer(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selectedLawyer && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedLawyer.fullName}</SheetTitle>
                <SheetDescription className="font-mono text-xs">
                  {selectedLawyer.id} · NBA: {selectedLawyer.nbaNumber || "Pending Verification"}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-xs">
                <dl className="grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">Chambers</dt>
                    <dd className="mt-1 font-bold">{selectedLawyer.lawFirm || "Independent"}</dd>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">Jurisdiction</dt>
                    <dd className="mt-1 font-bold">
                      {selectedLawyer.jurisdictionState || "Nigeria"}
                    </dd>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">Call to Bar</dt>
                    <dd className="mt-1 font-bold">{selectedLawyer.callToBarYear}</dd>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">Cases Won</dt>
                    <dd className="mt-1 font-bold text-emerald-800">{selectedLawyer.casesWon}</dd>
                  </div>
                </dl>
                {selectedLawyer.bio && (
                  <p className="rounded-md border border-slate-200 p-3 leading-relaxed text-slate-600">
                    {selectedLawyer.bio}
                  </p>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* LOG CASE MODAL */}
      <Dialog open={addCaseOpen} onOpenChange={setAddCaseOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Indigent / Inmate Legal Aid Case</DialogTitle>
            <DialogDescription>
              Create confidential intake record for immediate matching with NBA pro bono counsel.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCase} className="space-y-3">
            <div className="space-y-1">
              <Label>Case Matter Title *</Label>
              <Input
                required
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                placeholder="e.g. Pretrial Bail Application — Unrepresented Detainee"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Client Initials / NDPR Ref *</Label>
                <Input
                  required
                  value={clientInitials}
                  onChange={(e) => setClientInitials(e.target.value)}
                  placeholder="e.g. A. K. (Custodial #208)"
                />
              </div>
              <div className="space-y-1">
                <Label>State Jurisdiction</Label>
                <select
                  value={caseState}
                  onChange={(e) => setCaseState(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  {ALL_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Priority Level</Label>
                <select
                  value={casePriority}
                  onChange={(e) =>
                    setCasePriority(e.target.value as "Urgent" | "High" | "Standard")
                  }
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  <option value="Urgent">Urgent (Detained / Inmate)</option>
                  <option value="High">High</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={caseIsInmate}
                    onChange={(e) => setCaseIsInmate(e.target.checked)}
                  />
                  Custodial / Inmate Matter
                </label>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Court Division / Custodial Facility</Label>
                <Input
                  value={caseCourt}
                  onChange={(e) => setCaseCourt(e.target.value)}
                  placeholder="e.g. Dutse Magistrate Court / Gumel Custodial Centre"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Case Facts &amp; Relief Sought</Label>
                <Textarea value={caseSummary} onChange={(e) => setCaseSummary(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddCaseOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-slate-900 text-white">
                Create Legal Case
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ONBOARD ATTORNEY MODAL */}
      <Dialog open={addLawyerOpen} onOpenChange={setAddLawyerOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Onboard Verified Pro Bono Attorney</DialogTitle>
            <DialogDescription>
              Register Bar-admitted counsel directly into the public &amp; internal directory.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOnboardAttorney} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <Label>Advocate Full Name *</Label>
                <Input
                  required
                  value={attName}
                  onChange={(e) => setAttName(e.target.value)}
                  placeholder="Barr. Fatima Musa Esq."
                />
              </div>
              <div className="space-y-1">
                <Label>NBA Enrollment No. (SCN)</Label>
                <Input
                  value={attNba}
                  onChange={(e) => setAttNba(e.target.value)}
                  placeholder="SCN/124890"
                />
              </div>
              <div className="space-y-1">
                <Label>Law Firm / Chambers</Label>
                <Input value={attFirm} onChange={(e) => setAttFirm(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Email *</Label>
                <Input
                  required
                  type="email"
                  value={attEmail}
                  onChange={(e) => setAttEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input value={attPhone} onChange={(e) => setAttPhone(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>University (LL.B)</Label>
                <Input value={attUni} onChange={(e) => setAttUni(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Jurisdiction State</Label>
                <select
                  value={attState}
                  onChange={(e) => setAttState(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  {ALL_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Call to Bar Year</Label>
                <Input value={attCallYear} onChange={(e) => setAttCallYear(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Cases Won</Label>
                <Input
                  type="number"
                  value={attCasesWon}
                  onChange={(e) => setAttCasesWon(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddLawyerOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-800 text-white">
                Add to Directory
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Removal</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently remove <strong>{deleteTarget?.label}</strong> from this registry?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deleteTarget) return;
                if (deleteTarget.kind === "case") {
                  deleteLegalCase(deleteTarget.id);
                } else {
                  deleteLawyerFromStorage(deleteTarget.id);
                }
                appendAuditLog({
                  role: activeRole,
                  action: deleteTarget.kind === "case" ? "LEGAL_CASE_DELETED" : "ATTORNEY_REMOVED",
                  entityType: deleteTarget.kind === "case" ? "LegalCase" : "Attorney",
                  entityId: deleteTarget.id,
                  summary: `Removed ${deleteTarget.kind} '${deleteTarget.label}'.`,
                });
                toast.success(
                  deleteTarget.kind === "lawyer"
                    ? `Removed ${deleteTarget.label} — phone lookup will now show Removed/Deleted status in red.`
                    : `Removed ${deleteTarget.label}.`,
                );
                setDeleteTarget(null);
                onRefresh();
              }}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

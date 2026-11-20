import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  CheckCircle2,
  Eye,
  FileSpreadsheet,
  Filter,
  Lock,
  PackageCheck,
  Plus,
  Printer,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  bulkUpdateBeneficiaryStatus,
  deleteBeneficiary,
  exportBatchesCsv,
  exportBeneficiariesCsv,
  RELIEF_PIPELINES,
  saveBatch,
  saveBeneficiary,
  updateBatchStatus,
  updateBeneficiaryStatus,
  type BeneficiaryAidStatus,
  type BeneficiaryRecord,
  type DisbursementBatch,
  type ReliefPipeline,
  type VulnerabilityClass,
} from "@/data/admin/operationsStore";
import { appendAuditLog, getRoleProfile, hasPermission, type AdminRole } from "@/data/admin/rbac";
import { ALL_STATES, getLgasForState } from "@/data/nigeriaStatesLgas";
import { compressPassportPhoto, getTodayIsoDate } from "@/lib/utils";

interface ReliefPortalViewProps {
  activeRole: AdminRole;
  beneficiaries: BeneficiaryRecord[];
  batches: DisbursementBatch[];
  onRefresh: () => void;
}

type SortKey = "fullName" | "state" | "aidValueNgn" | "status";

const VULNERABILITY_OPTIONS: VulnerabilityClass[] = [
  "Persons with Disabilities",
  "Students",
  "Inmates",
  "Widows & Orphans",
  "Indigent Household",
];

const AID_STATUSES: BeneficiaryAidStatus[] = [
  "Applied",
  "Under Verification",
  "Approved",
  "Disbursed",
  "Rejected",
];

const PAGE_SIZE = 7;

function getAidStatusBadge(status: BeneficiaryAidStatus | DisbursementBatch["status"]): string {
  switch (status) {
    case "Disbursed":
    case "Verified & Disbursed":
    case "Approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "Under Verification":
    case "In Transit":
      return "border-sky-200 bg-sky-50 text-sky-800";
    case "Rejected":
      return "border-rose-200 bg-rose-50 text-rose-800";
    default:
      return "border-amber-200 bg-amber-50 text-amber-800";
  }
}

export function ReliefPortalView({
  activeRole,
  beneficiaries,
  batches,
  onRefresh,
}: ReliefPortalViewProps) {
  const [subTab, setSubTab] = useState<"beneficiaries" | "batches">("beneficiaries");
  const [pipelineFilter, setPipelineFilter] = useState<string>("All");
  const [vulnerabilityFilter, setVulnerabilityFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("fullName");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeBeneficiary, setActiveBeneficiary] = useState<BeneficiaryRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BeneficiaryRecord | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);

  // Add Beneficiary modal
  const [addBenOpen, setAddBenOpen] = useState(false);
  const [benName, setBenName] = useState("");
  const [benPhone, setBenPhone] = useState("");
  const [benState, setBenState] = useState("Jigawa");
  const [benLga, setBenLga] = useState("Gumel");
  const [benWard, setBenWard] = useState("");
  const [benVulnerability, setBenVulnerability] =
    useState<VulnerabilityClass>("Indigent Household");
  const [benPipeline, setBenPipeline] = useState<ReliefPipeline>("Food & Palliative Distribution");
  const [benNin, setBenNin] = useState("");
  const [benValue, setBenValue] = useState("35000");
  const [benNotes, setBenNotes] = useState("");

  // Log Batch modal
  const [addBatchOpen, setAddBatchOpen] = useState(false);
  const [batchTitle, setBatchTitle] = useState("");
  const [batchPipeline, setBatchPipeline] = useState<ReliefPipeline>(
    "Food & Palliative Distribution",
  );
  const [batchState, setBatchState] = useState("Jigawa");
  const [batchLga, setBatchLga] = useState("Gumel");
  const [batchUnits, setBatchUnits] = useState("150");
  const [batchUnitLabel, setBatchUnitLabel] = useState("Food Cartons");
  const [batchValue, setBatchValue] = useState("850000");
  const [batchProofUrl, setBatchProofUrl] = useState("");

  const roleProfile = getRoleProfile(activeRole);
  const canManageRelief = hasPermission(activeRole, "relief:manage");
  const canApproveDisbursements = hasPermission(activeRole, "disbursements:approve");

  const benLgas = useMemo(() => getLgasForState(benState), [benState]);
  const batchLgas = useMemo(() => getLgasForState(batchState), [batchState]);

  const filteredBeneficiaries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = beneficiaries.filter((b) => {
      if (pipelineFilter !== "All" && b.programPipeline !== pipelineFilter) return false;
      if (vulnerabilityFilter !== "All" && b.vulnerabilityClass !== vulnerabilityFilter)
        return false;
      if (statusFilter !== "All" && b.status !== statusFilter) return false;
      if (!q) return true;
      return (
        b.fullName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.state.toLowerCase().includes(q) ||
        b.lga.toLowerCase().includes(q) ||
        b.wardOrInstitution.toLowerCase().includes(q)
      );
    });

    return filtered.sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      if (sortBy === "aidValueNgn") {
        return (a.aidValueNgn - b.aidValueNgn) * dir;
      }
      return a[sortBy].localeCompare(b[sortBy]) * dir;
    });
  }, [
    beneficiaries,
    pipelineFilter,
    vulnerabilityFilter,
    statusFilter,
    searchQuery,
    sortBy,
    sortAsc,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredBeneficiaries.length / PAGE_SIZE));
  const paginatedBeneficiaries = filteredBeneficiaries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const filteredBatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return batches.filter((bt) => {
      if (pipelineFilter !== "All" && bt.pipeline !== pipelineFilter) return false;
      if (!q) return true;
      return (
        bt.title.toLowerCase().includes(q) ||
        bt.id.toLowerCase().includes(q) ||
        bt.state.toLowerCase().includes(q)
      );
    });
  }, [batches, pipelineFilter, searchQuery]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(key);
      setSortAsc(true);
    }
  };

  const handleBulkStatus = (status: BeneficiaryAidStatus) => {
    if (!canManageRelief || selectedIds.length === 0) return;
    if (status === "Disbursed" && !canApproveDisbursements) {
      toast.error("Your RBAC role cannot finalize financial/aid disbursements.");
      return;
    }
    bulkUpdateBeneficiaryStatus(selectedIds, status);
    appendAuditLog({
      role: activeRole,
      action: `BENEFICIARIES_BULK_${status.toUpperCase().replace(/\s+/g, "_")}`,
      entityType: "Beneficiary",
      entityId: selectedIds.join(","),
      summary: `Updated ${selectedIds.length} beneficiary records in bulk to '${status}'.`,
    });
    toast.success(`Updated ${selectedIds.length} beneficiaries to "${status}".`);
    setSelectedIds([]);
    onRefresh();
  };

  const handleCreateBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageRelief || !benName.trim()) return;
    const created = saveBeneficiary({
      fullName: benName,
      phone: benPhone || "+234 800 000 0000",
      state: benState,
      lga: benLga || "Municipal",
      wardOrInstitution: benWard || `${benLga} Community Ward`,
      vulnerabilityClass: benVulnerability,
      programPipeline: benPipeline,
      ninRaw: benNin,
      ninVerified: benNin.replace(/\D/g, "").length === 11,
      aidValueNgn: Number(benValue) || 25000,
      notes: benNotes.trim() || undefined,
    });
    appendAuditLog({
      role: activeRole,
      action: "BENEFICIARY_REGISTERED",
      entityType: "Beneficiary",
      entityId: created.id,
      summary: `Registered beneficiary '${created.fullName}' (${created.vulnerabilityClass}, ${created.state}).`,
    });
    setAddBenOpen(false);
    setBenName("");
    setBenPhone("");
    setBenWard("");
    setBenNin("");
    setBenNotes("");
    toast.success(`Registered beneficiary ${created.id}.`);
    onRefresh();
  };

  const handleLogBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canApproveDisbursements || !batchTitle.trim()) return;
    const created = saveBatch({
      title: batchTitle.trim(),
      pipeline: batchPipeline,
      state: batchState,
      lga: batchLga || "Municipal",
      unitCount: Number(batchUnits) || 100,
      unitLabel: batchUnitLabel.trim() || "Packages",
      totalValueNgn: Number(batchValue) || 500000,
      status: "Verified & Disbursed",
      disbursedDate: getTodayIsoDate(),
      proofPhotoUrl: batchProofUrl || undefined,
      coordinatorName: roleProfile.actorName,
    });
    appendAuditLog({
      role: activeRole,
      action: "BATCH_DISBURSEMENT_LOGGED",
      entityType: "DisbursementBatch",
      entityId: created.id,
      summary: `Logged disbursement batch '${created.title}' (₦${created.totalValueNgn.toLocaleString()} across ${created.state}).`,
    });
    setAddBatchOpen(false);
    setBatchTitle("");
    setBatchProofUrl("");
    toast.success(`Logged disbursement batch ${created.id}.`);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* 5 Relief Program Pipeline Cards */}
      <section
        aria-label="Configured Relief Pipelines"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
      >
        {RELIEF_PIPELINES.map((pipeline) => {
          const active = pipelineFilter === pipeline;
          const count = beneficiaries.filter((b) => b.programPipeline === pipeline).length;
          const batchSum = batches
            .filter((bt) => bt.pipeline === pipeline)
            .reduce((s, bt) => s + bt.totalValueNgn, 0);

          return (
            <button
              key={pipeline}
              type="button"
              onClick={() => {
                setPipelineFilter((prev) => (prev === pipeline ? "All" : pipeline));
                setCurrentPage(1);
              }}
              className={`cursor-pointer rounded-lg border p-3.5 text-left transition-all ${
                active
                  ? "border-emerald-700 bg-emerald-50/70 shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-emerald-800">{count} applicants</span>
                <Filter className="size-3 text-slate-400" />
              </div>
              <p className="mt-1.5 line-clamp-2 text-xs font-bold text-slate-900">{pipeline}</p>
              <p className="mt-2 font-mono text-[11px] font-semibold text-slate-600">
                ₦{(batchSum / 1_000_000).toFixed(2)}M tracked
              </p>
            </button>
          );
        })}
      </section>

      {/* Main Module Card */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setSubTab("beneficiaries")}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold sm:text-sm ${
                  subTab === "beneficiaries"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users className="size-4" />
                <span>Beneficiary Registry ({beneficiaries.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSubTab("batches")}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold sm:text-sm ${
                  subTab === "batches"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <PackageCheck className="size-4" />
                <span>Batch Disbursement Tracker ({batches.length})</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {subTab === "beneficiaries" ? (
                <>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!canManageRelief}
                    onClick={() => setAddBenOpen(true)}
                    className="min-h-10 bg-emerald-800 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    <Plus className="mr-1.5 size-4" />
                    Register Beneficiary
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      exportBeneficiariesCsv(filteredBeneficiaries);
                      toast.success(`Exported ${filteredBeneficiaries.length} beneficiaries.`);
                    }}
                    className="min-h-10 text-xs font-bold"
                  >
                    <FileSpreadsheet className="mr-1.5 size-4" />
                    Export CSV
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!canApproveDisbursements}
                    onClick={() => setAddBatchOpen(true)}
                    className="min-h-10 bg-slate-900 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    <Plus className="mr-1.5 size-4" />
                    Log Disbursement Batch
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      exportBatchesCsv(filteredBatches);
                      toast.success(`Exported ${filteredBatches.length} batch records.`);
                    }}
                    className="min-h-10 text-xs font-bold"
                  >
                    <FileSpreadsheet className="mr-1.5 size-4" />
                    CSV
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => window.print()}
                    className="min-h-10 text-xs font-bold"
                  >
                    <Printer className="mr-1.5 size-4" />
                    Print PDF Audit
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={
                subTab === "beneficiaries"
                  ? "Search by beneficiary name, ID, ward, hospital, school, or LGA..."
                  : "Search batches by code, title, or state..."
              }
              className="flex-1"
            />

            {subTab === "beneficiaries" && (
              <div className="flex flex-wrap gap-2">
                <select
                  aria-label="Filter by vulnerability classification"
                  value={vulnerabilityFilter}
                  onChange={(e) => {
                    setVulnerabilityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="All">All Vulnerability Classes</option>
                  {VULNERABILITY_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filter by aid status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="All">All Aid Statuses</option>
                  {AID_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Bulk Action Bar */}
          {subTab === "beneficiaries" && selectedIds.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs">
              <span className="font-bold text-emerald-950">
                {selectedIds.length} beneficiary record(s) selected
              </span>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={!canManageRelief}
                  onClick={() => handleBulkStatus("Approved")}
                  className="h-8 bg-emerald-800 text-xs font-bold text-white"
                >
                  Bulk Approve
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={!canApproveDisbursements}
                  onClick={() => handleBulkStatus("Disbursed")}
                  className="h-8 bg-slate-900 text-xs font-bold text-white"
                >
                  Mark Disbursed
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedIds([])}
                  className="h-8 text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {subTab === "beneficiaries" ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                      <th className="w-10 px-4 py-3">
                        <Checkbox
                          aria-label="Select all visible beneficiaries"
                          checked={
                            paginatedBeneficiaries.length > 0 &&
                            paginatedBeneficiaries.every((b) => selectedIds.includes(b.id))
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedIds(paginatedBeneficiaries.map((b) => b.id));
                            } else {
                              setSelectedIds([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleSort("fullName")}
                          className="inline-flex cursor-pointer items-center gap-1 hover:text-slate-900"
                        >
                          <span>Beneficiary</span>
                          <ArrowUpDown className="size-3" />
                        </button>
                      </th>
                      <th className="px-4 py-3">Vulnerability &amp; NIN (NDPR)</th>
                      <th className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleSort("state")}
                          className="inline-flex cursor-pointer items-center gap-1 hover:text-slate-900"
                        >
                          <span>Location</span>
                          <ArrowUpDown className="size-3" />
                        </button>
                      </th>
                      <th className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleSort("aidValueNgn")}
                          className="inline-flex cursor-pointer items-center gap-1 hover:text-slate-900"
                        >
                          <span>Aid Value</span>
                          <ArrowUpDown className="size-3" />
                        </button>
                      </th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedBeneficiaries.map((ben) => {
                      const isChecked = selectedIds.includes(ben.id);
                      return (
                        <tr key={ben.id} className="hover:bg-slate-50/70">
                          <td className="px-4 py-3">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                setSelectedIds((prev) =>
                                  checked ? [...prev, ben.id] : prev.filter((id) => id !== ben.id),
                                );
                              }}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-900">{ben.fullName}</p>
                            <p className="font-mono text-[11px] text-slate-500">
                              {ben.id} · {ben.programPipeline}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-[11px] font-semibold">
                              {ben.vulnerabilityClass}
                            </Badge>
                            <div className="mt-1 flex items-center gap-1 font-mono text-[11px] text-slate-500">
                              <Lock className="size-3 text-emerald-700" />
                              <span>{ben.ninMasked}</span>
                              {ben.ninVerified && (
                                <CheckCircle2 className="size-3 text-emerald-600" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <p className="font-semibold text-slate-800">
                              {ben.lga}, {ben.state}
                            </p>
                            <p className="max-w-[200px] truncate text-slate-500">
                              {ben.wardOrInstitution}
                            </p>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs font-bold text-slate-900">
                            ₦{ben.aidValueNgn.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={`text-[11px] font-bold ${getAidStatusBadge(ben.status)}`}
                            >
                              {ben.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => setActiveBeneficiary(ben)}
                                className="h-8 gap-1 px-2 text-xs font-semibold"
                              >
                                <Eye className="size-3.5" />
                                Details
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                disabled={!canManageRelief}
                                onClick={() => setDeleteTarget(ben)}
                                className="size-8 text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-600">
                <span>
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> (
                  {filteredBeneficiaries.length} matching records)
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="h-8 text-xs"
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="h-8 text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                    <th className="px-4 py-3">Batch &amp; Pipeline</th>
                    <th className="px-4 py-3">State / LGA</th>
                    <th className="px-4 py-3">Volume &amp; Value</th>
                    <th className="px-4 py-3">Date &amp; Lead</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Proof Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBatches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-900">{batch.title}</p>
                        <p className="font-mono text-[11px] text-slate-500">
                          {batch.id} · {batch.pipeline}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <p className="font-bold text-slate-800">{batch.state}</p>
                        <p className="text-slate-500">{batch.lga}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <p className="font-mono font-bold text-emerald-800">
                          ₦{batch.totalValueNgn.toLocaleString()}
                        </p>
                        <p className="text-slate-500">
                          {batch.unitCount.toLocaleString()} {batch.unitLabel}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600">
                        <p>{batch.disbursedDate}</p>
                        <p className="text-[11px] text-slate-500">{batch.coordinatorName}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          aria-label={`Batch status for ${batch.id}`}
                          value={batch.status}
                          disabled={!canApproveDisbursements}
                          onChange={(e) => {
                            const nextStatus = e.target.value as DisbursementBatch["status"];
                            updateBatchStatus(batch.id, nextStatus);
                            appendAuditLog({
                              role: activeRole,
                              action: "BATCH_STATUS_UPDATED",
                              entityType: "DisbursementBatch",
                              entityId: batch.id,
                              summary: `Updated batch ${batch.id} status to '${nextStatus}'.`,
                            });
                            toast.success(`Batch ${batch.id} marked "${nextStatus}".`);
                            onRefresh();
                          }}
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${getAidStatusBadge(
                            batch.status,
                          )}`}
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Verified & Disbursed">Verified &amp; Disbursed</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {batch.proofPhotoUrl ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setProofPreviewUrl(batch.proofPhotoUrl ?? null)}
                            className="h-8 gap-1 text-xs"
                          >
                            <Eye className="size-3.5" />
                            View Photo
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-400">Pending Upload</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SLIDE-OVER BENEFICIARY DRAWER */}
      <Sheet
        open={activeBeneficiary !== null}
        onOpenChange={(open) => {
          if (!open) setActiveBeneficiary(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {activeBeneficiary && (
            <>
              <SheetHeader>
                <SheetTitle>{activeBeneficiary.fullName}</SheetTitle>
                <SheetDescription className="font-mono text-xs">
                  {activeBeneficiary.id} · {activeBeneficiary.programPipeline}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-5 text-sm">
                <div className="rounded-md border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-950">
                      <Lock className="size-3.5" />
                      NDPR Protected NIN Record
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        activeBeneficiary.ninVerified
                          ? "border-emerald-300 bg-white text-emerald-800"
                          : "border-amber-300 bg-white text-amber-800"
                      }
                    >
                      {activeBeneficiary.ninVerified ? "NIN Verified" : "Pending Check"}
                    </Badge>
                  </div>
                  <p className="mt-1.5 font-mono text-slate-700">{activeBeneficiary.ninMasked}</p>
                  {canManageRelief && !activeBeneficiary.ninVerified && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        updateBeneficiaryStatus(activeBeneficiary.id, { ninVerified: true });
                        setActiveBeneficiary({ ...activeBeneficiary, ninVerified: true });
                        appendAuditLog({
                          role: activeRole,
                          action: "BENEFICIARY_NIN_VERIFIED",
                          entityType: "Beneficiary",
                          entityId: activeBeneficiary.id,
                          summary: `Marked NIN check verified for '${activeBeneficiary.fullName}'.`,
                        });
                        toast.success("Beneficiary NIN check marked verified.");
                        onRefresh();
                      }}
                      className="mt-3 h-8 bg-emerald-800 text-xs font-bold text-white"
                    >
                      <ShieldCheck className="mr-1.5 size-3.5" />
                      Confirm Identity Verification
                    </Button>
                  )}
                </div>

                <dl className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">Vulnerability</dt>
                    <dd className="mt-1 font-bold text-slate-900">
                      {activeBeneficiary.vulnerabilityClass}
                    </dd>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">Aid Allocation</dt>
                    <dd className="mt-1 font-mono font-bold text-emerald-800">
                      ₦{activeBeneficiary.aidValueNgn.toLocaleString()}
                    </dd>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">Location</dt>
                    <dd className="mt-1 font-bold text-slate-900">
                      {activeBeneficiary.lga}, {activeBeneficiary.state}
                    </dd>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">Phone</dt>
                    <dd className="mt-1 font-bold text-slate-900">{activeBeneficiary.phone}</dd>
                  </div>
                  <div className="col-span-2 rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">Ward / Facility / School</dt>
                    <dd className="mt-1 font-bold text-slate-900">
                      {activeBeneficiary.wardOrInstitution}
                    </dd>
                  </div>
                </dl>

                {activeBeneficiary.notes && (
                  <div className="rounded-md border border-slate-200 p-3 text-xs text-slate-600">
                    <p className="font-bold text-slate-900">Field Coordinator Notes</p>
                    <p className="mt-1 leading-relaxed">{activeBeneficiary.notes}</p>
                  </div>
                )}

                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <Label className="text-xs font-bold">Update Disbursement Workflow Status</Label>
                  <select
                    value={activeBeneficiary.status}
                    disabled={!canManageRelief}
                    onChange={(e) => {
                      const nextStatus = e.target.value as BeneficiaryAidStatus;
                      if (nextStatus === "Disbursed" && !canApproveDisbursements) {
                        toast.error(
                          "Disbursement release requires Program Officer or Super Admin.",
                        );
                        return;
                      }
                      updateBeneficiaryStatus(activeBeneficiary.id, { status: nextStatus });
                      setActiveBeneficiary({ ...activeBeneficiary, status: nextStatus });
                      appendAuditLog({
                        role: activeRole,
                        action: "BENEFICIARY_STATUS_UPDATED",
                        entityType: "Beneficiary",
                        entityId: activeBeneficiary.id,
                        summary: `Changed '${activeBeneficiary.fullName}' relief status to '${nextStatus}'.`,
                      });
                      toast.success(`Updated status to "${nextStatus}".`);
                      onRefresh();
                    }}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-semibold"
                  >
                    {AID_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* REGISTER BENEFICIARY MODAL */}
      <Dialog open={addBenOpen} onOpenChange={setAddBenOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Register Beneficiary Application</DialogTitle>
            <DialogDescription>
              Log citizen, student, PWD, or inmate support request with NDPR NIN masking.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateBeneficiary} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <Label>Full Name / Custodial Initials *</Label>
                <Input required value={benName} onChange={(e) => setBenName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Phone / Desk Contact</Label>
                <Input value={benPhone} onChange={(e) => setBenPhone(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>11-Digit NIN (Masked Automatically)</Label>
                <Input
                  value={benNin}
                  onChange={(e) => setBenNin(e.target.value)}
                  placeholder="Optional · encrypted/masked"
                />
              </div>
              <div className="space-y-1">
                <Label>State</Label>
                <select
                  value={benState}
                  onChange={(e) => {
                    setBenState(e.target.value);
                    setBenLga(getLgasForState(e.target.value)[0] ?? "");
                  }}
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
                <Label>LGA</Label>
                <select
                  value={benLga}
                  onChange={(e) => setBenLga(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  {benLgas.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Ward / School / Hospital / Correctional Facility</Label>
                <Input
                  value={benWard}
                  onChange={(e) => setBenWard(e.target.value)}
                  placeholder="e.g. Gumel General Hospital / Dutse Special School"
                />
              </div>
              <div className="space-y-1">
                <Label>Vulnerability Classification</Label>
                <select
                  value={benVulnerability}
                  onChange={(e) => setBenVulnerability(e.target.value as VulnerabilityClass)}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  {VULNERABILITY_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Relief Pipeline</Label>
                <select
                  value={benPipeline}
                  onChange={(e) => setBenPipeline(e.target.value as ReliefPipeline)}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  {RELIEF_PIPELINES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Estimated Aid / Grant Value (₦ NGN)</Label>
                <Input
                  type="number"
                  value={benValue}
                  onChange={(e) => setBenValue(e.target.value)}
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Verification Notes</Label>
                <Textarea value={benNotes} onChange={(e) => setBenNotes(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddBenOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-800 text-white">
                Register Beneficiary
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* LOG DISBURSEMENT BATCH MODAL */}
      <Dialog open={addBatchOpen} onOpenChange={setAddBatchOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Log State/LGA Disbursement Batch</DialogTitle>
            <DialogDescription>
              Record verified distribution volume, financial total, and proof-of-delivery image.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogBatch} className="space-y-3">
            <div className="space-y-1">
              <Label>Batch Title *</Label>
              <Input
                required
                value={batchTitle}
                onChange={(e) => setBatchTitle(e.target.value)}
                placeholder="e.g. Hadejia Widow Food Relief Distribution"
              />
            </div>
            <div className="space-y-1">
              <Label>Program Pipeline</Label>
              <select
                value={batchPipeline}
                onChange={(e) => setBatchPipeline(e.target.value as ReliefPipeline)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {RELIEF_PIPELINES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>State</Label>
                <select
                  value={batchState}
                  onChange={(e) => {
                    setBatchState(e.target.value);
                    setBatchLga(getLgasForState(e.target.value)[0] ?? "");
                  }}
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
                <Label>LGA</Label>
                <select
                  value={batchLga}
                  onChange={(e) => setBatchLga(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  {batchLgas.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Unit Quantity</Label>
                <Input
                  type="number"
                  value={batchUnits}
                  onChange={(e) => setBatchUnits(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Unit Label</Label>
                <Input value={batchUnitLabel} onChange={(e) => setBatchUnitLabel(e.target.value)} />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Total Verified Value (₦ NGN)</Label>
                <Input
                  type="number"
                  value={batchValue}
                  onChange={(e) => setBatchValue(e.target.value)}
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Proof-of-Delivery Photo / Receipt</Label>
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-emerald-600">
                  <Upload className="size-4" />
                  <span>{batchProofUrl ? "Proof photo attached ✓" : "Upload proof photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setBatchProofUrl(await compressPassportPhoto(file));
                      } catch {
                        toast.error("Could not compress proof photo.");
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddBatchOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-slate-900 text-white">
                Save Batch Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* PROOF PHOTO LIGHTBOX */}
      <Dialog
        open={proofPreviewUrl !== null}
        onOpenChange={(open) => {
          if (!open) setProofPreviewUrl(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Proof-of-Delivery Photo Record</DialogTitle>
          </DialogHeader>
          {proofPreviewUrl && (
            <img
              src={proofPreviewUrl}
              alt="Batch proof of delivery"
              className="max-h-[65vh] w-full rounded-md object-contain bg-slate-950"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE BENEFICIARY CONFIRM */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove beneficiary record?</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently remove <strong>{deleteTarget?.fullName}</strong> from the local
              beneficiary registry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deleteTarget) return;
                deleteBeneficiary(deleteTarget.id);
                appendAuditLog({
                  role: activeRole,
                  action: "BENEFICIARY_DELETED",
                  entityType: "Beneficiary",
                  entityId: deleteTarget.id,
                  summary: `Deleted beneficiary record '${deleteTarget.fullName}'.`,
                });
                toast.success(`Removed ${deleteTarget.fullName}.`);
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

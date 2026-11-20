import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  Download,
  Eye,
  FileSpreadsheet,
  HeartHandshake,
  MapPin,
  Megaphone,
  Plus,
  Trash2,
  Upload,
  UserCog,
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  addChapterAnnouncement,
  updateChapterCoordinator,
  type ChapterCoordinationRecord,
} from "@/data/admin/operationsStore";
import { appendAuditLog, hasPermission, type AdminRole } from "@/data/admin/rbac";
import {
  deleteMemberFromStorage,
  exportMembersToCsv,
  saveMemberToStorage,
  updateMemberStatus,
  type Member,
  type MembershipTier,
} from "@/data/membershipStore";
import { ALL_STATES, getLgasForState } from "@/data/nigeriaStatesLgas";
import {
  deleteVolunteerFromStorage,
  updateVolunteerStatus,
  type VolunteerRecord,
} from "@/data/volunteersStore";
import { downloadMembershipCard } from "@/lib/generateMembershipSlip";
import { downloadVolunteerSlip } from "@/lib/generateVolunteerSlip";
import { compressPassportPhoto, exportRecordsToCsv, formatDate } from "@/lib/utils";

interface CommunityChaptersViewProps {
  activeRole: AdminRole;
  members: Member[];
  volunteers: VolunteerRecord[];
  chapters: ChapterCoordinationRecord[];
  onRefresh: () => void;
}

const MEMBER_TIERS: MembershipTier[] = [
  "Standard Member",
  "Youth Ambassador",
  "Volunteer Corps",
  "Executive Supporter",
  "Patron",
];

const MEMBER_STATUSES: Member["status"][] = [
  "Pending",
  "Active",
  "Verified",
  "Honorary",
  "Removed",
];
const VOLUNTEER_STATUSES: VolunteerRecord["status"][] = [
  "Pending Briefing",
  "Verified Volunteer",
  "Deployed",
  "Removed",
];

function getCommunityStatusClass(status: Member["status"] | VolunteerRecord["status"]): string {
  if (status === "Removed") {
    return "rounded-full border border-red-300 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700";
  }
  if (status === "Pending" || status === "Active" || status === "Pending Briefing") {
    return "rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900";
  }
  return "rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-900";
}

const PAGE_SIZE = 7;

export function CommunityChaptersView({
  activeRole,
  members,
  volunteers,
  chapters,
  onRefresh,
}: CommunityChaptersViewProps) {
  const [subTab, setSubTab] = useState<"members" | "chapters" | "volunteers">("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [activeVolunteer, setActiveVolunteer] = useState<VolunteerRecord | null>(null);
  const [activeChapter, setActiveChapter] = useState<ChapterCoordinationRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    kind: "member" | "volunteer";
    id: string;
    name: string;
  } | null>(null);

  // Add Member Modal
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newState, setNewState] = useState("Jigawa");
  const [newLga, setNewLga] = useState("Gumel");
  const [newTier, setNewTier] = useState<MembershipTier>("Standard Member");
  const [newOccupation, setNewOccupation] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  // Chapter Coordinator & Announcement Form
  const [coordName, setCoordName] = useState("");
  const [coordPhone, setCoordPhone] = useState("");
  const [coordEmail, setCoordEmail] = useState("");
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");

  const availableLgas = useMemo(() => getLgasForState(newState), [newState]);

  useEffect(() => {
    if (availableLgas.length > 0 && !availableLgas.includes(newLga)) {
      setNewLga(availableLgas[0] ?? "");
    }
  }, [availableLgas, newLga]);

  useEffect(() => {
    if (activeChapter) {
      setCoordName(activeChapter.coordinatorName);
      setCoordPhone(activeChapter.coordinatorPhone);
      setCoordEmail(activeChapter.coordinatorEmail);
    }
  }, [activeChapter]);

  const canManageMembers = hasPermission(activeRole, "members:manage");
  const canManageChapters = hasPermission(activeRole, "chapters:manage");

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = members.filter((m) => {
      if (tierFilter !== "All" && m.tier !== tierFilter) return false;
      if (statusFilter !== "All" && m.status !== statusFilter) return false;
      if (!q) return true;
      return (
        m.fullName.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.state.toLowerCase().includes(q) ||
        m.lga.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      );
    });
    return list.sort((a, b) =>
      sortAsc ? a.fullName.localeCompare(b.fullName) : b.fullName.localeCompare(a.fullName),
    );
  }, [members, tierFilter, statusFilter, searchQuery, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));
  const paginatedMembers = filteredMembers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const filteredVolunteers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return volunteers.filter((v) => {
      if (!q) return true;
      return (
        v.fullName.toLowerCase().includes(q) ||
        v.refNumber.toLowerCase().includes(q) ||
        v.state.toLowerCase().includes(q) ||
        v.profession.toLowerCase().includes(q)
      );
    });
  }, [volunteers, searchQuery]);

  const filteredChapters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return chapters.filter((c) => {
      if (!q) return true;
      return (
        c.displayName.toLowerCase().includes(q) ||
        c.coordinatorName.toLowerCase().includes(q) ||
        c.headquarters.toLowerCase().includes(q)
      );
    });
  }, [chapters, searchQuery]);

  const handleBulkVerifyMembers = () => {
    if (!canManageMembers || selectedMemberIds.length === 0) return;
    for (const id of selectedMemberIds) {
      updateMemberStatus(id, "Verified");
    }
    appendAuditLog({
      role: activeRole,
      action: "MEMBERS_BULK_VERIFIED",
      entityType: "Member",
      entityId: selectedMemberIds.join(","),
      summary: `Approved & verified ${selectedMemberIds.length} member IDs.`,
    });
    toast.success(
      `Verified ${selectedMemberIds.length} members — Digital ID Cards are now unlocked for phone lookup.`,
    );
    setSelectedMemberIds([]);
    onRefresh();
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageMembers || !newFullName.trim() || !newEmail.trim()) return;
    const created = saveMemberToStorage({
      fullName: newFullName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || undefined,
      state: newState,
      lga: newLga || "Municipal",
      occupation: newOccupation.trim() || undefined,
      tier: newTier,
      photoUrl: newPhotoUrl || undefined,
    });
    appendAuditLog({
      role: activeRole,
      action: "MEMBER_CREATED",
      entityType: "Member",
      entityId: created.id,
      summary: `Registered member '${created.fullName}' (${created.state} / ${created.tier}).`,
    });
    setAddMemberOpen(false);
    setNewFullName("");
    setNewEmail("");
    setNewPhone("");
    setNewOccupation("");
    setNewPhotoUrl("");
    toast.success(`Registered ${created.fullName} (${created.id}).`);
    onRefresh();
  };

  const handleExportVolunteers = () => {
    const headers = [
      "Ref ID",
      "Full Name",
      "Email",
      "Phone",
      "State",
      "LGA",
      "Profession",
      "Primary Activity",
      "Availability",
      "Status",
      "Submitted Date",
    ];
    const rows = filteredVolunteers.map((v) => [
      v.refNumber,
      v.fullName,
      v.email,
      v.phone,
      v.state,
      v.lga,
      v.profession,
      v.activity,
      v.availability,
      v.status,
      v.submissionDate,
    ]);
    exportRecordsToCsv("arf-volunteer-corps.csv", headers, rows);
    toast.success(`Exported ${filteredVolunteers.length} volunteers.`);
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setSubTab("members")}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold sm:text-sm ${
                  subTab === "members"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users className="size-4" />
                <span>Members Registry ({members.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSubTab("chapters")}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold sm:text-sm ${
                  subTab === "chapters"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MapPin className="size-4" />
                <span>State Chapters ({chapters.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSubTab("volunteers")}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold sm:text-sm ${
                  subTab === "volunteers"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <HeartHandshake className="size-4" />
                <span>Volunteer Corps ({volunteers.length})</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {subTab === "members" && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!canManageMembers}
                    onClick={() => setAddMemberOpen(true)}
                    className="min-h-10 bg-emerald-800 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    <Plus className="mr-1.5 size-4" />
                    Register Member
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      exportMembersToCsv(filteredMembers);
                      toast.success(`Exported ${filteredMembers.length} member IDs.`);
                    }}
                    className="min-h-10 text-xs font-bold"
                  >
                    <FileSpreadsheet className="mr-1.5 size-4" />
                    Export CSV
                  </Button>
                </>
              )}
              {subTab === "volunteers" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleExportVolunteers}
                  className="min-h-10 text-xs font-bold"
                >
                  <FileSpreadsheet className="mr-1.5 size-4" />
                  Export Volunteers CSV
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={
                subTab === "members"
                  ? "Search citizens by name, ARF ID, state, LGA, or email..."
                  : subTab === "chapters"
                    ? "Search state chapters or coordinator names..."
                    : "Search volunteers by name, ref ID, state, or profession..."
              }
              className="flex-1"
            />
            {subTab === "members" && (
              <div className="flex flex-wrap gap-2">
                <select
                  aria-label="Filter by membership tier"
                  value={tierFilter}
                  onChange={(e) => {
                    setTierFilter(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 rounded-md border border-input bg-background px-2.5 text-xs"
                >
                  <option value="All">All Tiers</option>
                  {MEMBER_TIERS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Filter by member status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 rounded-md border border-input bg-background px-2.5 text-xs"
                >
                  <option value="All">All Statuses</option>
                  {MEMBER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {subTab === "members" && selectedMemberIds.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs">
              <span className="font-bold text-emerald-950">
                {selectedMemberIds.length} member(s) selected
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={!canManageMembers}
                  onClick={handleBulkVerifyMembers}
                  className="h-8 bg-emerald-800 text-xs font-bold text-white"
                >
                  Bulk Verify IDs
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedMemberIds([])}
                  className="h-8 text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {/* MEMBERS TABLE */}
          {subTab === "members" && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                      <th className="w-10 px-4 py-3">
                        <Checkbox
                          aria-label="Select all visible members"
                          checked={
                            paginatedMembers.length > 0 &&
                            paginatedMembers.every((m) => selectedMemberIds.includes(m.id))
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedMemberIds(paginatedMembers.map((m) => m.id));
                            } else {
                              setSelectedMemberIds([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSortAsc(!sortAsc)}
                          className="inline-flex cursor-pointer items-center gap-1"
                        >
                          <span>Citizen Member</span>
                          <ArrowUpDown className="size-3" />
                        </button>
                      </th>
                      <th className="px-4 py-3">Membership ID &amp; Tier</th>
                      <th className="px-4 py-3">State / LGA</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={selectedMemberIds.includes(member.id)}
                            onCheckedChange={(checked) =>
                              setSelectedMemberIds((prev) =>
                                checked
                                  ? [...prev, member.id]
                                  : prev.filter((id) => id !== member.id),
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900">{member.fullName}</p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-mono text-xs font-bold">{member.id}</p>
                          <Badge variant="secondary" className="mt-1 text-[11px]">
                            {member.tier}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <p className="font-bold text-slate-800">{member.state}</p>
                          <p className="text-slate-500">{member.lga}</p>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            aria-label={`Change status for ${member.fullName}`}
                            value={member.status}
                            disabled={!canManageMembers}
                            onChange={(e) => {
                              const status = e.target.value as Member["status"];
                              updateMemberStatus(member.id, status);
                              appendAuditLog({
                                role: activeRole,
                                action: "MEMBER_STATUS_UPDATED",
                                entityType: "Member",
                                entityId: member.id,
                                summary: `Updated member '${member.fullName}' status to '${status}'.`,
                              });
                              toast.success(
                                status === "Verified" || status === "Honorary"
                                  ? `Verified "${member.fullName}" — Digital ID Card unlocked for phone lookup.`
                                  : `Updated member status to "${status}".`,
                              );
                              onRefresh();
                            }}
                            className={getCommunityStatusClass(member.status)}
                          >
                            {MEMBER_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => setActiveMember(member)}
                              title="Inspect member"
                            >
                              <Eye className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => void downloadMembershipCard(member)}
                              title="Download Digital ID Card"
                            >
                              <Download className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              disabled={!canManageMembers}
                              onClick={() =>
                                setDeleteTarget({
                                  kind: "member",
                                  id: member.id,
                                  name: member.fullName,
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

              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-600">
                <span>
                  Page <strong>{page}</strong> of <strong>{totalPages}</strong> (
                  {filteredMembers.length} citizens)
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-8 text-xs"
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="h-8 text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* STATE CHAPTERS DIRECTORY */}
          {subTab === "chapters" && (
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredChapters.map((chapter) => {
                const stateMembers = members.filter(
                  (m) => m.state.toLowerCase() === chapter.stateKey.toLowerCase(),
                ).length;
                return (
                  <Card key={chapter.id} className="border-slate-200 bg-slate-50/50 shadow-none">
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {chapter.tier}
                        </Badge>
                        <span className="text-xs font-bold text-emerald-800">
                          {stateMembers} members
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display text-base font-bold text-slate-900">
                          {chapter.displayName}
                        </h3>
                        <p className="text-xs text-slate-500">HQ: {chapter.headquarters}</p>
                      </div>

                      <div className="rounded-md border border-slate-200 bg-white p-2.5 text-xs">
                        <p className="font-bold text-slate-800">
                          Coordinator: {chapter.coordinatorName}
                        </p>
                        <p className="text-[11px] text-slate-500">{chapter.coordinatorEmail}</p>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveChapter(chapter)}
                        className="w-full gap-1.5 text-xs font-bold"
                      >
                        <UserCog className="size-3.5" />
                        Manage Chapter &amp; Notices
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* VOLUNTEER CORPS */}
          {subTab === "volunteers" && (
            <div className="overflow-x-auto">
              {filteredVolunteers.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  No citizen volunteer applications recorded on this device yet.
                </div>
              ) : (
                <table className="w-full min-w-[780px] border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                      <th className="px-4 py-3">Volunteer</th>
                      <th className="px-4 py-3">Ref ID &amp; Profession</th>
                      <th className="px-4 py-3">Location &amp; Activity</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVolunteers.map((vol) => (
                      <tr key={vol.refNumber} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900">{vol.fullName}</p>
                          <p className="text-xs text-slate-500">{vol.email}</p>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <p className="font-mono font-bold">{vol.refNumber}</p>
                          <p className="text-slate-500">{vol.profession}</p>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <p className="font-bold text-slate-800">
                            {vol.lga}, {vol.state}
                          </p>
                          <p className="text-slate-500">{vol.activity}</p>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            aria-label={`Change volunteer status for ${vol.fullName}`}
                            value={vol.status}
                            disabled={!canManageMembers}
                            onChange={(e) => {
                              const status = e.target.value as VolunteerRecord["status"];
                              updateVolunteerStatus(vol.refNumber, status);
                              appendAuditLog({
                                role: activeRole,
                                action: "VOLUNTEER_STATUS_UPDATED",
                                entityType: "Volunteer",
                                entityId: vol.refNumber,
                                summary: `Updated volunteer '${vol.fullName}' status to '${status}'.`,
                              });
                              toast.success(
                                status === "Verified Volunteer" || status === "Deployed"
                                  ? `Verified "${vol.fullName}" — Volunteer Slip unlocked for phone lookup.`
                                  : `Volunteer status updated to "${status}".`,
                              );
                              onRefresh();
                            }}
                            className={getCommunityStatusClass(vol.status)}
                          >
                            {VOLUNTEER_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => setActiveVolunteer(vol)}
                            >
                              <Eye className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => void downloadVolunteerSlip(vol)}
                            >
                              <Download className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              disabled={!canManageMembers}
                              onClick={() =>
                                setDeleteTarget({
                                  kind: "volunteer",
                                  id: vol.refNumber,
                                  name: vol.fullName,
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
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MEMBER SLIDE-OVER DRAWER */}
      <Sheet
        open={activeMember !== null}
        onOpenChange={(open) => {
          if (!open) setActiveMember(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {activeMember && (
            <>
              <SheetHeader>
                <SheetTitle>{activeMember.fullName}</SheetTitle>
                <SheetDescription className="font-mono text-xs">
                  {activeMember.id} · {activeMember.tier}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-xs">
                <dl className="grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">State / LGA</dt>
                    <dd className="mt-1 font-bold">
                      {activeMember.lga}, {activeMember.state}
                    </dd>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">Joined</dt>
                    <dd className="mt-1 font-bold">{formatDate(activeMember.joinedDate)}</dd>
                  </div>
                  <div className="col-span-2 rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">Contact</dt>
                    <dd className="mt-1 font-bold">
                      {activeMember.email} · {activeMember.phone || "No phone"}
                    </dd>
                  </div>
                </dl>
                <Button
                  type="button"
                  onClick={() => void downloadMembershipCard(activeMember)}
                  className="w-full gap-2 bg-emerald-800 text-xs font-bold text-white"
                >
                  <Download className="size-4" />
                  Download Official ARF Digital ID Card
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* VOLUNTEER SLIDE-OVER DRAWER */}
      <Sheet
        open={activeVolunteer !== null}
        onOpenChange={(open) => {
          if (!open) setActiveVolunteer(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {activeVolunteer && (
            <>
              <SheetHeader>
                <SheetTitle>{activeVolunteer.fullName}</SheetTitle>
                <SheetDescription className="font-mono text-xs">
                  {activeVolunteer.refNumber} · {activeVolunteer.profession}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-xs">
                <dl className="grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">State / LGA</dt>
                    <dd className="mt-1 font-bold">
                      {activeVolunteer.lga}, {activeVolunteer.state}
                    </dd>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">Availability</dt>
                    <dd className="mt-1 font-bold">{activeVolunteer.availability}</dd>
                  </div>
                </dl>
                <Button
                  type="button"
                  onClick={() => void downloadVolunteerSlip(activeVolunteer)}
                  className="w-full gap-2 bg-slate-900 text-xs font-bold text-white"
                >
                  <Download className="size-4" />
                  Download Volunteer Slip
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* CHAPTER COORDINATION SLIDE-OVER DRAWER */}
      <Sheet
        open={activeChapter !== null}
        onOpenChange={(open) => {
          if (!open) setActiveChapter(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {activeChapter && (
            <>
              <SheetHeader>
                <SheetTitle>{activeChapter.displayName} Chapter</SheetTitle>
                <SheetDescription className="text-xs">
                  {activeChapter.tier} · HQ: {activeChapter.headquarters}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6 text-xs">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!canManageChapters) return;
                    const next = updateChapterCoordinator(activeChapter.id, {
                      coordinatorName: coordName.trim(),
                      coordinatorPhone: coordPhone.trim(),
                      coordinatorEmail: coordEmail.trim(),
                    });
                    const updated = next.find((c) => c.id === activeChapter.id) ?? null;
                    setActiveChapter(updated);
                    appendAuditLog({
                      role: activeRole,
                      action: "CHAPTER_COORDINATOR_ASSIGNED",
                      entityType: "StateChapter",
                      entityId: activeChapter.stateKey,
                      summary: `Assigned chapter lead '${coordName}' to ${activeChapter.displayName}.`,
                    });
                    toast.success("State Coordinator details updated.");
                    onRefresh();
                  }}
                  className="space-y-3 rounded-md border border-slate-200 p-4"
                >
                  <p className="font-bold text-slate-900">Assign State Chapter Coordinator</p>
                  <Input
                    value={coordName}
                    disabled={!canManageChapters}
                    onChange={(e) => setCoordName(e.target.value)}
                    placeholder="Coordinator Full Name"
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      value={coordPhone}
                      disabled={!canManageChapters}
                      onChange={(e) => setCoordPhone(e.target.value)}
                      placeholder="Phone"
                    />
                    <Input
                      value={coordEmail}
                      disabled={!canManageChapters}
                      onChange={(e) => setCoordEmail(e.target.value)}
                      placeholder="Email"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!canManageChapters}
                    className="bg-emerald-800 text-xs font-bold text-white"
                  >
                    Save Coordinator Assignment
                  </Button>
                </form>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!canManageChapters || !annTitle.trim()) return;
                    const next = addChapterAnnouncement(activeChapter.id, annTitle, annBody);
                    const updated = next.find((c) => c.id === activeChapter.id) ?? null;
                    setActiveChapter(updated);
                    appendAuditLog({
                      role: activeRole,
                      action: "CHAPTER_NOTICE_PUBLISHED",
                      entityType: "StateChapter",
                      entityId: activeChapter.stateKey,
                      summary: `Broadcast notice '${annTitle}' to ${activeChapter.displayName} members.`,
                    });
                    setAnnTitle("");
                    setAnnBody("");
                    toast.success("State announcement published.");
                    onRefresh();
                  }}
                  className="space-y-3 rounded-md border border-slate-200 p-4"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Megaphone className="size-4 text-emerald-700" />
                    <span>Publish Chapter Announcement</span>
                  </div>
                  <Input
                    value={annTitle}
                    disabled={!canManageChapters}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="Notice Title"
                  />
                  <Textarea
                    value={annBody}
                    disabled={!canManageChapters}
                    onChange={(e) => setAnnBody(e.target.value)}
                    placeholder="Meeting date, LGA relief distribution point, or onboarding directive..."
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!canManageChapters}
                    className="bg-slate-900 text-xs font-bold text-white"
                  >
                    Broadcast Notice
                  </Button>
                </form>

                <div className="space-y-2">
                  <p className="font-bold text-slate-900">Published State Announcements</p>
                  {activeChapter.announcements.map((ann) => (
                    <div key={ann.id} className="rounded-md bg-slate-50 p-3">
                      <p className="font-bold text-slate-900">{ann.title}</p>
                      <p className="mt-1 text-slate-600">{ann.body}</p>
                      <p className="mt-1 text-[10px] text-slate-400">{ann.publishedAt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* REGISTER MEMBER MODAL */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Onboard Citizen Member</DialogTitle>
            <DialogDescription>
              Assign citizen to any Nigerian state &amp; LGA with instant Digital ID generation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateMember} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <Label>Full Name *</Label>
                <Input
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Email *</Label>
                <Input
                  required
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>State</Label>
                <select
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
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
                  value={newLga}
                  onChange={(e) => setNewLga(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  {availableLgas.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Tier</Label>
                <select
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value as MembershipTier)}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  {MEMBER_TIERS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Occupation</Label>
                <Input value={newOccupation} onChange={(e) => setNewOccupation(e.target.value)} />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Passport Photo (Optional)</Label>
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-600">
                  <Upload className="size-4" />
                  <span>{newPhotoUrl ? "Photo attached ✓" : "Upload passport photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setNewPhotoUrl(await compressPassportPhoto(file));
                      } catch {
                        toast.error("Failed to compress image.");
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddMemberOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-800 text-white">
                Register Citizen
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <strong>{deleteTarget?.name}</strong> from the registry?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deleteTarget) return;
                if (deleteTarget.kind === "member") {
                  deleteMemberFromStorage(deleteTarget.id);
                } else {
                  deleteVolunteerFromStorage(deleteTarget.id);
                }
                appendAuditLog({
                  role: activeRole,
                  action: deleteTarget.kind === "member" ? "MEMBER_DELETED" : "VOLUNTEER_DELETED",
                  entityType: deleteTarget.kind === "member" ? "Member" : "Volunteer",
                  entityId: deleteTarget.id,
                  summary: `Removed ${deleteTarget.kind} '${deleteTarget.name}'.`,
                });
                toast.success(
                  `Removed ${deleteTarget.name} — phone lookup will now show Removed/Deleted status in red.`,
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

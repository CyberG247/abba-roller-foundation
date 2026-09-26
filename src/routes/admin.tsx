import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Search,
  Filter,
  Download,
  Building,
  MapPin,
  Award,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Eye,
  IdCard,
  UserPlus,
  RefreshCw,
  FileSpreadsheet,
  ArrowLeft,
  X,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  Scale,
  Gavel,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  loadMembersFromStorage,
  saveMemberToStorage,
  exportMembersToCsv,
  type Member,
  type MembershipTier,
} from "@/data/membershipStore";
import { ALL_STATES, getLgasForState } from "@/data/nigeriaStatesLgas";
import { downloadMembershipCard } from "@/lib/generateMembershipSlip";
import { getLawyersList, type LawyerVolunteer } from "@/data/lawyersStore";
import { downloadLawyerSlip } from "@/lib/generateLawyerSlip";
import arfLogo from "@/assets/arf-logo-official.png";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Abba Roller Foundation" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const [activeAdminTab, setActiveAdminTab] = useState<"members" | "lawyers">("members");
  const [members, setMembers] = useState<Member[]>([]);
  const [lawyers, setLawyers] = useState<LawyerVolunteer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lawyersSearchQuery, setLawyersSearchQuery] = useState("");
  const [selectedStateFilter, setSelectedStateFilter] = useState("all");
  const [selectedLgaFilter, setSelectedLgaFilter] = useState("all");
  const [selectedTierFilter, setSelectedTierFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

  const [activeMemberModal, setActiveMemberModal] = useState<Member | null>(null);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);

  // New member quick-add form states
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newState, setNewState] = useState("");
  const [newLga, setNewLga] = useState("");
  const [newTier, setNewTier] = useState<MembershipTier>("Standard Member");
  const [newOccupation, setNewOccupation] = useState("");

  const refreshMembers = () => {
    setMembers(loadMembersFromStorage());
    setLawyers(getLawyersList());
  };

  useEffect(() => {
    refreshMembers();
    const handleUpdate = () => refreshMembers();
    window.addEventListener("arf_members_updated", handleUpdate);
    return () => window.removeEventListener("arf_members_updated", handleUpdate);
  }, []);

  // Dynamic LGAs for filter
  const filterAvailableLgas =
    selectedStateFilter !== "all" ? getLgasForState(selectedStateFilter) : [];

  // Dynamic LGAs for Add Member dialog
  const addModalAvailableLgas = newState ? getLgasForState(newState) : [];

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.fullName.toLowerCase().includes(q);
        const matchesEmail = m.email.toLowerCase().includes(q);
        const matchesId = m.id.toLowerCase().includes(q);
        const matchesLga = m.lga.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesId && !matchesLga) {
          return false;
        }
      }

      // State Filter
      if (selectedStateFilter !== "all" && m.state !== selectedStateFilter) {
        return false;
      }

      // LGA Filter
      if (selectedLgaFilter !== "all" && m.lga !== selectedLgaFilter) {
        return false;
      }

      // Tier Filter
      if (selectedTierFilter !== "all" && m.tier !== selectedTierFilter) {
        return false;
      }

      // Status Filter
      if (selectedStatusFilter !== "all" && m.status !== selectedStatusFilter) {
        return false;
      }

      return true;
    });
  }, [
    members,
    searchQuery,
    selectedStateFilter,
    selectedLgaFilter,
    selectedTierFilter,
    selectedStatusFilter,
  ]);

  // Statistics
  const totalCount = members.length;
  const uniqueStatesCount = new Set(members.map((m) => m.state)).size;
  const uniqueLgasCount = new Set(members.map((m) => `${m.lga}, ${m.state}`)).size;
  const verifiedCount = members.filter(
    (m) => m.status === "Verified" || m.status === "Honorary",
  ).length;

  // Filtered Lawyers
  const filteredLawyers = useMemo(() => {
    if (!lawyersSearchQuery.trim()) return lawyers;
    const q = lawyersSearchQuery.toLowerCase();
    return lawyers.filter(
      (l) =>
        l.fullName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.lawFirm && l.lawFirm.toLowerCase().includes(q)) ||
        l.university.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q),
    );
  }, [lawyers, lawyersSearchQuery]);

  const totalLawyersCount = lawyers.length;
  const totalLawyerCasesWon = lawyers.reduce((acc, l) => acc + (Number(l.casesWon) || 0), 0);
  const uniqueLawyerUnis = new Set(lawyers.map((l) => l.university)).size;

  const handleExportLawyersCsv = () => {
    const headers = [
      "Bar Advocate ID",
      "Full Name",
      "Law Firm",
      "Email",
      "Phone",
      "University (LL.B)",
      "Call to Bar Year",
      "Cases Won",
      "Jurisdiction State",
      "Enrollment Date",
      "Status",
    ];
    const rows = filteredLawyers.map((l) => [
      `"${l.id}"`,
      `"${l.fullName.replace(/"/g, '""')}"`,
      `"${(l.lawFirm || "").replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${l.phone || ""}"`,
      `"${(l.university || "").replace(/"/g, '""')}"`,
      `"${l.callToBarYear}"`,
      `"${l.casesWon}"`,
      `"${l.jurisdictionState || ""}"`,
      `"${l.submissionDate}"`,
      `"${l.status}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ARF-Lawyers-Pro-Bono-Directory-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredLawyers.length} lawyer advocate records.`);
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove member "${name}" (${id})?`)) return;
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("arf_foundation_members_v1", JSON.stringify(updated));
    }
    toast.success(`Removed member ${name}`);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim() || !newState || !newLga) {
      toast.error("Please fill in all required fields (Name, Email, State, and LGA).");
      return;
    }

    const created = saveMemberToStorage({
      fullName: newFullName.trim(),
      email: newEmail.trim().toLowerCase(),
      phone: newPhone.trim() || undefined,
      state: newState,
      lga: newLga,
      tier: newTier,
      occupation: newOccupation.trim() || undefined,
    });

    toast.success(`Member registered: ${created.id}`);
    setAddMemberDialogOpen(false);
    // Reset form
    setNewFullName("");
    setNewEmail("");
    setNewPhone("");
    setNewState("");
    setNewLga("");
    setNewOccupation("");
    refreshMembers();
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-20">
      {/* Top Admin Header Bar */}
      <div className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="shell py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/membership"
              className="size-8 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Back to Public Membership Page"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <img
                src={arfLogo}
                alt="ARF"
                className="size-9 rounded-full bg-white p-0.5 object-contain"
              />
              <div>
                <h1 className="font-display text-lg font-extrabold text-white leading-tight">
                  ARF Membership Admin Dashboard
                </h1>
                <p className="text-[11px] text-amber-400">
                  National Database &amp; State/LGA Mobilisation Registry
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={refreshMembers}
              className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 gap-1.5 text-xs"
            >
              <RefreshCw className="size-3.5" />
              <span>Refresh</span>
            </Button>

            {activeAdminTab === "members" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => exportMembersToCsv(filteredMembers)}
                  className="border-emerald-600/40 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 gap-1.5 text-xs font-bold"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-400" />
                  <span>Export CSV ({filteredMembers.length})</span>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => setAddMemberDialogOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-1.5 text-xs"
                >
                  <UserPlus className="size-3.5" />
                  <span>Register Member</span>
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportLawyersCsv}
                className="border-emerald-600/40 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 gap-1.5 text-xs font-bold"
              >
                <FileSpreadsheet className="size-3.5 text-emerald-400" />
                <span>Export Lawyers CSV ({filteredLawyers.length})</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="shell py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-4 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveAdminTab("members")}
            className={`px-4 py-2.5 rounded-sm text-xs font-bold flex items-center gap-2 transition-all ${
              activeAdminTab === "members"
                ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Users className="size-4" />
            <span>National Membership Directory ({members.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab("lawyers")}
            className={`px-4 py-2.5 rounded-sm text-xs font-bold flex items-center gap-2 transition-all ${
              activeAdminTab === "lawyers"
                ? "bg-emerald-600 text-white shadow-md font-extrabold ring-2 ring-emerald-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Scale className="size-4 text-emerald-400" />
            <span>Pro Bono Lawyers Corps ({lawyers.length})</span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-normal">
              Win a Case
            </span>
          </button>
        </div>

        {activeAdminTab === "members" ? (
          <>
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-8">
              <div className="rounded-sm border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Members</span>
                  <Users className="size-4 text-amber-400" />
                </div>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-2">
                  {totalCount}
                </p>
                <span className="text-[11px] text-slate-400">Registered across Nigeria</span>
              </div>

              <div className="rounded-sm border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Covered States</span>
                  <MapPin className="size-4 text-emerald-400" />
                </div>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">
                  {uniqueStatesCount}{" "}
                  <span className="text-sm font-normal text-slate-400">/ 37</span>
                </p>
                <span className="text-[11px] text-slate-400">States + FCT active</span>
              </div>

              <div className="rounded-sm border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Covered LGAs</span>
                  <Building className="size-4 text-blue-400" />
                </div>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-blue-400 mt-2">
                  {uniqueLgasCount}
                </p>
                <span className="text-[11px] text-slate-400">Local government hubs</span>
              </div>

              <div className="rounded-sm border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Verified Status
                  </span>
                  <ShieldCheck className="size-4 text-brand-red" />
                </div>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-brand-red mt-2">
                  {verifiedCount}
                </p>
                <span className="text-[11px] text-slate-400">Vetted &amp; credentialed</span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="rounded-sm border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-sm mb-6">
              <div className="flex flex-col gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    placeholder="Search by Member Name, Email, Membership ID, or LGA..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Filter Dropdowns Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {/* State Filter */}
                  <div>
                    <Label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
                      State Filter
                    </Label>
                    <Select
                      value={selectedStateFilter}
                      onValueChange={(val) => {
                        setSelectedStateFilter(val);
                        setSelectedLgaFilter("all");
                      }}
                    >
                      <SelectTrigger className="bg-slate-950 border-slate-800 text-white text-xs">
                        <SelectValue placeholder="All States" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-slate-900 border-slate-800 text-white">
                        <SelectItem value="all">All States ({members.length})</SelectItem>
                        {ALL_STATES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* LGA Filter (Dynamic based on selected state) */}
                  <div>
                    <Label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
                      LGA Filter
                    </Label>
                    <Select
                      value={selectedLgaFilter}
                      onValueChange={setSelectedLgaFilter}
                      disabled={selectedStateFilter === "all"}
                    >
                      <SelectTrigger className="bg-slate-950 border-slate-800 text-white text-xs">
                        <SelectValue
                          placeholder={
                            selectedStateFilter === "all" ? "Choose State First" : "All LGAs"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-slate-900 border-slate-800 text-white">
                        <SelectItem value="all">All LGAs</SelectItem>
                        {filterAvailableLgas.map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tier Filter */}
                  <div>
                    <Label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
                      Membership Tier
                    </Label>
                    <Select value={selectedTierFilter} onValueChange={setSelectedTierFilter}>
                      <SelectTrigger className="bg-slate-950 border-slate-800 text-white text-xs">
                        <SelectValue placeholder="All Tiers" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-white">
                        <SelectItem value="all">All Tiers</SelectItem>
                        <SelectItem value="Standard Member">Standard Member</SelectItem>
                        <SelectItem value="Youth Ambassador">Youth Ambassador</SelectItem>
                        <SelectItem value="Volunteer Corps">Volunteer Corps</SelectItem>
                        <SelectItem value="Executive Supporter">Executive Supporter</SelectItem>
                        <SelectItem value="Patron">Patron</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <Label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
                      Status
                    </Label>
                    <Select value={selectedStatusFilter} onValueChange={setSelectedStatusFilter}>
                      <SelectTrigger className="bg-slate-950 border-slate-800 text-white text-xs">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-white">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Verified">Verified</SelectItem>
                        <SelectItem value="Honorary">Honorary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Filter Reset Button if any filter active */}
                {(selectedStateFilter !== "all" ||
                  selectedLgaFilter !== "all" ||
                  selectedTierFilter !== "all" ||
                  selectedStatusFilter !== "all" ||
                  searchQuery) && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400">
                      Showing <strong>{filteredMembers.length}</strong> matching records
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedStateFilter("all");
                        setSelectedLgaFilter("all");
                        setSelectedTierFilter("all");
                        setSelectedStatusFilter("all");
                      }}
                      className="text-amber-400 hover:underline cursor-pointer"
                    >
                      Reset all filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Members Table */}
            <div className="rounded-sm border border-slate-800 bg-slate-900 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Member ID</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">State &amp; LGA</th>
                      <th className="py-3 px-4">Membership Tier</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date Joined</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          No member records found matching the specified filters.
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((m) => (
                        <tr
                          key={m.id}
                          className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                          onClick={() => setActiveMemberModal(m)}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                            {m.id}
                          </td>
                          <td className="py-3 px-4 font-semibold text-white">
                            <div className="flex items-center gap-2.5">
                              <div className="size-8 rounded-full border border-amber-500/40 bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center">
                                {m.photoUrl ? (
                                  <img
                                    src={m.photoUrl}
                                    alt={m.fullName}
                                    className="size-full object-cover object-center"
                                  />
                                ) : (
                                  <User className="size-4 text-slate-400" />
                                )}
                              </div>
                              <div>
                                <div>{m.fullName}</div>
                                <div className="text-[11px] text-slate-400 font-normal">
                                  {m.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="text-white font-medium">{m.lga} LGA</div>
                            <div className="text-[11px] text-slate-400">{m.state} State</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                m.tier === "Patron"
                                  ? "bg-brand-red/15 text-brand-red border-brand-red/30"
                                  : m.tier === "Volunteer Corps"
                                    ? "bg-green-500/15 text-green-400 border-green-500/30"
                                    : m.tier === "Youth Ambassador"
                                      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                      : m.tier === "Executive Supporter"
                                        ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                                        : "bg-slate-800 text-slate-300 border-slate-700"
                              }`}
                            >
                              {m.tier}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                                m.status === "Verified" || m.status === "Honorary"
                                  ? "text-emerald-400"
                                  : "text-sky-400"
                              }`}
                            >
                              <span className="size-1.5 rounded-full bg-current" />
                              <span>{m.status}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                            {m.joinedDate}
                          </td>
                          <td
                            className="py-3 px-4 text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => downloadMembershipCard(m)}
                                className="size-7 rounded-sm bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-colors"
                                title="Download ID Card (PNG)"
                              >
                                <IdCard className="size-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setActiveMemberModal(m)}
                                className="size-7 rounded-sm bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors"
                                title="View Full Profile"
                              >
                                <Eye className="size-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteMember(m.id, m.fullName)}
                                className="size-7 rounded-sm bg-slate-800 text-slate-400 hover:bg-brand-red hover:text-white flex items-center justify-center transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Lawyer KPI Metric Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-sm border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Advocates Enrolled
                  </span>
                  <Scale className="size-4 text-emerald-400" />
                </div>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-2">
                  {totalLawyersCount}
                </p>
                <span className="text-[11px] text-slate-400">Pro Bono Bar Volunteers</span>
              </div>

              <div className="rounded-sm border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Cases Won Record
                  </span>
                  <Award className="size-4 text-amber-400" />
                </div>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2">
                  {totalLawyerCasesWon}
                </p>
                <span className="text-[11px] text-slate-400">Total judicial victories</span>
              </div>

              <div className="rounded-sm border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Law Faculties</span>
                  <Building className="size-4 text-blue-400" />
                </div>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-blue-400 mt-2">
                  {uniqueLawyerUnis}
                </p>
                <span className="text-[11px] text-slate-400">Universities represented</span>
              </div>

              <div className="rounded-sm border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Advocacy Motto</span>
                  <Gavel className="size-4 text-emerald-400" />
                </div>
                <p className="font-display text-base sm:text-lg font-bold text-emerald-400 mt-2 truncate">
                  Win for Indigent
                </p>
                <span className="text-[11px] text-slate-400">Win cases for less privileged</span>
              </div>
            </div>

            {/* Lawyers Search Bar */}
            <div className="rounded-sm border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    placeholder="Search by Counsel Name, Law Firm, University, or Bar ID..."
                    value={lawyersSearchQuery}
                    onChange={(e) => setLawyersSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    Showing <strong>{filteredLawyers.length}</strong> legal advocates
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleExportLawyersCsv}
                    className="border-emerald-600/40 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 text-xs font-bold gap-1.5"
                  >
                    <FileSpreadsheet className="size-3.5 text-emerald-400" />
                    <span>Export CSV</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Lawyers Table */}
            <div className="rounded-sm border border-slate-800 bg-slate-900 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Bar Advocate ID</th>
                      <th className="py-3 px-4">Counsel Name &amp; Firm</th>
                      <th className="py-3 px-4">University (LL.B)</th>
                      <th className="py-3 px-4">Call to Bar</th>
                      <th className="py-3 px-4">Cases Won</th>
                      <th className="py-3 px-4">Jurisdiction</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Official Bar Slip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredLawyers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          No lawyer advocate records found matching "{lawyersSearchQuery}".
                        </td>
                      </tr>
                    ) : (
                      filteredLawyers.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                            {l.id}
                          </td>
                          <td className="py-3 px-4 font-semibold text-white">
                            <div>{l.fullName}</div>
                            <div className="text-[11px] text-slate-400 font-normal">
                              {l.lawFirm || "Solo Legal Practitioner"} • {l.email}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300 max-w-[200px] truncate">
                            {l.university}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">{l.callToBarYear}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs">
                              <Award className="size-3 text-amber-400" />
                              <span>{l.casesWon} Won</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                            {l.jurisdictionState || "National"}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              <span className="size-1.5 rounded-full bg-emerald-400" />
                              <span>{l.status}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() =>
                                downloadLawyerSlip({
                                  refNumber: l.id,
                                  fullName: l.fullName,
                                  lawFirm: l.lawFirm,
                                  email: l.email,
                                  university: l.university,
                                  phone: l.phone,
                                  callToBarYear: l.callToBarYear,
                                  casesWon: l.casesWon,
                                  jurisdictionState: l.jurisdictionState,
                                  submissionDate: l.submissionDate,
                                })
                              }
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-emerald-700 hover:text-white transition-colors text-xs font-semibold"
                              title="Download Official Pro Bono Bar Slip"
                            >
                              <Download className="size-3" />
                              <span>Slip PNG</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MEMBER DETAILS MODAL                                                      */}
      {/* ========================================================================= */}
      {activeMemberModal && (
        <Dialog
          open={!!activeMemberModal}
          onOpenChange={(open) => !open && setActiveMemberModal(null)}
        >
          <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-lg bg-slate-900 border-slate-800 text-white p-6 rounded-md">
            <DialogHeader>
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
                <span>MEMBER PROFILE</span>
                <span className="font-mono">{activeMemberModal.id}</span>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="size-16 rounded border-2 border-amber-500/50 bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                  {activeMemberModal.photoUrl ? (
                    <img
                      src={activeMemberModal.photoUrl}
                      alt={activeMemberModal.fullName}
                      className="size-full object-cover object-center"
                    />
                  ) : (
                    <User className="size-8 text-slate-500" />
                  )}
                </div>
                <div>
                  <DialogTitle className="font-display text-xl font-bold text-white">
                    {activeMemberModal.fullName}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-400">
                    Official ARF Registry Record for {activeMemberModal.lga} LGA,{" "}
                    {activeMemberModal.state} State.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-4 space-y-3 text-xs divide-y divide-slate-800/80">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">State of Residence</span>
                <span className="font-bold text-white">{activeMemberModal.state} State</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Local Government Area</span>
                <span className="font-bold text-white">{activeMemberModal.lga} LGA</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Membership Tier</span>
                <span className="font-bold text-amber-300">{activeMemberModal.tier}</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Email Address</span>
                <span className="font-mono text-white">{activeMemberModal.email}</span>
              </div>

              {activeMemberModal.phone && (
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-400">Phone Number</span>
                  <span className="font-mono text-white">{activeMemberModal.phone}</span>
                </div>
              )}

              {activeMemberModal.occupation && (
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-400">Occupation</span>
                  <span className="font-medium text-white">{activeMemberModal.occupation}</span>
                </div>
              )}

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Registration Date</span>
                <span className="font-mono text-white">{activeMemberModal.joinedDate}</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Verification Status</span>
                <span className="font-bold text-emerald-400">{activeMemberModal.status}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveMemberModal(null)}
                className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Close
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => downloadMembershipCard(activeMemberModal)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-2 text-xs"
              >
                <IdCard className="size-4" />
                <span>Download Official Card (PNG)</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ========================================================================= */}
      {/* QUICK REGISTER MEMBER MODAL                                               */}
      {/* ========================================================================= */}
      <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-lg bg-slate-900 border-slate-800 text-white p-6 rounded-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-white">
              Register New Member
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Add a verified citizen into the ARF database directly from the admin dashboard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateMember} className="mt-4 space-y-4 text-xs">
            <div className="space-y-1">
              <Label className="text-slate-300">Full Name *</Label>
              <Input
                placeholder="e.g. Ibrahim Sani"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                required
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-300">Email Address *</Label>
                <Input
                  type="email"
                  placeholder="ibrahim@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-slate-300">Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="0803 123 4567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-300">State *</Label>
                <Select
                  value={newState}
                  onValueChange={(val) => {
                    setNewState(val);
                    setNewLga("");
                  }}
                >
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 bg-slate-900 border-slate-800 text-white">
                    {ALL_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-slate-300">LGA *</Label>
                <Select
                  value={newLga}
                  onValueChange={setNewLga}
                  disabled={!newState || addModalAvailableLgas.length === 0}
                >
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                    <SelectValue placeholder={newState ? "Select LGA" : "Select State First"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 bg-slate-900 border-slate-800 text-white">
                    {addModalAvailableLgas.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-300">Membership Tier *</Label>
                <Select value={newTier} onValueChange={(val) => setNewTier(val as MembershipTier)}>
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="Standard Member">Standard Member</SelectItem>
                    <SelectItem value="Youth Ambassador">Youth Ambassador</SelectItem>
                    <SelectItem value="Volunteer Corps">Volunteer Corps</SelectItem>
                    <SelectItem value="Executive Supporter">Executive Supporter</SelectItem>
                    <SelectItem value="Patron">Patron</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-slate-300">Occupation</Label>
                <Input
                  placeholder="e.g. Teacher, Trader"
                  value={newOccupation}
                  onChange={(e) => setNewOccupation(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddMemberDialogOpen(false)}
                className="border-slate-700 bg-slate-800 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Register &amp; Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

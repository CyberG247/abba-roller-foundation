import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  GraduationCap,
  HeartHandshake,
  Info,
  Mail,
  MapPin,
  Phone,
  Plus,
  Scale,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  User,
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
  deleteLawyerFromStorage,
  exportLawyersToCsv,
  getLawyersList,
  type LawyerVolunteer,
  updateLawyerStatus,
} from "@/data/lawyersStore";
import {
  deleteMemberFromStorage,
  exportMembersToCsv,
  loadMembersFromStorage,
  type Member,
  type MembershipTier,
  saveMemberToStorage,
  updateMemberStatus,
} from "@/data/membershipStore";
import { ALL_STATES, getLgasForState } from "@/data/nigeriaStatesLgas";
import {
  deleteVolunteerFromStorage,
  loadVolunteersFromStorage,
  updateVolunteerStatus,
  type VolunteerRecord,
} from "@/data/volunteersStore";
import { downloadLawyerSlip } from "@/lib/generateLawyerSlip";
import { downloadMembershipCard } from "@/lib/generateMembershipSlip";
import { downloadVolunteerSlip } from "@/lib/generateVolunteerSlip";
import { compressPassportPhoto, exportRecordsToCsv, formatDate } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      {
        title: "Admin Registry Console — Abba Roller Foundation",
      },
      {
        name: "description",
        content:
          "Internal registry console for managing Abba Roller Foundation members, volunteers, and pro bono legal advocates.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPortalPage,
});

type RegistryTab = "members" | "volunteers" | "lawyers";

interface PendingDelete {
  type: RegistryTab;
  id: string;
  name: string;
}

const MEMBERSHIP_TIERS: MembershipTier[] = [
  "Standard Member",
  "Youth Ambassador",
  "Volunteer Corps",
  "Executive Supporter",
  "Patron",
];

const MEMBER_STATUSES: Member["status"][] = ["Active", "Verified", "Honorary"];

const VOLUNTEER_STATUSES: VolunteerRecord["status"][] = [
  "Pending Briefing",
  "Verified Volunteer",
  "Deployed",
];

const LAWYER_STATUSES: LawyerVolunteer["status"][] = [
  "Active Pro Bono",
  "Verified Advocate",
  "Under Review",
];

const selectClassName =
  "h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "Verified":
    case "Verified Volunteer":
    case "Verified Advocate":
    case "Deployed":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "Honorary":
    case "Active Pro Bono":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "Under Review":
    case "Pending Briefing":
      return "border-slate-200 bg-slate-100 text-slate-700";
    default:
      return "border-sky-200 bg-sky-50 text-sky-800";
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AR";
  const first = parts[0]?.charAt(0) ?? "";
  const second = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? "") : "";
  return `${first}${second}`.toUpperCase() || "AR";
}

function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<RegistryTab>("members");

  const [members, setMembers] = useState<Member[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerRecord[]>([]);
  const [lawyers, setLawyers] = useState<LawyerVolunteer[]>([]);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [memberTierFilter, setMemberTierFilter] = useState<string>("all");
  const [memberStatusFilter, setMemberStatusFilter] = useState<string>("all");
  const [volunteerStatusFilter, setVolunteerStatusFilter] = useState<string>("all");
  const [lawyerStatusFilter, setLawyerStatusFilter] = useState<string>("all");

  // Detail & action dialogs
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRecord | null>(null);
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerVolunteer | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  // Add Member modal state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newState, setNewState] = useState("Kano");
  const [newLga, setNewLga] = useState("");
  const [newGender, setNewGender] = useState<"Male" | "Female" | "Prefer not to say">(
    "Prefer not to say",
  );
  const [newOccupation, setNewOccupation] = useState("");
  const [newTier, setNewTier] = useState<MembershipTier>("Standard Member");
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>("");
  const [isSavingMember, setIsSavingMember] = useState(false);

  const syncAllRegistries = useCallback(() => {
    setMembers(loadMembersFromStorage());
    setVolunteers(loadVolunteersFromStorage());
    setLawyers(getLawyersList());
  }, []);

  useEffect(() => {
    syncAllRegistries();
    const handleUpdate = () => syncAllRegistries();
    window.addEventListener("arf_members_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("arf_members_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [syncAllRegistries]);

  const availableLgas = useMemo(() => getLgasForState(newState), [newState]);

  useEffect(() => {
    if (availableLgas.length > 0 && !availableLgas.includes(newLga)) {
      setNewLga(availableLgas[0] ?? "");
    }
  }, [availableLgas, newLga]);

  // Derived filtered views
  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return members.filter((m) => {
      if (memberTierFilter !== "all" && m.tier !== memberTierFilter) {
        return false;
      }
      if (memberStatusFilter !== "all" && m.status !== memberStatusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        m.fullName.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.state.toLowerCase().includes(q) ||
        m.lga.toLowerCase().includes(q)
      );
    });
  }, [members, memberTierFilter, memberStatusFilter, searchQuery]);

  const filteredVolunteers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return volunteers.filter((v) => {
      if (volunteerStatusFilter !== "all" && v.status !== volunteerStatusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        v.fullName.toLowerCase().includes(q) ||
        v.refNumber.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q) ||
        v.state.toLowerCase().includes(q) ||
        v.lga.toLowerCase().includes(q) ||
        v.profession.toLowerCase().includes(q)
      );
    });
  }, [volunteers, volunteerStatusFilter, searchQuery]);

  const filteredLawyers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return lawyers.filter((l) => {
      if (lawyerStatusFilter !== "all" && l.status !== lawyerStatusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        l.fullName.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.university.toLowerCase().includes(q) ||
        (l.lawFirm ?? "").toLowerCase().includes(q)
      );
    });
  }, [lawyers, lawyerStatusFilter, searchQuery]);

  // Aggregate metrics
  const kpis = useMemo(() => {
    const verifiedMembers = members.filter(
      (m) => m.status === "Verified" || m.status === "Honorary",
    ).length;
    const totalCasesWon = lawyers.reduce(
      (acc, l) => acc + (Number.isFinite(l.casesWon) ? l.casesWon : 0),
      0,
    );
    const statesSet = new Set<string>();
    for (const m of members) {
      if (m.state) statesSet.add(m.state.trim());
    }
    for (const v of volunteers) {
      if (v.state) statesSet.add(v.state.trim());
    }
    return {
      totalMembers: members.length,
      verifiedMembers,
      totalVolunteers: volunteers.length,
      deployedVolunteers: volunteers.filter(
        (v) => v.status === "Deployed" || v.status === "Verified Volunteer",
      ).length,
      totalLawyers: lawyers.length,
      totalCasesWon,
      statesCovered: statesSet.size,
    };
  }, [members, volunteers, lawyers]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, or WebP).");
      return;
    }
    try {
      const compressed = await compressPassportPhoto(file);
      setNewPhotoUrl(compressed);
      toast.success("Passport photo optimized and attached.");
    } catch {
      toast.error("Could not process image file. Please try another photo.");
    }
  };

  const handleCreateMember = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) {
      toast.error("Full name and email address are required.");
      return;
    }
    setIsSavingMember(true);
    try {
      const created = saveMemberToStorage({
        fullName: newFullName.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim() || undefined,
        state: newState,
        lga: newLga || "Municipal",
        gender: newGender,
        occupation: newOccupation.trim() || undefined,
        tier: newTier,
        photoUrl: newPhotoUrl || undefined,
      });
      setMembers(loadMembersFromStorage());
      toast.success(`Registered ${created.fullName} (${created.id}).`);
      setNewFullName("");
      setNewEmail("");
      setNewPhone("");
      setNewOccupation("");
      setNewPhotoUrl("");
      setIsAddMemberOpen(false);
    } catch {
      toast.error("Unable to save member to browser storage.");
    } finally {
      setIsSavingMember(false);
    }
  };

  const handleMemberStatusChange = (id: string, status: Member["status"]) => {
    const updated = updateMemberStatus(id, status);
    setMembers(updated);
    if (selectedMember?.id === id) {
      setSelectedMember((prev) => (prev ? { ...prev, status } : null));
    }
    toast.success(`Member status updated to "${status}".`);
  };

  const handleVolunteerStatusChange = (refNumber: string, status: VolunteerRecord["status"]) => {
    const updated = updateVolunteerStatus(refNumber, status);
    setVolunteers(updated);
    if (selectedVolunteer?.refNumber === refNumber) {
      setSelectedVolunteer((prev) => (prev ? { ...prev, status } : null));
    }
    toast.success(`Volunteer status updated to "${status}".`);
  };

  const handleLawyerStatusChange = (id: string, status: LawyerVolunteer["status"]) => {
    const updated = updateLawyerStatus(id, status);
    setLawyers(updated);
    if (selectedLawyer?.id === id) {
      setSelectedLawyer((prev) => (prev ? { ...prev, status } : null));
    }
    toast.success(`Advocate status updated to "${status}".`);
  };

  const confirmDeleteRecord = () => {
    if (!pendingDelete) return;
    const { type, id, name } = pendingDelete;
    if (type === "members") {
      setMembers(deleteMemberFromStorage(id));
      if (selectedMember?.id === id) setSelectedMember(null);
    } else if (type === "volunteers") {
      setVolunteers(deleteVolunteerFromStorage(id));
      if (selectedVolunteer?.refNumber === id) setSelectedVolunteer(null);
    } else {
      setLawyers(deleteLawyerFromStorage(id));
      if (selectedLawyer?.id === id) setSelectedLawyer(null);
    }
    toast.success(`Removed ${name} from the registry.`);
    setPendingDelete(null);
  };

  const handleExportVolunteersCsv = () => {
    const headers = [
      "Reference ID",
      "Full Name",
      "Email",
      "Phone",
      "Gender",
      "Age Group",
      "State",
      "LGA",
      "Profession",
      "Availability",
      "Primary Activity",
      "Secondary Activities",
      "Address",
      "Status",
      "Submitted Date",
    ];
    const rows = filteredVolunteers.map((v) => [
      v.refNumber,
      v.fullName,
      v.email,
      v.phone,
      v.gender,
      v.ageGroup,
      v.state,
      v.lga,
      v.profession,
      v.availability,
      v.activity,
      v.secondaryActivities?.join("; "),
      v.address,
      v.status,
      v.submissionDate,
    ]);
    exportRecordsToCsv("arf-volunteers.csv", headers, rows);
    toast.success(`Exported ${filteredVolunteers.length} volunteer record(s) to CSV.`);
  };

  const handleDownloadMemberSlip = async (member: Member) => {
    try {
      await downloadMembershipCard(member);
      toast.success(`Downloaded ID slip for ${member.fullName}.`);
    } catch {
      toast.error("Failed to generate membership slip.");
    }
  };

  const handleDownloadVolunteerSlip = async (volunteer: VolunteerRecord) => {
    try {
      await downloadVolunteerSlip(volunteer);
      toast.success(`Downloaded volunteer slip for ${volunteer.fullName}.`);
    } catch {
      toast.error("Failed to generate volunteer slip.");
    }
  };

  const handleDownloadLawyerSlip = async (lawyer: LawyerVolunteer) => {
    try {
      await downloadLawyerSlip({
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
      });
      toast.success(`Downloaded advocate slip for ${lawyer.fullName}.`);
    } catch {
      toast.error("Failed to generate advocate slip.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6] text-foreground">
      {/* Top sticky admin header */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--green-deep)] text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                  ARF Registry Console
                </h1>
                <Badge
                  variant="outline"
                  className="hidden border-emerald-200 bg-emerald-50 text-[11px] font-semibold text-emerald-800 sm:inline-flex"
                >
                  Admin Portal
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Members, General Volunteers & Pro Bono Legal Corps Management
              </p>
            </div>
          </div>

          <nav aria-label="Admin Navigation" className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:text-sm"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Public Website
            </Link>
            <Link
              to="/membership"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:text-sm"
            >
              <Users className="h-3.5 w-3.5" />
              Membership Form
            </Link>
            <Link
              to="/volunteer"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:text-sm"
            >
              <HeartHandshake className="h-3.5 w-3.5" />
              Volunteer Portal
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Local browser persistence notice */}
        <div
          role="note"
          className="flex flex-col gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-4 py-3 text-xs text-emerald-950 sm:flex-row sm:items-center sm:justify-between sm:text-sm"
        >
          <div className="flex items-start gap-2.5 sm:items-center">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 sm:mt-0" />
            <p>
              <strong>Browser-Local Registry:</strong> Submissions created on this device sync
              automatically into this console alongside Foundation baseline records. Export CSV
              regularly for central secretariat archival.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <section
          aria-label="Registry Key Performance Indicators"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="border-border/70 bg-white shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Registered Members
              </CardTitle>
              <Users className="h-4 w-4 text-[var(--green-mid)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpis.totalMembers}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {kpis.verifiedMembers} verified or honorary profiles
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-white shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Volunteer Corps
              </CardTitle>
              <HeartHandshake className="h-4 w-4 text-[var(--brand-red)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpis.totalVolunteers}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {kpis.deployedVolunteers} verified or deployed in field
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-white shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Legal Aid Advocates
              </CardTitle>
              <Scale className="h-4 w-4 text-[var(--green-deep)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpis.totalLawyers}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {kpis.totalCasesWon} cumulative pro bono cases won
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-white shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Geographic Reach
              </CardTitle>
              <MapPin className="h-4 w-4 text-emerald-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpis.statesCovered}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Nigerian states represented across registries
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Main Registry Workspace */}
        <Card className="border-border/80 bg-white shadow-xs">
          <CardHeader className="border-b border-border/70 pb-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Registry Switcher Tabs */}
              <div
                role="tablist"
                aria-label="Registry sections"
                className="inline-flex flex-wrap gap-1.5 rounded-xl bg-muted/70 p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "members"}
                  onClick={() => setActiveTab("members")}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all sm:text-sm ${
                    activeTab === "members"
                      ? "bg-white text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Members
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">
                    {members.length}
                  </span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "volunteers"}
                  onClick={() => setActiveTab("volunteers")}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all sm:text-sm ${
                    activeTab === "volunteers"
                      ? "bg-white text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <HeartHandshake className="h-4 w-4" />
                  Volunteers
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">
                    {volunteers.length}
                  </span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "lawyers"}
                  onClick={() => setActiveTab("lawyers")}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all sm:text-sm ${
                    activeTab === "lawyers"
                      ? "bg-white text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Scale className="h-4 w-4" />
                  Legal Corps
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">
                    {lawyers.length}
                  </span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {activeTab === "members" && (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setIsAddMemberOpen(true)}
                      className="bg-[var(--green-deep)] text-white hover:bg-[var(--green-mid)]"
                    >
                      <Plus className="mr-1.5 h-4 w-4" />
                      Register Member
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        exportMembersToCsv(filteredMembers);
                        toast.success(
                          `Exported ${filteredMembers.length} member record(s) to CSV.`,
                        );
                      }}
                    >
                      <FileSpreadsheet className="mr-1.5 h-4 w-4" />
                      Export CSV
                    </Button>
                  </>
                )}

                {activeTab === "volunteers" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleExportVolunteersCsv}
                  >
                    <FileSpreadsheet className="mr-1.5 h-4 w-4" />
                    Export Volunteers CSV
                  </Button>
                )}

                {activeTab === "lawyers" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      exportLawyersToCsv(filteredLawyers);
                      toast.success(
                        `Exported ${filteredLawyers.length} legal advocate record(s) to CSV.`,
                      );
                    }}
                  >
                    <FileSpreadsheet className="mr-1.5 h-4 w-4" />
                    Export Advocates CSV
                  </Button>
                )}
              </div>
            </div>

            {/* Search & Filters */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === "members"
                      ? "Search members by name, ID, email, state, or LGA..."
                      : activeTab === "volunteers"
                        ? "Search volunteers by name, ref ID, state, or profession..."
                        : "Search advocates by name, ID, university, firm, or email..."
                  }
                  className="pl-9"
                />
              </div>

              {activeTab === "members" && (
                <div className="flex flex-wrap gap-2">
                  <select
                    aria-label="Filter by membership tier"
                    value={memberTierFilter}
                    onChange={(e) => setMemberTierFilter(e.target.value)}
                    className={selectClassName}
                  >
                    <option value="all">All Tiers</option>
                    {MEMBERSHIP_TIERS.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="Filter by member status"
                    value={memberStatusFilter}
                    onChange={(e) => setMemberStatusFilter(e.target.value)}
                    className={selectClassName}
                  >
                    <option value="all">All Statuses</option>
                    {MEMBER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === "volunteers" && (
                <select
                  aria-label="Filter by volunteer status"
                  value={volunteerStatusFilter}
                  onChange={(e) => setVolunteerStatusFilter(e.target.value)}
                  className={selectClassName}
                >
                  <option value="all">All Statuses</option>
                  {VOLUNTEER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              )}

              {activeTab === "lawyers" && (
                <select
                  aria-label="Filter by advocate status"
                  value={lawyerStatusFilter}
                  onChange={(e) => setLawyerStatusFilter(e.target.value)}
                  className={selectClassName}
                >
                  <option value="all">All Statuses</option>
                  {LAWYER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* MEMBERS TABLE */}
            {activeTab === "members" && (
              <div className="overflow-x-auto">
                {filteredMembers.length === 0 ? (
                  <EmptyRegistryState
                    icon={Users}
                    title="No matching members found"
                    description="Adjust your search query or register a new Foundation member."
                  />
                ) : (
                  <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/80 bg-muted/40 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        <th className="px-4 py-3">Member</th>
                        <th className="px-4 py-3">Registry ID & Tier</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Joined</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="transition-colors hover:bg-muted/25">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              {member.photoUrl ? (
                                <img
                                  src={member.photoUrl}
                                  alt={member.fullName}
                                  className="h-10 w-10 rounded-full border border-border object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900">
                                  {getInitials(member.fullName)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-foreground">
                                  {member.fullName}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-mono text-xs font-semibold text-foreground">
                              {member.id}
                            </p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {member.tier}
                            </Badge>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">
                            <p className="font-medium text-foreground">{member.state}</p>
                            <p>{member.lga}</p>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">
                            {formatDate(member.joinedDate)}
                          </td>
                          <td className="px-4 py-3.5">
                            <select
                              aria-label={`Change status for ${member.fullName}`}
                              value={member.status}
                              onChange={(e) =>
                                handleMemberStatusChange(
                                  member.id,
                                  e.target.value as Member["status"],
                                )
                              }
                              className={`rounded-full border px-2.5 py-1 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${getStatusBadgeClass(
                                member.status,
                              )}`}
                            >
                              {MEMBER_STATUSES.map((s) => (
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
                                title="View profile details"
                                onClick={() => setSelectedMember(member)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                title="Download official membership slip"
                                onClick={() => handleDownloadMemberSlip(member)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                title="Remove member"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() =>
                                  setPendingDelete({
                                    type: "members",
                                    id: member.id,
                                    name: member.fullName,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4" />
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

            {/* VOLUNTEERS TABLE */}
            {activeTab === "volunteers" && (
              <div className="overflow-x-auto">
                {filteredVolunteers.length === 0 ? (
                  <EmptyRegistryState
                    icon={HeartHandshake}
                    title="No volunteer registrations yet"
                    description="Volunteers who submit the General Volunteering form on this device appear here for deployment tracking."
                  />
                ) : (
                  <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/80 bg-muted/40 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        <th className="px-4 py-3">Volunteer</th>
                        <th className="px-4 py-3">Reference & Profession</th>
                        <th className="px-4 py-3">State & Availability</th>
                        <th className="px-4 py-3">Submitted</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredVolunteers.map((vol) => (
                        <tr key={vol.refNumber} className="transition-colors hover:bg-muted/25">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              {vol.photoUrl ? (
                                <img
                                  src={vol.photoUrl}
                                  alt={vol.fullName}
                                  className="h-10 w-10 rounded-full border border-border object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-900">
                                  {getInitials(vol.fullName)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-foreground">
                                  {vol.fullName}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {vol.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-mono text-xs font-semibold text-foreground">
                              {vol.refNumber}
                            </p>
                            <p className="text-xs text-muted-foreground">{vol.profession}</p>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">
                            <p className="font-medium text-foreground">
                              {vol.lga}, {vol.state}
                            </p>
                            <p>{vol.availability}</p>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">
                            {vol.submissionDate}
                          </td>
                          <td className="px-4 py-3.5">
                            <select
                              aria-label={`Change status for ${vol.fullName}`}
                              value={vol.status}
                              onChange={(e) =>
                                handleVolunteerStatusChange(
                                  vol.refNumber,
                                  e.target.value as VolunteerRecord["status"],
                                )
                              }
                              className={`rounded-full border px-2.5 py-1 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${getStatusBadgeClass(
                                vol.status,
                              )}`}
                            >
                              {VOLUNTEER_STATUSES.map((s) => (
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
                                title="View volunteer application"
                                onClick={() => setSelectedVolunteer(vol)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                title="Download volunteer slip"
                                onClick={() => handleDownloadVolunteerSlip(vol)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                title="Remove volunteer"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() =>
                                  setPendingDelete({
                                    type: "volunteers",
                                    id: vol.refNumber,
                                    name: vol.fullName,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4" />
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

            {/* LAWYERS TABLE */}
            {activeTab === "lawyers" && (
              <div className="overflow-x-auto">
                {filteredLawyers.length === 0 ? (
                  <EmptyRegistryState
                    icon={Scale}
                    title="No matching legal advocates"
                    description="Try clearing your search or status filter."
                  />
                ) : (
                  <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/80 bg-muted/40 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        <th className="px-4 py-3">Legal Advocate</th>
                        <th className="px-4 py-3">Bar ID & Credentials</th>
                        <th className="px-4 py-3">Pro Bono Record</th>
                        <th className="px-4 py-3">Registered</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredLawyers.map((lawyer) => (
                        <tr key={lawyer.id} className="transition-colors hover:bg-muted/25">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-800">
                                {getInitials(lawyer.fullName)}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-foreground">
                                  {lawyer.fullName}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {lawyer.lawFirm || "Independent Practice"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-mono text-xs font-semibold text-foreground">
                              {lawyer.id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {lawyer.university} (Call {lawyer.callToBarYear})
                            </p>
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge variant="outline" className="text-xs">
                              {lawyer.casesWon} cases won
                            </Badge>
                            {lawyer.jurisdictionState && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {lawyer.jurisdictionState}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">
                            {formatDate(lawyer.submissionDate)}
                          </td>
                          <td className="px-4 py-3.5">
                            <select
                              aria-label={`Change status for ${lawyer.fullName}`}
                              value={lawyer.status}
                              onChange={(e) =>
                                handleLawyerStatusChange(
                                  lawyer.id,
                                  e.target.value as LawyerVolunteer["status"],
                                )
                              }
                              className={`rounded-full border px-2.5 py-1 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${getStatusBadgeClass(
                                lawyer.status,
                              )}`}
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
                                title="View advocate dossier"
                                onClick={() => setSelectedLawyer(lawyer)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                title="Download advocate slip"
                                onClick={() => handleDownloadLawyerSlip(lawyer)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                title="Remove advocate"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() =>
                                  setPendingDelete({
                                    type: "lawyers",
                                    id: lawyer.id,
                                    name: lawyer.fullName,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4" />
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
      </main>

      {/* MEMBER DETAIL MODAL */}
      <Dialog
        open={selectedMember !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedMember(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedMember.photoUrl ? (
                    <img
                      src={selectedMember.photoUrl}
                      alt={selectedMember.fullName}
                      className="h-12 w-12 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-900">
                      {getInitials(selectedMember.fullName)}
                    </div>
                  )}
                  <div>
                    <span>{selectedMember.fullName}</span>
                    <DialogDescription className="mt-0.5 font-mono text-xs">
                      {selectedMember.id} • {selectedMember.tier}
                    </DialogDescription>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-3 py-2 text-sm sm:grid-cols-2">
                <DetailRow icon={Mail} label="Email" value={selectedMember.email} />
                <DetailRow
                  icon={Phone}
                  label="Phone"
                  value={selectedMember.phone || "Not provided"}
                />
                <DetailRow
                  icon={MapPin}
                  label="Location"
                  value={`${selectedMember.lga}, ${selectedMember.state}`}
                />
                <DetailRow
                  icon={Briefcase}
                  label="Occupation"
                  value={selectedMember.occupation || "Not specified"}
                />
                <DetailRow
                  icon={User}
                  label="Gender"
                  value={selectedMember.gender || "Not specified"}
                />
                <DetailRow
                  icon={Calendar}
                  label="Joined"
                  value={formatDate(selectedMember.joinedDate)}
                />
              </div>

              <DialogFooter className="flex-wrap justify-between gap-2 sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDownloadMemberSlip(selectedMember)}
                >
                  <Download className="mr-1.5 h-4 w-4" />
                  Download ID Slip
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    setPendingDelete({
                      type: "members",
                      id: selectedMember.id,
                      name: selectedMember.fullName,
                    })
                  }
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Delete Record
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* VOLUNTEER DETAIL MODAL */}
      <Dialog
        open={selectedVolunteer !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedVolunteer(null);
        }}
      >
        <DialogContent className="sm:max-w-xl">
          {selectedVolunteer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedVolunteer.photoUrl ? (
                    <img
                      src={selectedVolunteer.photoUrl}
                      alt={selectedVolunteer.fullName}
                      className="h-12 w-12 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-900">
                      {getInitials(selectedVolunteer.fullName)}
                    </div>
                  )}
                  <div>
                    <span>{selectedVolunteer.fullName}</span>
                    <DialogDescription className="mt-0.5 font-mono text-xs">
                      {selectedVolunteer.refNumber} • {selectedVolunteer.profession}
                    </DialogDescription>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-3 py-2 text-sm sm:grid-cols-2">
                <DetailRow icon={Mail} label="Email" value={selectedVolunteer.email} />
                <DetailRow icon={Phone} label="Phone" value={selectedVolunteer.phone} />
                <DetailRow
                  icon={MapPin}
                  label="Location"
                  value={`${selectedVolunteer.lga}, ${selectedVolunteer.state}`}
                />
                <DetailRow
                  icon={Calendar}
                  label="Availability"
                  value={selectedVolunteer.availability}
                />
                <DetailRow
                  icon={User}
                  label="Demographics"
                  value={`${selectedVolunteer.gender} • ${selectedVolunteer.ageGroup}`}
                />
                <DetailRow
                  icon={Award}
                  label="Primary Program"
                  value={selectedVolunteer.activity}
                />
              </div>

              <div className="space-y-3 rounded-lg bg-muted/40 p-3 text-xs">
                <div>
                  <p className="font-semibold text-foreground">Assigned Programs</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Badge variant="default" className="text-xs">
                      {selectedVolunteer.activity}
                    </Badge>
                    {selectedVolunteer.secondaryActivities?.map((act) => (
                      <Badge key={act} variant="secondary" className="text-xs">
                        {act}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selectedVolunteer.address && (
                  <div>
                    <p className="font-semibold text-foreground">Residential Address</p>
                    <p className="mt-1 leading-relaxed text-muted-foreground">
                      {selectedVolunteer.address}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex-wrap justify-between gap-2 sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDownloadVolunteerSlip(selectedVolunteer)}
                >
                  <Download className="mr-1.5 h-4 w-4" />
                  Download Volunteer Slip
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    setPendingDelete({
                      type: "volunteers",
                      id: selectedVolunteer.refNumber,
                      name: selectedVolunteer.fullName,
                    })
                  }
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Delete Record
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* LAWYER DETAIL MODAL */}
      <Dialog
        open={selectedLawyer !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedLawyer(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {selectedLawyer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-800">
                    {getInitials(selectedLawyer.fullName)}
                  </div>
                  <div>
                    <span>{selectedLawyer.fullName}</span>
                    <DialogDescription className="mt-0.5 font-mono text-xs">
                      {selectedLawyer.id} • Call {selectedLawyer.callToBarYear}
                    </DialogDescription>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-3 py-2 text-sm sm:grid-cols-2">
                <DetailRow icon={Mail} label="Email" value={selectedLawyer.email} />
                <DetailRow icon={Phone} label="Phone" value={selectedLawyer.phone} />
                <DetailRow
                  icon={Building2}
                  label="Law Firm / Chambers"
                  value={selectedLawyer.lawFirm || "Independent Counsel"}
                />
                <DetailRow
                  icon={GraduationCap}
                  label="University"
                  value={selectedLawyer.university}
                />
                <DetailRow
                  icon={MapPin}
                  label="Primary Jurisdiction"
                  value={selectedLawyer.jurisdictionState || "Nigeria"}
                />
                <DetailRow
                  icon={Scale}
                  label="Cases Won"
                  value={`${selectedLawyer.casesWon} documented cases`}
                />
              </div>

              {selectedLawyer.practiceAreas && selectedLawyer.practiceAreas.length > 0 && (
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-xs font-semibold text-foreground">Practice Focus Areas</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {selectedLawyer.practiceAreas.map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter className="flex-wrap justify-between gap-2 sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDownloadLawyerSlip(selectedLawyer)}
                >
                  <Download className="mr-1.5 h-4 w-4" />
                  Download Advocate Slip
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    setPendingDelete({
                      type: "lawyers",
                      id: selectedLawyer.id,
                      name: selectedLawyer.fullName,
                    })
                  }
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Delete Record
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ADD MEMBER MODAL */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Register Foundation Member</DialogTitle>
            <DialogDescription>
              Create a verified member record in the Foundation registry.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateMember} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="admin-member-name">Full Name *</Label>
                <Input
                  id="admin-member-name"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Amina Bello"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-member-email">Email Address *</Label>
                <Input
                  id="admin-member-email"
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="amina@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-member-phone">Phone Number</Label>
                <Input
                  id="admin-member-phone"
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-member-state">State *</Label>
                <select
                  id="admin-member-state"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className={`${selectClassName} w-full`}
                >
                  {ALL_STATES.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-member-lga">Local Government Area *</Label>
                <select
                  id="admin-member-lga"
                  value={newLga}
                  onChange={(e) => setNewLga(e.target.value)}
                  className={`${selectClassName} w-full`}
                >
                  {availableLgas.map((lgaName) => (
                    <option key={lgaName} value={lgaName}>
                      {lgaName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-member-tier">Membership Tier</Label>
                <select
                  id="admin-member-tier"
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value as MembershipTier)}
                  className={`${selectClassName} w-full`}
                >
                  {MEMBERSHIP_TIERS.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-member-gender">Gender</Label>
                <select
                  id="admin-member-gender"
                  value={newGender}
                  onChange={(e) =>
                    setNewGender(e.target.value as "Male" | "Female" | "Prefer not to say")
                  }
                  className={`${selectClassName} w-full`}
                >
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="admin-member-occupation">Occupation</Label>
                <Input
                  id="admin-member-occupation"
                  value={newOccupation}
                  onChange={(e) => setNewOccupation(e.target.value)}
                  placeholder="e.g. Educator, Civil Servant, Entrepreneur"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="admin-member-photo">Passport Photograph (Optional)</Label>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="admin-member-photo"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {newPhotoUrl ? "Change Photo" : "Upload Photo"}
                    <input
                      id="admin-member-photo"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                  {newPhotoUrl && (
                    <img
                      src={newPhotoUrl}
                      alt="Passport preview"
                      className="h-10 w-10 rounded-full border border-border object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSavingMember}
                className="bg-[var(--green-deep)] text-white hover:bg-[var(--green-mid)]"
              >
                {isSavingMember ? "Saving..." : "Save Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove registry record?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes{" "}
              <span className="font-semibold text-foreground">{pendingDelete?.name}</span> from the
              local registry on this device. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRecord}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Remove Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground uppercase">{label}</p>
        <p className="truncate font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function EmptyRegistryState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

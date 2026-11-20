import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Gavel,
  Globe,
  HeartHandshake,
  LayoutDashboard,
  LayoutTemplate,
  Lock,
  Menu,
  Plus,
  Scale,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { CmsBuilderView } from "@/components/admin/CmsBuilderView";
import { CommandCenterView, type AdminModuleTab } from "@/components/admin/CommandCenterView";
import { CommunityChaptersView } from "@/components/admin/CommunityChaptersView";
import { GovernanceAuditView } from "@/components/admin/GovernanceAuditView";
import { LegalAidAdminView } from "@/components/admin/LegalAidAdminView";
import { ReliefPortalView } from "@/components/admin/ReliefPortalView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { loadCmsPages, type CmsPage } from "@/data/admin/cmsStore";
import {
  loadBatches,
  loadBeneficiaries,
  loadChapterCoordination,
  loadLegalCases,
  updateBeneficiaryStatus,
  type BeneficiaryRecord,
  type ChapterCoordinationRecord,
  type DisbursementBatch,
  type LegalCaseRecord,
} from "@/data/admin/operationsStore";
import {
  appendAuditLog,
  getRoleProfile,
  hasPermission,
  loadAuditLogs,
  ROLE_PROFILES,
  type AdminRole,
  type AuditLogEntry,
} from "@/data/admin/rbac";
import { getLawyersList, type LawyerVolunteer } from "@/data/lawyersStore";
import { loadMembersFromStorage, updateMemberStatus, type Member } from "@/data/membershipStore";
import { loadVolunteersFromStorage, type VolunteerRecord } from "@/data/volunteersStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      {
        title: "ARF Executive Command & Headless CMS — Abba Roller Foundation",
      },
      {
        name: "description",
        content:
          "Enterprise operational dashboard, multi-channel relief portal, pro bono legal aid matching engine, and no-code headless CMS for Abba Roller Foundation.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboardShell,
});

interface SidebarSection {
  groupLabel: string;
  items: {
    id: AdminModuleTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const SIDEBAR_SECTIONS: readonly SidebarSection[] = [
  {
    groupLabel: "Overview",
    items: [{ id: "command", label: "Command Center", icon: LayoutDashboard }],
  },
  {
    groupLabel: "Website CMS",
    items: [
      { id: "cms-pages", label: "Page & Block Builder", icon: LayoutTemplate },
      { id: "cms-media", label: "Navigation & Media", icon: Globe },
    ],
  },
  {
    groupLabel: "Operations",
    items: [
      { id: "relief", label: "Relief & Beneficiaries", icon: HeartHandshake },
      { id: "legal", label: "Pro Bono Legal Aid", icon: Scale },
    ],
  },
  {
    groupLabel: "Community",
    items: [{ id: "community", label: "Members & Chapters", icon: Users }],
  },
  {
    groupLabel: "System Settings",
    items: [{ id: "governance", label: "RBAC & Audit Log", icon: ShieldCheck }],
  },
];

const MODULE_META: Record<AdminModuleTab, { title: string; subtitle: string }> = {
  command: {
    title: "Executive Command Center",
    subtitle: "National relief disbursement throughput, legal case pipeline & approval queues",
  },
  "cms-pages": {
    title: "Headless CMS & No-Code Page Builder",
    subtitle: "Create, preview, schedule, and roll back decoupled public website pages",
  },
  "cms-media": {
    title: "Navigation Schema & Media Library",
    subtitle: "Reorder public menus, toggle page visibility, and manage S3/R2 video & photo assets",
  },
  relief: {
    title: "Beneficiaries & Multi-Channel Relief Portal",
    subtitle: "NDPR-masked NIN verification, vulnerability cohorts & proof-of-delivery batches",
  },
  legal: {
    title: "Pro Bono Legal Aid & NBA Case Engine",
    subtitle:
      "Inmate & indigent intake, Bar enrollment verification & milestone courtroom tracking",
  },
  community: {
    title: "Nationwide Membership & State Chapters",
    subtitle: "36-state + FCT member onboarding, regional coordinators & volunteer rosters",
  },
  governance: {
    title: "RBAC Matrix, NDPR Controls & Audit Trail",
    subtitle: "5-role least-privilege access governance and immutable operational logs",
  },
};

function AdminDashboardShell() {
  const [activeModule, setActiveModule] = useState<AdminModuleTab>("command");
  const [activeRole, setActiveRole] = useState<AdminRole>("SUPER_ADMIN");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live state synchronized across stores
  const [members, setMembers] = useState<Member[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerRecord[]>([]);
  const [lawyers, setLawyers] = useState<LawyerVolunteer[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryRecord[]>([]);
  const [batches, setBatches] = useState<DisbursementBatch[]>([]);
  const [legalCases, setLegalCases] = useState<LegalCaseRecord[]>([]);
  const [chapters, setChapters] = useState<ChapterCoordinationRecord[]>([]);
  const [cmsPages, setCmsPages] = useState<CmsPage[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Global search
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const syncAllStores = useCallback(() => {
    setMembers(loadMembersFromStorage());
    setVolunteers(loadVolunteersFromStorage());
    setLawyers(getLawyersList());
    setBeneficiaries(loadBeneficiaries());
    setBatches(loadBatches());
    setLegalCases(loadLegalCases());
    setChapters(loadChapterCoordination());
    setCmsPages(loadCmsPages());
    setAuditLogs(loadAuditLogs());
  }, []);

  useEffect(() => {
    syncAllStores();
    const handleEvent = () => syncAllStores();
    window.addEventListener("arf_members_updated", handleEvent);
    window.addEventListener("arf_cms_updated", handleEvent);
    window.addEventListener("arf_admin_updated", handleEvent);
    window.addEventListener("storage", handleEvent);
    return () => {
      window.removeEventListener("arf_members_updated", handleEvent);
      window.removeEventListener("arf_cms_updated", handleEvent);
      window.removeEventListener("arf_admin_updated", handleEvent);
      window.removeEventListener("storage", handleEvent);
    };
  }, [syncAllStores]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const roleProfile = getRoleProfile(activeRole);

  const pendingCounts = useMemo(() => {
    const pendingMembers = members.filter((m) => m.status === "Active").length;
    const pendingRelief = beneficiaries.filter(
      (b) => b.status === "Applied" || b.status === "Under Verification",
    ).length;
    const urgentLegal = legalCases.filter(
      (c) => (c.isInmate || c.priority === "Urgent") && c.milestone !== "Resolved / Acquitted",
    ).length;
    return {
      pendingMembers,
      pendingRelief,
      urgentLegal,
      total: pendingMembers + pendingRelief + urgentLegal,
    };
  }, [members, beneficiaries, legalCases]);

  const globalResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (q.length < 2) return [];
    const results: { label: string; meta: string; module: AdminModuleTab }[] = [];

    for (const p of cmsPages) {
      if (p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)) {
        results.push({ label: p.title, meta: `CMS Page · ${p.status}`, module: "cms-pages" });
      }
    }
    for (const b of beneficiaries) {
      if (b.fullName.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)) {
        results.push({
          label: b.fullName,
          meta: `Beneficiary · ${b.state} (${b.vulnerabilityClass})`,
          module: "relief",
        });
      }
    }
    for (const c of legalCases) {
      if (c.caseTitle.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) {
        results.push({
          label: c.caseTitle,
          meta: `Legal Case · ${c.milestone}`,
          module: "legal",
        });
      }
    }
    for (const m of members) {
      if (m.fullName.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)) {
        results.push({
          label: m.fullName,
          meta: `Member · ${m.state} (${m.id})`,
          module: "community",
        });
      }
    }
    for (const l of lawyers) {
      if (l.fullName.toLowerCase().includes(q) || (l.nbaNumber ?? "").toLowerCase().includes(q)) {
        results.push({
          label: l.fullName,
          meta: `Attorney · ${l.nbaNumber ?? l.id}`,
          module: "legal",
        });
      }
    }
    return results.slice(0, 8);
  }, [globalSearch, cmsPages, beneficiaries, legalCases, members, lawyers]);

  const handleQuickApproveMember = (id: string) => {
    if (!hasPermission(activeRole, "members:manage")) {
      toast.error("Active RBAC role lacks member verification permission.");
      return;
    }
    updateMemberStatus(id, "Verified");
    appendAuditLog({
      role: activeRole,
      action: "MEMBER_VERIFIED_QUEUE",
      entityType: "Member",
      entityId: id,
      summary: `Verified citizen member ${id} directly from Command Center queue.`,
    });
    toast.success(`Verified member ${id} — Digital ID Card unlocked for phone lookup.`);
    syncAllStores();
  };

  const handleQuickApproveBeneficiary = (id: string) => {
    if (!hasPermission(activeRole, "relief:manage")) {
      toast.error("Active RBAC role lacks relief verification permission.");
      return;
    }
    updateBeneficiaryStatus(id, { status: "Approved", ninVerified: true });
    appendAuditLog({
      role: activeRole,
      action: "BENEFICIARY_APPROVED_QUEUE",
      entityType: "Beneficiary",
      entityId: id,
      summary: `Approved relief intake ${id} & verified identity from Command Center queue.`,
    });
    toast.success(`Approved beneficiary ${id}.`);
    syncAllStores();
  };

  const renderSidebarContent = (isMobile: boolean) => (
    <div className="flex h-full flex-col bg-[#0F172A] text-slate-100">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-sm">
            <ShieldCheck className="size-5" />
          </div>
          {(!sidebarCollapsed || isMobile) && (
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold tracking-tight text-white">
                ARF Command CMS
              </p>
              <p className="truncate text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                Institutional Console
              </p>
            </div>
          )}
        </div>
        {!isMobile && (
          <button
            type="button"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="hidden size-8 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white lg:inline-flex"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </button>
        )}
      </div>

      {/* Grouped Navigation */}
      <nav
        aria-label="Admin Console Navigation"
        className="flex-1 space-y-5 overflow-y-auto px-3 py-4"
      >
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.groupLabel}>
            {(!sidebarCollapsed || isMobile) && (
              <p className="px-3 pb-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                {section.groupLabel}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = activeModule === item.id;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModule(item.id);
                        if (isMobile) setMobileMenuOpen(false);
                      }}
                      title={sidebarCollapsed && !isMobile ? item.label : undefined}
                      className={cn(
                        "flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all sm:text-sm",
                        active
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "text-slate-300 hover:bg-slate-800/80 hover:text-white",
                        sidebarCollapsed && !isMobile && "justify-center px-2",
                      )}
                    >
                      <Icon className="size-4.5 shrink-0" />
                      {(!sidebarCollapsed || isMobile) && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Security & Public Site Shortcut */}
      <div className="shrink-0 border-t border-slate-800 p-3 space-y-2">
        {(!sidebarCollapsed || isMobile) && (
          <div className="rounded-md bg-slate-900/90 px-3 py-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Lock className="size-3" />
              <span>NDPR PII Guard Active</span>
            </div>
            <p className="mt-0.5 text-[10px] text-slate-400">Audit trail &amp; RBAC verified</p>
          </div>
        )}
        <Link
          to="/"
          className={cn(
            "flex min-h-10 items-center gap-2 rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800",
            sidebarCollapsed && !isMobile && "justify-center px-2",
          )}
        >
          <ExternalLink className="size-4 shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span>Public Website</span>}
        </Link>
      </div>
    </div>
  );

  const meta = MODULE_META[activeModule];

  return (
    <div className="flex min-h-screen bg-[#f4f6f9] text-slate-900">
      {/* Desktop Collapsible Left Sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 transition-all duration-200 lg:block",
          sidebarCollapsed ? "w-18" : "w-64",
        )}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Left Navigation Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 border-r-slate-800 bg-[#0F172A] p-0 text-white">
          <SheetHeader className="sr-only">
            <SheetTitle>ARF Admin Navigation</SheetTitle>
          </SheetHeader>
          {renderSidebarContent(true)}
        </SheetContent>
      </Sheet>

      {/* Main Content Shell */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Sticky Top Utility Bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open admin navigation drawer"
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden"
              >
                <Menu className="size-5" />
              </button>

              {/* Global Cross-Module Search */}
              <div ref={searchWrapperRef} className="relative w-56 sm:w-72 md:w-84">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="search"
                  value={globalSearch}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => {
                    setGlobalSearch(e.target.value);
                    setSearchFocused(true);
                  }}
                  placeholder="Global search (members, cases, CMS, beneficiaries)..."
                  className="h-10 pl-9 text-xs sm:text-sm"
                />

                {searchFocused && globalResults.length > 0 && (
                  <div className="absolute top-full left-0 z-50 mt-1.5 w-full rounded-md border border-slate-200 bg-white p-1.5 shadow-lg">
                    <p className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Cross-Module Matches
                    </p>
                    {globalResults.map((res, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setActiveModule(res.module);
                          setSearchFocused(false);
                          setGlobalSearch("");
                        }}
                        className="flex w-full cursor-pointer flex-col rounded-xs px-2.5 py-2 text-left hover:bg-slate-100"
                      >
                        <span className="truncate text-xs font-bold text-slate-900">
                          {res.label}
                        </span>
                        <span className="truncate text-[11px] text-slate-500">{res.meta}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Quick Create Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    className="min-h-10 gap-1.5 bg-emerald-800 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    <Plus className="size-4" />
                    <span className="hidden sm:inline">Quick Action</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs">Jump to Action</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveModule("cms-pages")}>
                    <LayoutTemplate className="mr-2 size-4" />
                    <span>Open CMS Page Builder</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveModule("relief")}>
                    <HeartHandshake className="mr-2 size-4" />
                    <span>Register Beneficiary / Batch</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveModule("legal")}>
                    <Gavel className="mr-2 size-4" />
                    <span>Log Inmate / Legal Case</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveModule("community")}>
                    <Users className="mr-2 size-4" />
                    <span>Approve Citizen Members</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Queue Notifications Indicator */}
              <button
                type="button"
                onClick={() => setActiveModule("command")}
                title="Pending Operational Approval Queues"
                className="relative inline-flex size-10 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                <Bell className="size-4" />
                {pendingCounts.total > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                    {pendingCounts.total}
                  </span>
                )}
              </button>

              {/* Interactive RBAC Role Switcher */}
              <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1">
                <span className="hidden text-[10px] font-bold tracking-wider text-slate-500 uppercase xl:inline">
                  Active Role:
                </span>
                <select
                  aria-label="Switch active RBAC operator role"
                  value={activeRole}
                  onChange={(e) => {
                    const nextRole = e.target.value as AdminRole;
                    setActiveRole(nextRole);
                    toast.info(
                      `Switched RBAC session preview to "${getRoleProfile(nextRole).label}".`,
                    );
                  }}
                  className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {ROLE_PROFILES.map((p) => (
                    <option key={p.role} value={p.role}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <Badge
                  variant="outline"
                  className={`hidden text-[10px] font-bold sm:inline-flex ${roleProfile.badgeClass}`}
                >
                  {roleProfile.actorName.split(" ")[0]}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Canvas */}
        <main className="mx-auto w-full max-w-[1440px] flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Active Module Title Banner */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                {meta.title}
              </h1>
              <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">{meta.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/p/$slug"
                params={{ slug: "scholarship-bursary-2026" }}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs hover:bg-emerald-50"
              >
                <Globe className="size-3.5" />
                <span>Live CMS Page (/p/scholarship-bursary-2026)</span>
              </Link>
              <Link
                to="/"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                <ExternalLink className="size-3.5" />
                <span>Executive Home</span>
              </Link>
            </div>
          </div>

          {/* Active Module Viewport */}
          {activeModule === "command" && (
            <CommandCenterView
              activeRole={activeRole}
              beneficiaries={beneficiaries}
              batches={batches}
              legalCases={legalCases}
              lawyers={lawyers}
              members={members}
              onApproveMember={handleQuickApproveMember}
              onApproveBeneficiary={handleQuickApproveBeneficiary}
              onNavigateModule={setActiveModule}
            />
          )}

          {activeModule === "cms-pages" && (
            <CmsBuilderView activeRole={activeRole} initialSubTab="pages" />
          )}

          {activeModule === "cms-media" && (
            <CmsBuilderView activeRole={activeRole} initialSubTab="navigation" />
          )}

          {activeModule === "relief" && (
            <ReliefPortalView
              activeRole={activeRole}
              beneficiaries={beneficiaries}
              batches={batches}
              onRefresh={syncAllStores}
            />
          )}

          {activeModule === "legal" && (
            <LegalAidAdminView
              activeRole={activeRole}
              legalCases={legalCases}
              lawyers={lawyers}
              onRefresh={syncAllStores}
            />
          )}

          {activeModule === "community" && (
            <CommunityChaptersView
              activeRole={activeRole}
              members={members}
              volunteers={volunteers}
              chapters={chapters}
              onRefresh={syncAllStores}
            />
          )}

          {activeModule === "governance" && (
            <GovernanceAuditView
              activeRole={activeRole}
              onSelectRole={setActiveRole}
              auditLogs={auditLogs}
            />
          )}
        </main>
      </div>
    </div>
  );
}

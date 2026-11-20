import { useEffect, useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CheckCircle2,
  MapPin,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MONTHLY_TREND_DATA,
  type BeneficiaryRecord,
  type DisbursementBatch,
  type LegalCaseRecord,
} from "@/data/admin/operationsStore";
import { hasPermission, type AdminRole } from "@/data/admin/rbac";
import type { LawyerVolunteer } from "@/data/lawyersStore";
import type { Member } from "@/data/membershipStore";

export type AdminModuleTab =
  "command" | "cms-pages" | "cms-media" | "relief" | "legal" | "community" | "governance";

interface CommandCenterViewProps {
  activeRole: AdminRole;
  beneficiaries: BeneficiaryRecord[];
  batches: DisbursementBatch[];
  legalCases: LegalCaseRecord[];
  lawyers: LawyerVolunteer[];
  members: Member[];
  onApproveMember: (id: string) => void;
  onApproveBeneficiary: (id: string) => void;
  onNavigateModule: (module: AdminModuleTab) => void;
}

type StateChartMetric = "beneficiaries" | "disbursements" | "members";

function formatCompactNgn(amount: number): string {
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `₦${Math.round(amount / 1_000)}K`;
  }
  return `₦${amount.toLocaleString()}`;
}

export function CommandCenterView({
  activeRole,
  beneficiaries,
  batches,
  legalCases,
  lawyers,
  members,
  onApproveMember,
  onApproveBeneficiary,
  onNavigateModule,
}: CommandCenterViewProps) {
  const [chartMounted, setChartMounted] = useState(false);
  const [chartMetric, setChartMetric] = useState<StateChartMetric>("beneficiaries");

  useEffect(() => {
    setChartMounted(true);
  }, []);

  const canManageMembers = hasPermission(activeRole, "members:manage");
  const canManageRelief = hasPermission(activeRole, "relief:manage");

  const metrics = useMemo(() => {
    const totalBatchFunds = batches.reduce((sum, b) => sum + b.totalValueNgn, 0);
    const totalUnits = batches.reduce((sum, b) => sum + b.unitCount, 0);

    const pwdCount = beneficiaries.filter(
      (b) => b.vulnerabilityClass === "Persons with Disabilities",
    ).length;
    const studentCount = beneficiaries.filter((b) => b.vulnerabilityClass === "Students").length;
    const inmateCount = beneficiaries.filter((b) => b.vulnerabilityClass === "Inmates").length;

    const activeCases = legalCases.filter((c) => c.milestone !== "Resolved / Acquitted").length;
    const resolvedCases = legalCases.filter((c) => c.milestone === "Resolved / Acquitted").length;

    const verifiedMembers = members.filter(
      (m) => m.status === "Verified" || m.status === "Honorary",
    ).length;
    const statesCovered = new Set([
      ...members.map((m) => m.state),
      ...beneficiaries.map((b) => b.state),
      ...batches.map((bt) => bt.state),
    ]).size;

    return {
      totalBatchFunds,
      totalUnits,
      pwdCount,
      studentCount,
      inmateCount,
      activeCases,
      resolvedCases,
      verifiedMembers,
      statesCovered,
    };
  }, [batches, beneficiaries, legalCases, members]);

  const stateChartData = useMemo(() => {
    const stateBuckets = new Map<
      string,
      { state: string; beneficiaries: number; disbursementsNgnK: number; members: number }
    >();

    const touchState = (raw: string) => {
      const state = raw === "Federal Capital Territory" ? "FCT Abuja" : raw;
      const existing = stateBuckets.get(state);
      if (existing) return existing;
      const fresh = { state, beneficiaries: 0, disbursementsNgnK: 0, members: 0 };
      stateBuckets.set(state, fresh);
      return fresh;
    };

    for (const b of beneficiaries) {
      touchState(b.state).beneficiaries += 1;
    }
    for (const bt of batches) {
      touchState(bt.state).disbursementsNgnK += Math.round(bt.totalValueNgn / 1000);
    }
    for (const m of members) {
      touchState(m.state).members += 1;
    }

    return Array.from(stateBuckets.values())
      .sort((a, b) => b.beneficiaries + b.members - (a.beneficiaries + a.members))
      .slice(0, 10);
  }, [beneficiaries, batches, members]);

  const pendingMembers = useMemo(
    () => members.filter((m) => m.status === "Pending" || m.status === "Active").slice(0, 4),
    [members],
  );

  const unverifiedBeneficiaries = useMemo(
    () =>
      beneficiaries
        .filter((b) => b.status === "Applied" || b.status === "Under Verification")
        .slice(0, 4),
    [beneficiaries],
  );

  const urgentInmateCases = useMemo(
    () =>
      legalCases
        .filter(
          (c) => (c.isInmate || c.priority === "Urgent") && c.milestone !== "Resolved / Acquitted",
        )
        .slice(0, 4),
    [legalCases],
  );

  return (
    <div className="space-y-6">
      {/* KPI Overview Strip */}
      <section
        aria-label="Executive Command KPIs"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Total Funds &amp; Relief
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Banknote className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl font-extrabold text-slate-900">
              {formatCompactNgn(metrics.totalBatchFunds)}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              <strong>{metrics.totalUnits.toLocaleString()}</strong> relief units delivered across{" "}
              {batches.length} tracked batches
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Active Beneficiaries
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl font-extrabold text-slate-900">
              {beneficiaries.length}{" "}
              <span className="text-xs font-semibold text-slate-500">audited profiles</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-bold">
              <span className="rounded-full bg-purple-50 px-2 py-0.5 text-purple-800">
                PWDs: {metrics.pwdCount}
              </span>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-800">
                Students: {metrics.studentCount}
              </span>
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-800">
                Inmates: {metrics.inmateCount}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Pro Bono Legal Cases
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <Scale className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl font-extrabold text-slate-900">
              {metrics.activeCases}{" "}
              <span className="text-xs font-semibold text-emerald-700">
                · {metrics.resolvedCases} resolved/acquitted
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-600">
              <strong>{lawyers.length}</strong> NBA-verified pro bono advocates on roster
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Verified Members
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
              <MapPin className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl font-extrabold text-slate-900">
              {members.length}{" "}
              <span className="text-xs font-semibold text-slate-500">
                ({metrics.verifiedMembers} verified)
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Active footprint spanning <strong>{metrics.statesCovered}</strong> states across
              Nigeria
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Interactive Visualizations Row */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* State Distribution Bar Chart */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                State-by-State Operational Footprint
              </CardTitle>
              <p className="text-xs text-slate-500">
                Top active states across Nigeria&apos;s 36 states + FCT
              </p>
            </div>
            <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
              {(
                [
                  { id: "beneficiaries", label: "Beneficiaries" },
                  { id: "disbursements", label: "₦ Aid (K)" },
                  { id: "members", label: "Members" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setChartMetric(opt.id)}
                  className={`cursor-pointer rounded-md px-2.5 py-1 transition-colors ${
                    chartMetric === opt.id
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {chartMounted ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stateChartData}
                    margin={{ top: 8, right: 12, left: -12, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="state"
                      tick={{ fontSize: 11, fill: "#475569" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#475569" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "none",
                        borderRadius: "6px",
                        color: "#ffffff",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey={
                        chartMetric === "beneficiaries"
                          ? "beneficiaries"
                          : chartMetric === "disbursements"
                            ? "disbursementsNgnK"
                            : "members"
                      }
                      name={
                        chartMetric === "beneficiaries"
                          ? "Beneficiaries"
                          : chartMetric === "disbursements"
                            ? "Disbursed (₦000s)"
                            : "Registered Members"
                      }
                      fill={
                        chartMetric === "disbursements"
                          ? "#0B3D2E"
                          : chartMetric === "members"
                            ? "#145A43"
                            : "#0f172a"
                      }
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-72 items-center justify-center rounded-md bg-slate-50 text-xs text-slate-500">
                Loading state analytics...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Relief vs Legal Resolution Trend Chart */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-bold text-slate-900">
              Monthly Relief Disbursement vs. Legal Case Resolutions
            </CardTitle>
            <p className="text-xs text-slate-500">
              6-month combined throughput (₦ Thousands disbursed vs. court cases resolved)
            </p>
          </CardHeader>
          <CardContent className="pt-5">
            {chartMounted ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={[...MONTHLY_TREND_DATA]}
                    margin={{ top: 8, right: 12, left: -10, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#475569" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 11, fill: "#475569" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11, fill: "#475569" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "none",
                        borderRadius: "6px",
                        color: "#ffffff",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="reliefDisbursedNgnThousands"
                      name="Relief Value (₦000s)"
                      fill="#d1fae5"
                      stroke="#0B3D2E"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="casesResolved"
                      name="Cases Resolved"
                      stroke="#C62828"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#C62828" }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-72 items-center justify-center rounded-md bg-slate-50 text-xs text-slate-500">
                Loading trend visualizations...
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Actionable Operational Queues */}
      <section aria-label="Actionable Approval Queues" className="grid gap-6 lg:grid-cols-3">
        {/* Queue 1: Pending Member Approvals */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Pending Member Approvals
              </CardTitle>
              <p className="text-xs text-slate-500">Citizen registrations awaiting verification</p>
            </div>
            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
              {pendingMembers.length} queued
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-4">
            {pendingMembers.length === 0 ? (
              <div className="rounded-md bg-slate-50 p-4 text-center text-xs text-slate-500">
                All citizen registrations are verified.
              </div>
            ) : (
              pendingMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-slate-100 bg-slate-50/70 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">{member.fullName}</p>
                    <p className="truncate text-[11px] text-slate-500">
                      {member.lga}, {member.state} · {member.tier}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!canManageMembers}
                    onClick={() => onApproveMember(member.id)}
                    className="min-h-9 shrink-0 bg-emerald-800 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="mr-1 size-3.5" />
                    Verify
                  </Button>
                </div>
              ))
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onNavigateModule("community")}
              className="w-full justify-between text-xs font-semibold text-slate-700"
            >
              <span>Open Member Registry</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </CardContent>
        </Card>

        {/* Queue 2: Unverified Relief Applications */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Unverified Relief Intake
              </CardTitle>
              <p className="text-xs text-slate-500">
                Applicants pending NIN / coordinator approval
              </p>
            </div>
            <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-800">
              {unverifiedBeneficiaries.length} queued
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-4">
            {unverifiedBeneficiaries.length === 0 ? (
              <div className="rounded-md bg-slate-50 p-4 text-center text-xs text-slate-500">
                Zero unverified relief applications pending.
              </div>
            ) : (
              unverifiedBeneficiaries.map((ben) => (
                <div
                  key={ben.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-slate-100 bg-slate-50/70 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">{ben.fullName}</p>
                    <p className="truncate text-[11px] text-slate-500">
                      {ben.vulnerabilityClass} · {ben.state} · ₦{ben.aidValueNgn.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!canManageRelief}
                    onClick={() => onApproveBeneficiary(ben.id)}
                    className="min-h-9 shrink-0 bg-slate-900 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    <ShieldCheck className="mr-1 size-3.5" />
                    Approve
                  </Button>
                </div>
              ))
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onNavigateModule("relief")}
              className="w-full justify-between text-xs font-semibold text-slate-700"
            >
              <span>Open Relief Portal</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </CardContent>
        </Card>

        {/* Queue 3: Urgent Inmate Legal Requests */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Urgent Inmate Legal Requests
              </CardTitle>
              <p className="text-xs text-slate-500">
                Custodial remand &amp; bail defense escalation
              </p>
            </div>
            <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-800">
              {urgentInmateCases.length} urgent
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-4">
            {urgentInmateCases.length === 0 ? (
              <div className="rounded-md bg-slate-50 p-4 text-center text-xs text-slate-500">
                All urgent custodial cases have been assigned.
              </div>
            ) : (
              urgentInmateCases.map((legalCase) => (
                <div
                  key={legalCase.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-slate-100 bg-slate-50/70 p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="size-3.5 shrink-0 text-rose-600" />
                      <p className="truncate text-xs font-bold text-slate-900">
                        {legalCase.clientInitials}
                      </p>
                    </div>
                    <p className="truncate text-[11px] text-slate-500">
                      {legalCase.state} · {legalCase.milestone}
                      {legalCase.assignedLawyerName
                        ? ` (${legalCase.assignedLawyerName})`
                        : " · Unassigned"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onNavigateModule("legal")}
                    className="min-h-9 shrink-0 text-xs font-bold"
                  >
                    Assign
                  </Button>
                </div>
              ))
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onNavigateModule("legal")}
              className="w-full justify-between text-xs font-semibold text-slate-700"
            >
              <span>Open Case Matching Engine</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

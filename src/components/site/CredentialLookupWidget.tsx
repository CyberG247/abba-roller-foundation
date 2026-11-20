import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Loader2,
  Phone,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type CredentialCategory,
  type CredentialMatch,
  findCredentialsByPhone,
  isPhoneQueryValid,
} from "@/data/credentialLookup";
import { downloadLawyerSlip } from "@/lib/generateLawyerSlip";
import { downloadMembershipCard } from "@/lib/generateMembershipSlip";
import { downloadVolunteerSlip } from "@/lib/generateVolunteerSlip";
import { cn } from "@/lib/utils";

export interface CredentialLookupWidgetProps {
  defaultFilter?: CredentialCategory | "all";
  initialPhone?: string;
  compact?: boolean;
}

const CATEGORY_TABS: readonly { id: CredentialCategory | "all"; label: string }[] = [
  { id: "all", label: "All Programs" },
  { id: "member", label: "Members" },
  { id: "lawyer", label: "Pro Bono Lawyers" },
  { id: "volunteer", label: "Volunteers" },
];

const VERIFY_DURATION_MS = 1240;

const VERIFICATION_STAGES = [
  {
    threshold: 0,
    label: "Registry Match",
    detail: "Searching ARF citizen, advocate & volunteer records...",
  },
  {
    threshold: 38,
    label: "Admin Review",
    detail: "Verifying Secretariat approval & chapter clearance...",
  },
  {
    threshold: 76,
    label: "ID Issuance",
    detail: "Checking credential availability for download...",
  },
] as const;

function getCategoryMeta(kind: CredentialCategory) {
  switch (kind) {
    case "member":
      return {
        label: "Nationwide Member",
        documentTitle: "Digital Membership ID Card",
        downloadCta: "Download Official ID Card (PNG)",
        Icon: Users,
      };
    case "lawyer":
      return {
        label: "Pro Bono Legal Advocate",
        documentTitle: "Bar Accreditation Slip",
        downloadCta: "Download Official Bar Slip (PNG)",
        Icon: Scale,
      };
    case "volunteer":
      return {
        label: "Humanitarian Volunteer",
        documentTitle: "Volunteer Accreditation Slip",
        downloadCta: "Download Volunteer Slip (PNG)",
        Icon: UserCheck,
      };
  }
}

async function triggerCredentialDownload(match: CredentialMatch): Promise<void> {
  if (!match.isIssued || match.isRemoved || !match.record) return;

  if (match.kind === "member") {
    await downloadMembershipCard(match.record);
    return;
  }

  if (match.kind === "lawyer") {
    const r = match.record;
    await downloadLawyerSlip({
      refNumber: r.id,
      fullName: r.fullName,
      lawFirm: r.lawFirm,
      email: r.email,
      university: r.university,
      phone: r.phone,
      callToBarYear: r.callToBarYear,
      casesWon: r.casesWon,
      jurisdictionState: r.jurisdictionState,
      practiceAreas: r.practiceAreas,
      submissionDate: r.submissionDate,
    });
    return;
  }

  await downloadVolunteerSlip(match.record);
}

export function CredentialLookupWidget({
  defaultFilter = "all",
  initialPhone = "",
  compact = false,
}: CredentialLookupWidgetProps) {
  const [phoneInput, setPhoneInput] = useState(initialPhone);
  const [activeQuery, setActiveQuery] = useState("");
  const [filter, setFilter] = useState<CredentialCategory | "all">(defaultFilter);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);

  const rafRef = useRef<number | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelPendingVerification = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (finishTimerRef.current !== null) {
      clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
  }, []);

  const startVerificationCheck = useCallback(
    (trimmedQuery: string) => {
      cancelPendingVerification();
      setActiveQuery(trimmedQuery);
      setIsChecking(true);
      setProgress(5);

      const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();

      const step = (now: number) => {
        const elapsed = Math.max(0, now - startTime);
        const ratio = Math.min(elapsed / VERIFY_DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - ratio, 2.2);
        const nextPct = Math.min(100, Math.round(5 + eased * 95));
        setProgress(nextPct);

        if (ratio < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          rafRef.current = null;
          finishTimerRef.current = setTimeout(() => {
            finishTimerRef.current = null;
            setIsChecking(false);
          }, 60);
        }
      };

      rafRef.current = requestAnimationFrame(step);
    },
    [cancelPendingVerification],
  );

  useEffect(() => {
    return () => cancelPendingVerification();
  }, [cancelPendingVerification]);

  useEffect(() => {
    if (initialPhone && isPhoneQueryValid(initialPhone)) {
      const trimmed = initialPhone.trim();
      setPhoneInput(trimmed);
      startVerificationCheck(trimmed);
    } else if (initialPhone) {
      setPhoneInput(initialPhone);
    }
  }, [initialPhone, startVerificationCheck]);

  // Re-evaluate live whenever an Administrator updates verification status in /admin or another tab
  useEffect(() => {
    const refresh = () => setRevision((prev) => prev + 1);
    window.addEventListener("arf_members_updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("arf_members_updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const hasSearched = activeQuery.trim().length > 0 && isPhoneQueryValid(activeQuery);

  const matches = useMemo(() => {
    void revision;
    if (!hasSearched) return [];
    return findCredentialsByPhone(activeQuery, filter);
  }, [activeQuery, filter, hasSearched, revision]);

  const currentStage =
    progress >= 76
      ? VERIFICATION_STAGES[2]
      : progress >= 38
        ? VERIFICATION_STAGES[1]
        : VERIFICATION_STAGES[0];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!isPhoneQueryValid(phoneInput)) {
      cancelPendingVerification();
      setIsChecking(false);
      setProgress(0);
      setValidationError(
        "Enter the full phone number you used during registration (at least 7 digits, e.g. 0803 123 4567).",
      );
      setActiveQuery("");
      return;
    }
    setValidationError(null);
    startVerificationCheck(phoneInput.trim());
  }

  async function handleDownload(match: CredentialMatch) {
    if (!match.isIssued) return;
    const key = `${match.kind}:${match.id}`;
    setDownloadingKey(key);
    try {
      await triggerCredentialDownload(match);
      const meta = getCategoryMeta(match.kind);
      toast.success(`${meta.documentTitle} downloaded for ${match.fullName}.`);
    } catch {
      toast.error("Unable to generate your credential file right now. Please try again.");
    } finally {
      setDownloadingKey(null);
    }
  }

  function copyReference(id: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(id);
      toast.success("Reference ID copied to clipboard.");
    }
  }

  const circleCircumference = 2 * Math.PI * 34;

  return (
    <div
      className={cn(
        "rounded-md border border-hairline bg-card shadow-lift overflow-hidden",
        compact ? "p-5 sm:p-7" : "p-6 sm:p-10",
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
        <div className="flex items-start gap-3.5">
          <div className="size-11 rounded-sm bg-green-wash text-green-deep border border-green-mid/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
              Check Verification Status &amp; Download ID
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the phone number you submitted during registration. Your ID Card or
              Accreditation Slip unlocks automatically once an Administrator verifies your record.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Credential categories">
        {CATEGORY_TABS.map((tab) => {
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "min-h-10 px-4 py-2 rounded-sm text-xs font-bold tracking-wide transition-colors border cursor-pointer",
                active
                  ? "bg-green-deep text-white border-green-deep shadow-xs"
                  : "bg-surface text-muted-foreground border-hairline hover:border-green-mid hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Phone Search Form */}
      <form onSubmit={handleSearch} className="mt-5">
        <label
          htmlFor="credential-phone-lookup"
          className="block text-sm font-semibold text-ink mb-2"
        >
          Registered Phone Number
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Phone className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="credential-phone-lookup"
              type="tel"
              value={phoneInput}
              onChange={(e) => {
                setPhoneInput(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="e.g. 0803 123 4567 or +2348031234567"
              className="pl-10 h-12 text-base bg-surface"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isChecking}
            className="h-12 px-7 bg-green-deep hover:bg-green-mid text-white font-bold shrink-0 min-w-40"
          >
            {isChecking ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Checking Status...
              </>
            ) : (
              <>
                <Search className="size-4 mr-2" />
                Check Status
              </>
            )}
          </Button>
        </div>
        {validationError && (
          <p className="mt-2.5 text-sm text-brand-red font-medium flex items-center gap-1.5">
            <ShieldAlert className="size-4 shrink-0" />
            <span>{validationError}</span>
          </p>
        )}
      </form>

      {/* Animated Rounded Circular Verification Loader */}
      {hasSearched && isChecking && (
        <div
          role="status"
          aria-live="polite"
          className="mt-8 rounded-sm border border-green-mid/30 bg-surface p-7 sm:p-9 shadow-xs flex flex-col items-center text-center"
        >
          <div
            className="relative size-24 flex items-center justify-center"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="Registry verification progress"
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border-2 border-dashed border-green-mid/35 animate-spin"
              style={{ animationDuration: "3.2s" }}
            />
            <svg className="size-20 -rotate-90" viewBox="0 0 80 80" aria-hidden>
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-green-wash"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circleCircumference}
                strokeDashoffset={circleCircumference * (1 - progress / 100)}
                className="text-green-deep transition-[stroke-dashoffset] duration-75 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-base font-extrabold text-green-deep tabular-nums leading-none">
                {progress}%
              </span>
            </div>
          </div>

          <p className="mt-4 font-display font-bold text-ink text-base sm:text-lg">
            Verifying Registration Status
          </p>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md">
            {currentStage.detail}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px]">
            {VERIFICATION_STAGES.map((stage, idx) => {
              const nextThreshold = VERIFICATION_STAGES[idx + 1]?.threshold ?? 96;
              const isDone = progress >= nextThreshold;
              const isActive = !isDone && progress >= stage.threshold;
              return (
                <span
                  key={stage.label}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition-colors",
                    isDone
                      ? "border-green-mid/35 bg-green-wash/50 text-green-deep font-semibold"
                      : isActive
                        ? "border-amber-300/80 bg-amber-50 text-ink font-semibold"
                        : "border-hairline bg-background text-muted-foreground",
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="size-3 text-green-deep shrink-0" />
                  ) : isActive ? (
                    <Loader2 className="size-3 text-amber-700 animate-spin shrink-0" />
                  ) : (
                    <Clock className="size-3 text-muted-foreground/60 shrink-0" />
                  )}
                  <span>{stage.label}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Results Area — Pop-Out Reveal After 1.3s Circular Load */}
      {hasSearched && !isChecking && (
        <div className="mt-8 space-y-4 animate-in fade-in-0 zoom-in-95 duration-300">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>
              Lookup Results for <span className="text-ink font-mono">{activeQuery}</span>
            </span>
            <span>
              {matches.length} {matches.length === 1 ? "record" : "records"} found
            </span>
          </div>

          {matches.length === 0 ? (
            <div className="rounded-sm border border-dashed border-hairline bg-surface p-6 sm:p-8 text-center">
              <div className="size-12 mx-auto rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                <Search className="size-5" />
              </div>
              <h3 className="font-display font-bold text-ink text-base sm:text-lg">
                No Registration Found for This Phone Number
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground max-w-lg mx-auto">
                Double-check that you entered the exact phone number used when registering
                {filter !== "all" ? " or switch the category filter above to All Programs" : ""}. If
                you haven&apos;t registered yet, choose a programme below.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                <Button asChild variant="outline" size="sm">
                  <Link to="/membership">Register as Member</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/legal-aid">Enroll as Pro Bono Lawyer</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/volunteer">Apply as Volunteer</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => {
                const meta = getCategoryMeta(match.kind);
                const key = `${match.kind}:${match.id}`;
                const isDownloading = downloadingKey === key;

                return (
                  <article
                    key={key}
                    className={cn(
                      "rounded-sm border p-5 sm:p-6 transition-colors",
                      match.isRemoved
                        ? "border-red-300 bg-red-50/75"
                        : match.isIssued
                          ? "border-green-mid/40 bg-green-wash/25"
                          : "border-amber-300/80 bg-amber-50/50",
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 sm:gap-4">
                        <div
                          className={cn(
                            "size-14 sm:size-16 rounded-sm flex items-center justify-center shrink-0 overflow-hidden shadow-xs border-2",
                            match.isRemoved
                              ? match.photoUrl
                                ? "border-red-400 bg-red-50"
                                : "bg-red-600 text-white border-red-600"
                              : match.isIssued
                                ? match.photoUrl
                                  ? "border-green-deep/40 bg-white"
                                  : "bg-green-deep text-white border-green-deep"
                                : match.photoUrl
                                  ? "border-amber-400 bg-amber-50"
                                  : "bg-amber-100 text-amber-800 border-amber-200",
                          )}
                        >
                          {match.photoUrl ? (
                            <img
                              src={match.photoUrl}
                              alt={match.fullName}
                              className={cn(
                                "size-full object-cover",
                                match.isRemoved && "grayscale opacity-80",
                              )}
                            />
                          ) : (
                            <meta.Icon className="size-6" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-[11px] font-bold">
                              {meta.label}
                            </Badge>
                            {match.isRemoved ? (
                              <Badge className="bg-red-600 text-white hover:bg-red-600 text-[11px] gap-1">
                                <XCircle className="size-3.5" />
                                Removed / Deleted ({match.statusLabel})
                              </Badge>
                            ) : match.isIssued ? (
                              <Badge className="bg-green-deep text-white hover:bg-green-deep text-[11px] gap-1">
                                <BadgeCheck className="size-3.5" />
                                Verified &amp; ID Issued ({match.statusLabel})
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-100 text-[11px] gap-1">
                                <Clock className="size-3.5" />
                                Pending Verification ({match.statusLabel})
                              </Badge>
                            )}
                          </div>
                          <h3
                            className={cn(
                              "mt-2 font-display text-lg font-bold",
                              match.isRemoved ? "text-red-950" : "text-ink",
                            )}
                          >
                            {match.fullName}
                          </h3>
                          <p
                            className={cn(
                              "text-sm",
                              match.isRemoved ? "text-red-800/85" : "text-muted-foreground",
                            )}
                          >
                            {match.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                          Reference ID
                        </span>
                        <div
                          className={cn(
                            "mt-0.5 inline-flex items-center gap-1.5 font-mono text-xs font-bold bg-white border px-2.5 py-1 rounded-xs",
                            match.isRemoved
                              ? "border-red-200 text-red-700"
                              : "border-hairline text-ink",
                          )}
                        >
                          <span>{match.id}</span>
                          <button
                            type="button"
                            onClick={() => copyReference(match.id)}
                            aria-label={`Copy reference ${match.id}`}
                            className="text-muted-foreground hover:text-ink cursor-pointer"
                          >
                            <Copy className="size-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {match.removedDate
                            ? `Removed: ${match.removedDate}`
                            : `Submitted: ${match.submittedDate}`}
                        </p>
                      </div>
                    </div>

                    {match.isRemoved ? (
                      <div className="mt-5 pt-4 border-t border-red-200 flex items-start gap-2.5 text-sm text-red-900">
                        <XCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-800">
                            Registration Removed / Deleted
                          </p>
                          <p className="mt-0.5 text-xs sm:text-sm text-red-800/90 leading-relaxed">
                            {match.pendingNote}
                          </p>
                        </div>
                      </div>
                    ) : match.isIssued ? (
                      <div className="mt-5 pt-4 border-t border-green-mid/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-2 text-sm text-green-deep">
                          <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                          <span>
                            Admin verification confirmed. Your official{" "}
                            <strong className="font-semibold">{meta.documentTitle}</strong> is
                            available for download.
                          </span>
                        </div>
                        <Button
                          type="button"
                          disabled={isDownloading}
                          onClick={() => void handleDownload(match)}
                          className="min-h-11 bg-green-deep hover:bg-green-mid text-white font-bold px-5 shrink-0"
                        >
                          {isDownloading ? (
                            <>
                              <Loader2 className="size-4 mr-2 animate-spin" />
                              Preparing File...
                            </>
                          ) : (
                            <>
                              <Download className="size-4 mr-2" />
                              {meta.downloadCta}
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-5 pt-4 border-t border-amber-200/80 flex items-start gap-2.5 text-sm text-amber-950">
                        <Clock className="size-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">
                            Credential Not Yet Issued — Awaiting Admin Approval
                          </p>
                          <p className="mt-0.5 text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                            {match.pendingNote} No ID card or slip is downloadable while your status
                            is pending. Check back here with{" "}
                            <span className="font-mono font-semibold">{match.phone}</span> once
                            verified.
                          </p>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

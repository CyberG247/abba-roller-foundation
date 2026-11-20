import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Gavel,
  GraduationCap,
  Mail,
  Phone,
  Scale,
  Shield,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveLawyerVolunteer } from "@/data/lawyersStore";
import { NIGERIAN_STATES } from "@/data/volunteerOptions";
import type { LawyerSlipData } from "@/lib/generateLawyerSlip";
import { cn } from "@/lib/utils";

const DRAFT_STORAGE_KEY = "arf_lawyer_intake_draft_v1";

const CALL_TO_BAR_YEARS = Array.from({ length: 57 }, (_, i) => String(2026 - i));
const CASES_WON_OPTIONS = Array.from({ length: 100 }, (_, i) => String(i + 1));

const LEGAL_SPECIALTIES = [
  "Indigent Criminal Defense & Unlawful Detention",
  "Bail Facilitation & Prison Decongestion",
  "Child Rights, Custody & Welfare Protection",
  "Domestic Violence & Women's Legal Advocacy",
  "Disability Rights & Equal Protection",
  "Land, Tenancy & Eviction Defense for Vulnerable Families",
  "Human Rights Enforcement & Fundamental Freedoms",
  "General Pro Bono Litigation & Civil Rights",
];

const WIZARD_STEPS = [
  { id: 1 as const, label: "Practitioner & Chambers" },
  { id: 2 as const, label: "Bar Credentials" },
  { id: 3 as const, label: "Focus & Pledge" },
];

type LawyerWizardStep = 1 | 2 | 3;

export function LawyersVolunteerSection({ id = "lawyers-volunteer" }: { id?: string }) {
  const [step, setStep] = useState<LawyerWizardStep>(1);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [lawFirm, setLawFirm] = useState("");
  const [nbaNumber, setNbaNumber] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [phone, setPhone] = useState("");
  const [callToBarYear, setCallToBarYear] = useState("");
  const [casesWon, setCasesWon] = useState("");
  const [jurisdictionState, setJurisdictionState] = useState("Jigawa");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([
    "Indigent Criminal Defense & Unlawful Detention",
  ]);
  const [pledgeConsent, setPledgeConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [slipData, setSlipData] = useState<LawyerSlipData | null>(null);
  const [isSlipOpen, setIsSlipOpen] = useState(false);

  // Restore saved section draft on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Partial<{
        fullName: string;
        lawFirm: string;
        nbaNumber: string;
        email: string;
        university: string;
        phone: string;
        callToBarYear: string;
        casesWon: string;
        jurisdictionState: string;
      }>;
      if (draft.fullName) setFullName(draft.fullName);
      if (draft.lawFirm) setLawFirm(draft.lawFirm);
      if (draft.nbaNumber) setNbaNumber(draft.nbaNumber);
      if (draft.email) setEmail(draft.email);
      if (draft.university) setUniversity(draft.university);
      if (draft.phone) setPhone(draft.phone);
      if (draft.callToBarYear) setCallToBarYear(draft.callToBarYear);
      if (draft.casesWon) setCasesWon(draft.casesWon);
      if (draft.jurisdictionState) setJurisdictionState(draft.jurisdictionState);
    } catch {
      // ignore corrupted draft
    }
  }, []);

  const persistDraft = () => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({
          fullName,
          lawFirm,
          nbaNumber,
          email,
          university,
          phone,
          callToBarYear,
          casesWon,
          jurisdictionState,
        }),
      );
      setDraftSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch {
      // ignore
    }
  };

  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec],
    );
  };

  const handleSaveAndContinue = () => {
    setErrorMsg(null);

    if (step === 1) {
      if (!fullName.trim()) {
        setErrorMsg("Please enter your full legal name and title (e.g. Barr., Esq.).");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setErrorMsg("Please enter a valid professional email address.");
        return;
      }
      if (!phone.trim()) {
        setErrorMsg("Please enter an accessible phone number for urgent bail referrals.");
        return;
      }
      persistDraft();
      setStep(2);
      toast.success("Practitioner details saved. Next: enter Bar credentials.");
      return;
    }

    if (step === 2) {
      if (!university.trim()) {
        setErrorMsg("Please provide your Faculty of Law / University (LL.B).");
        return;
      }
      if (!callToBarYear) {
        setErrorMsg("Please select your Call to Bar year.");
        return;
      }
      if (!casesWon) {
        setErrorMsg("Please select the number of cases won so far.");
        return;
      }
      persistDraft();
      setStep(3);
      toast.success("Bar credentials saved. Select your pro bono focus areas to finish.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (step < 3) {
      handleSaveAndContinue();
      return;
    }

    if (
      !fullName.trim() ||
      !email.trim() ||
      !university.trim() ||
      !phone.trim() ||
      !callToBarYear ||
      !casesWon
    ) {
      setErrorMsg("Please ensure all required practitioner & Bar credential fields are completed.");
      return;
    }
    if (!pledgeConsent) {
      setErrorMsg(
        "Please confirm your pledge to offer pro bono legal defense for indigent citizens.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const saved = saveLawyerVolunteer({
        fullName: fullName.trim(),
        nbaNumber: nbaNumber.trim() || undefined,
        lawFirm: lawFirm.trim() || undefined,
        email: email.trim(),
        university: university.trim(),
        phone: phone.trim(),
        callToBarYear,
        casesWon: parseInt(casesWon, 10),
        jurisdictionState,
        practiceAreas: selectedSpecialties,
      });

      if (typeof window !== "undefined") {
        sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      }

      const slip: LawyerSlipData = {
        refNumber: saved.id,
        fullName: saved.fullName,
        lawFirm: saved.lawFirm,
        email: saved.email,
        university: saved.university,
        phone: saved.phone,
        callToBarYear: saved.callToBarYear,
        casesWon: saved.casesWon,
        jurisdictionState: saved.jurisdictionState,
        practiceAreas: saved.practiceAreas,
        submissionDate: saved.submissionDate,
      };

      setSlipData(slip);
      setIsSlipOpen(true);
      toast.success(
        "Application received! Your Bar Accreditation Slip will unlock after Admin verification.",
      );
    } catch {
      setErrorMsg("An unexpected error occurred while processing your enrollment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id={id} className="relative border-t border-hairline bg-surface/50 py-14 md:py-20">
      <div className="shell mx-auto max-w-3xl">
        {/* Compact Header & Capability Badges */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-800/40 bg-emerald-950 px-3.5 py-1 text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
            <Scale className="size-3.5 text-emerald-400" />
            <span>Pro Bono Legal Defense Corps</span>
          </div>
          <h2 className="font-display text-2xl font-black tracking-tight text-ink sm:text-4xl">
            Pro Bono Counsel Application
          </h2>
          <p className="mt-2 text-sm font-medium text-emerald-800 italic">
            “Win a case for the less privileged.”
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-background px-3 py-1">
              <Gavel className="size-3 text-emerald-700" />
              Indigent Court Defense
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-background px-3 py-1">
              <Shield className="size-3 text-emerald-700" />
              Prison Bail Applications
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-background px-3 py-1">
              <Sparkles className="size-3 text-amber-600" />
              Admin Bar Verification
            </span>
            <Link
              to="/verify-id"
              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-900 hover:bg-emerald-100"
            >
              <ShieldCheck className="size-3 text-emerald-700" />
              Check &amp; Download Verified Slip
            </Link>
          </div>
        </div>

        {/* Focused 3-Step One-Page Application Card */}
        <div className="overflow-hidden rounded-lg border border-hairline bg-background shadow-lift">
          {/* Interactive Stepper Bar */}
          <div className="border-b border-hairline bg-surface/60 px-5 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
              <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
                Step {step} of 3
              </span>
              {draftSavedAt && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                  <CheckCircle2 className="size-3" />
                  <span>Saved at {draftSavedAt}</span>
                </span>
              )}
            </div>

            <ol className="grid grid-cols-3 gap-2">
              {WIZARD_STEPS.map((item) => {
                const isCurrent = step === item.id;
                const isCompleted = step > item.id;
                const canJump = item.id < step;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={!canJump}
                      onClick={() => {
                        if (canJump) setStep(item.id);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-sm border px-2.5 py-2 text-left transition-all sm:px-3",
                        isCurrent
                          ? "border-emerald-700 bg-emerald-50/70 text-emerald-900"
                          : isCompleted
                            ? "cursor-pointer border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50"
                            : "cursor-default border-hairline bg-white/70 text-muted-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                          isCurrent
                            ? "bg-emerald-800 text-white"
                            : isCompleted
                              ? "bg-emerald-600 text-white"
                              : "border border-hairline bg-surface text-muted-foreground",
                        )}
                      >
                        {isCompleted ? <Check className="size-3.5" /> : item.id}
                      </span>
                      <span className="truncate text-[11px] font-bold sm:text-xs">
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-8">
            {errorMsg && (
              <div className="mb-6 flex items-start gap-2.5 rounded-md border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive sm:text-sm">
                <AlertCircle className="mt-0.5 size-4.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* SECTION 1: PRACTITIONER & CHAMBERS */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink sm:text-xl">
                    Section 1 · Practitioner &amp; Chambers Information
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Provide your legal title and contact channels for confidential court referrals.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="lawyer-fullname" className="text-xs font-bold">
                      Full Name (with Title) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lawyer-fullname"
                      placeholder="e.g. Barr. Aminu Kabir Dutse"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="min-h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lawyer-firm" className="text-xs font-bold">
                      Law Firm / Chambers{" "}
                      <span className="font-normal text-muted-foreground">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute top-3.5 left-3 size-4 text-muted-foreground" />
                      <Input
                        id="lawyer-firm"
                        placeholder="e.g. Dutse Chambers / Independent"
                        value={lawFirm}
                        onChange={(e) => setLawFirm(e.target.value)}
                        className="min-h-11 pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lawyer-email" className="text-xs font-bold">
                      Professional Email <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-3.5 left-3 size-4 text-muted-foreground" />
                      <Input
                        id="lawyer-email"
                        type="email"
                        placeholder="counsel@legalchambers.ng"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="min-h-11 pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lawyer-phone" className="text-xs font-bold">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute top-3.5 left-3 size-4 text-muted-foreground" />
                      <Input
                        id="lawyer-phone"
                        type="tel"
                        placeholder="+234 803 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="min-h-11 pl-9"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: BAR CREDENTIALS & TRACK RECORD */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink sm:text-xl">
                    Section 2 · Nigerian Bar Credentials &amp; Jurisdiction
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter your academic qualification, Call to Bar year, and active state division.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="lawyer-university" className="text-xs font-bold">
                      University / Faculty of Law (LL.B) <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <GraduationCap className="pointer-events-none absolute top-3.5 left-3 size-4 text-muted-foreground" />
                      <Input
                        id="lawyer-university"
                        placeholder="e.g. Ahmadu Bello University (ABU) Zaria / BUK"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        required
                        className="min-h-11 pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lawyer-nba" className="text-xs font-bold">
                      NBA Enrollment No. (SCN){" "}
                      <span className="font-normal text-muted-foreground">(Optional)</span>
                    </Label>
                    <Input
                      id="lawyer-nba"
                      placeholder="e.g. SCN/084122"
                      value={nbaNumber}
                      onChange={(e) => setNbaNumber(e.target.value)}
                      className="min-h-11 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lawyer-jurisdiction" className="text-xs font-bold">
                      Primary Jurisdiction State
                    </Label>
                    <Select value={jurisdictionState} onValueChange={setJurisdictionState}>
                      <SelectTrigger id="lawyer-jurisdiction" className="min-h-11 w-full">
                        <SelectValue placeholder="Select Primary State" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {NIGERIAN_STATES.map((st) => (
                          <SelectItem key={st} value={st}>
                            {st}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lawyer-calltobar" className="text-xs font-bold">
                      Call to Bar Year <span className="text-destructive">*</span>
                    </Label>
                    <Select value={callToBarYear} onValueChange={setCallToBarYear}>
                      <SelectTrigger id="lawyer-calltobar" className="min-h-11 w-full">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 shrink-0 text-muted-foreground" />
                          <SelectValue placeholder="Select Call Year" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {CALL_TO_BAR_YEARS.map((yr) => (
                          <SelectItem key={yr} value={yr}>
                            {yr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lawyer-caseswon" className="text-xs font-bold">
                      Cases Won So Far (1–100) <span className="text-destructive">*</span>
                    </Label>
                    <Select value={casesWon} onValueChange={setCasesWon}>
                      <SelectTrigger id="lawyer-caseswon" className="min-h-11 w-full">
                        <div className="flex items-center gap-2">
                          <Award className="size-4 shrink-0 text-amber-500" />
                          <SelectValue placeholder="Select cases won" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {CASES_WON_OPTIONS.map((num) => (
                          <SelectItem key={num} value={num}>
                            {num} {Number(num) === 1 ? "Case Won" : "Cases Won"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: PRO BONO CATEGORIES & SERVICE PLEDGE */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink sm:text-xl">
                    Section 3 · Pro Bono Focus Categories &amp; Pledge
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Choose the advocacy categories where you accept pro bono case referrals and
                    confirm your service pledge.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {LEGAL_SPECIALTIES.map((spec) => {
                    const checked = selectedSpecialties.includes(spec);
                    return (
                      <button
                        type="button"
                        key={spec}
                        aria-pressed={checked}
                        onClick={() => toggleSpecialty(spec)}
                        className={cn(
                          "flex min-h-11 cursor-pointer items-start gap-2.5 rounded-md border p-3 text-left text-xs transition-all",
                          checked
                            ? "border-emerald-700 bg-emerald-50/80 text-ink"
                            : "border-hairline bg-surface/60 text-muted-foreground hover:border-emerald-300",
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border",
                            checked
                              ? "border-emerald-700 bg-emerald-700 text-white"
                              : "border-muted-foreground/40",
                          )}
                        >
                          {checked && <CheckCircle2 className="size-3" />}
                        </div>
                        <span className="leading-snug">{spec}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Compact Credential Summary */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-hairline bg-surface px-4 py-3 text-xs">
                  <div>
                    <span className="font-bold text-ink">{fullName}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {jurisdictionState} · Call {callToBarYear}
                    </span>
                  </div>
                  <span className="font-semibold text-emerald-800">{casesWon} cases won</span>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
                  <input
                    type="checkbox"
                    checked={pledgeConsent}
                    onChange={(e) => setPledgeConsent(e.target.checked)}
                    className="mt-0.5 size-4 cursor-pointer accent-emerald-700"
                  />
                  <span className="text-xs leading-relaxed font-medium text-ink">
                    <strong>Pledge of Service:</strong> I enroll as an honorary Pro Bono Legal
                    Counsel with Abba Roller Foundation to{" "}
                    <span className="font-bold text-emerald-800">
                      win cases for the less privileged
                    </span>{" "}
                    and defend indigent rights with utmost confidentiality and diligence.
                  </span>
                </label>
              </div>
            )}

            {/* Wizard Action Footer */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-hairline pt-5 sm:flex-row sm:items-center sm:justify-between">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setErrorMsg(null);
                    setStep((s) => (s === 3 ? 2 : 1));
                  }}
                  className="min-h-12 gap-2 font-semibold"
                >
                  <ArrowLeft className="size-4" />
                  <span>Previous Section</span>
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Dedicated to qualified legal practitioners
                </span>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={handleSaveAndContinue}
                  className="min-h-12 gap-2 bg-emerald-800 px-6 font-bold text-white hover:bg-emerald-900"
                >
                  <span>Save &amp; Continue</span>
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="min-h-12 gap-2 bg-emerald-800 px-6 font-bold text-white shadow-md hover:bg-emerald-900"
                >
                  <Scale className="size-4" />
                  <span>
                    {submitting
                      ? "Submitting Application..."
                      : "Submit Application for Bar Verification"}
                  </span>
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Application Confirmation Dialog Modal (Pending Bar Verification) */}
      <Dialog open={isSlipOpen} onOpenChange={setIsSlipOpen}>
        <DialogContent className="max-w-lg w-[95vw] p-6 md:p-8">
          <DialogHeader>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-700 uppercase">
              <Clock className="size-4" />
              <span>Pending Admin Bar Verification</span>
            </div>
            <DialogTitle className="font-display text-2xl font-bold text-ink">
              Pro Bono Application Submitted
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
              Thank you for volunteering your legal expertise. Your Bar Accreditation Slip is not
              generated at registration — it will unlock automatically after Admin verification of
              your credentials.
            </DialogDescription>
          </DialogHeader>

          {slipData && (
            <div className="mt-4 space-y-5">
              <div className="rounded-sm border border-amber-300 bg-amber-50 p-4 text-xs sm:text-sm text-amber-950 leading-relaxed">
                <strong>Next Step — Check &amp; Download Later:</strong> Return anytime to{" "}
                <Link to="/verify-id" className="font-bold text-green-deep underline">
                  Check &amp; Download ID
                </Link>{" "}
                and enter your registered phone number (
                <span className="font-mono font-semibold">{slipData.phone}</span>) to see when your
                Official Bar Accreditation Slip becomes available for download.
              </div>

              <div className="grid grid-cols-1 gap-3 rounded-sm border border-hairline bg-surface p-4 text-xs sm:grid-cols-2">
                <div>
                  <span className="block text-[10px] font-bold text-muted-foreground uppercase">
                    Reference ID
                  </span>
                  <span className="font-mono font-bold text-ink">{slipData.refNumber}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-muted-foreground uppercase">
                    Registered Phone (Lookup Key)
                  </span>
                  <span className="font-mono font-bold text-emerald-800">{slipData.phone}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-muted-foreground uppercase">
                    Counsel Name
                  </span>
                  <span className="font-semibold text-ink">{slipData.fullName}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-muted-foreground uppercase">
                    Jurisdiction &amp; Call Year
                  </span>
                  <span className="font-semibold text-ink">
                    {slipData.jurisdictionState || "Nigeria"} · {slipData.callToBarYear}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-11 flex-1 gap-2 bg-emerald-800 text-xs font-bold text-white hover:bg-emerald-900"
                >
                  <Link to="/verify-id" onClick={() => setIsSlipOpen(false)}>
                    <ShieldCheck className="size-4" />
                    <span>Check Status by Phone</span>
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSlipOpen(false)}
                  className="h-11 text-xs"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

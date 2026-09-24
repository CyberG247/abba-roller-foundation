import { useState } from "react";
import {
  Award,
  CheckCircle2,
  Download,
  FileCheck2,
  Gavel,
  GraduationCap,
  Mail,
  Phone,
  Scale,
  Shield,
  Sparkles,
  Building2,
  Calendar,
  AlertCircle,
  Share2,
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
import { Reveal } from "@/components/site/Reveal";
import { downloadLawyerSlip, LawyerSlipData } from "@/lib/generateLawyerSlip";
import { saveLawyerVolunteer } from "@/data/lawyersStore";
import { NIGERIAN_STATES } from "@/components/site/VolunteerSection";

// Generate years 2026 down to 1970 for Call to Bar
const CALL_TO_BAR_YEARS = Array.from({ length: 57 }, (_, i) => String(2026 - i));

// Cases won dropdown 1 to 100 as requested
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

export function LawyersVolunteerSection({ id = "lawyers-volunteer" }: { id?: string }) {
  // Form fields per user specification
  const [fullName, setFullName] = useState("");
  const [lawFirm, setLawFirm] = useState("");
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

  // Submission & Slip States
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [slipData, setSlipData] = useState<LawyerSlipData | null>(null);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!university.trim()) {
      setErrorMsg("Please provide the University/Faculty of Law you attended.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Please enter your phone number.");
      return;
    }
    if (!callToBarYear) {
      setErrorMsg("Please select the year you completed law school (Call to Bar).");
      return;
    }
    if (!casesWon) {
      setErrorMsg("Please select the number of cases won so far (1 - 100).");
      return;
    }
    if (!pledgeConsent) {
      setErrorMsg(
        "Please confirm your pledge to offer pro bono legal defense for indigent and underprivileged citizens.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const saved = saveLawyerVolunteer({
        fullName: fullName.trim(),
        lawFirm: lawFirm.trim() || undefined,
        email: email.trim(),
        university: university.trim(),
        phone: phone.trim(),
        callToBarYear,
        casesWon: parseInt(casesWon, 10),
        jurisdictionState,
        practiceAreas: selectedSpecialties,
      });

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
      toast.success("Enrolled successfully in the ARF Legal Defense Pro Bono Corps!");
    } catch {
      setErrorMsg("An unexpected error occurred while processing your enrollment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!slipData) return;
    setDownloading(true);
    try {
      await downloadLawyerSlip(slipData);
      toast.success("Official Pro Bono Lawyer Accreditation Slip downloaded!");
    } catch {
      toast.error("Failed to generate slip image. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id={id} className="py-16 md:py-24 bg-surface/50 border-t border-hairline relative">
      <div className="shell max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-800/60 shadow-sm">
              <Scale className="size-4 text-emerald-400" />
              <span>Pro Bono Legal Defense Corps</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-black text-ink tracking-tight">
              Lawyers Volunteer Section
            </h2>
            <p className="mt-3 text-lg md:text-xl font-medium text-emerald-700 dark:text-emerald-400 italic">
              “Win a case for the less privileged.”
            </p>
            <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Too many indigent individuals languish in pretrial detention or face injustice simply
              because they cannot afford counsel. Join our legal advocacy vanguard to represent the
              vulnerable and protect constitutional rights.
            </p>
          </Reveal>
        </div>

        {/* Feature Cards / Value Pillars for Advocates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Reveal
            delay={40}
            className="p-5 rounded-lg bg-background border border-hairline shadow-2xs"
          >
            <div className="size-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Gavel className="size-5" />
            </div>
            <h3 className="font-display text-base font-bold text-ink">
              Indigent Court Representation
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Step into courtrooms across Northern Nigeria to defend vulnerable youths, disabled
              citizens, and low-income families without voice or means.
            </p>
          </Reveal>

          <Reveal
            delay={80}
            className="p-5 rounded-lg bg-background border border-hairline shadow-2xs"
          >
            <div className="size-10 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
              <Shield className="size-5" />
            </div>
            <h3 className="font-display text-base font-bold text-ink">
              Prison Decongestion & Bail
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Expedite bail applications and review cases of persons held indefinitely on minor or
              unsubstantiated infractions.
            </p>
          </Reveal>

          <Reveal
            delay={120}
            className="p-5 rounded-lg bg-background border border-hairline shadow-2xs"
          >
            <div className="size-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Award className="size-5" />
            </div>
            <h3 className="font-display text-base font-bold text-ink">
              Official ARF Bar Credential
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Receive verified Pro Bono Advocate Accreditation, public commendation, and an official
              downloadable credentials slip.
            </p>
          </Reveal>
        </div>

        {/* Main Lawyers Intake Form */}
        <div className="bg-background rounded-xl border border-hairline shadow-md p-6 md:p-10 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
            <div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-ink flex items-center gap-2">
                <Scale className="size-6 text-emerald-600 dark:text-emerald-400" />
                Legal Practitioner Enrollment Form
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Win a case for the less privileged. Dedicated strictly for qualified legal
                practitioners.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <Sparkles className="size-3.5" />
              <span>Instant Bar Slip Generation</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-6 p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
              <AlertCircle className="size-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Row 1: Full Name & Law Firm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="lawyer-fullname"
                  className="text-xs font-bold uppercase tracking-wider text-ink"
                >
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lawyer-fullname"
                  type="text"
                  placeholder="e.g. Barr. Aminu Kabir Dutse"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-11"
                />
                <span className="text-[11px] text-muted-foreground">
                  Include title (e.g. Barr., Esq., SAN if applicable)
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="lawyer-firm"
                    className="text-xs font-bold uppercase tracking-wider text-ink"
                  >
                    Law Firm{" "}
                    <span className="text-muted-foreground font-normal lowercase">(optional)</span>
                  </Label>
                </div>
                <div className="relative">
                  <Building2 className="size-4 text-muted-foreground absolute left-3 top-3.5" />
                  <Input
                    id="lawyer-firm"
                    type="text"
                    placeholder="e.g. Dutse Chambers & Associates / Solo Practitioner"
                    value={lawFirm}
                    onChange={(e) => setLawFirm(e.target.value)}
                    className="h-11 pl-9"
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Leave blank if operating as an independent counsel
                </span>
              </div>
            </div>

            {/* Row 2: Email & Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="lawyer-email"
                  className="text-xs font-bold uppercase tracking-wider text-ink"
                >
                  Email <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="size-4 text-muted-foreground absolute left-3 top-3.5" />
                  <Input
                    id="lawyer-email"
                    type="email"
                    placeholder="counsel@legalchambers.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lawyer-phone"
                  className="text-xs font-bold uppercase tracking-wider text-ink"
                >
                  Phone No <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="size-4 text-muted-foreground absolute left-3 top-3.5" />
                  <Input
                    id="lawyer-phone"
                    type="tel"
                    placeholder="+234 803 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-11 pl-9"
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Accessible for swift urgent bail and hearing notifications
                </span>
              </div>
            </div>

            {/* Row 3: University (LL.B) */}
            <div className="space-y-2">
              <Label
                htmlFor="lawyer-university"
                className="text-xs font-bold uppercase tracking-wider text-ink"
              >
                University (Faculty of Law / LL.B) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <GraduationCap className="size-4 text-muted-foreground absolute left-3 top-3.5" />
                <Input
                  id="lawyer-university"
                  type="text"
                  placeholder="e.g. Ahmadu Bello University (ABU) Zaria / Bayero University Kano (BUK)"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  required
                  className="h-11 pl-9"
                />
              </div>
            </div>

            {/* Row 4: Year Completed Law School (Call to Bar) & Cases Won So Far (1-100) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="lawyer-calltobar"
                  className="text-xs font-bold uppercase tracking-wider text-ink"
                >
                  Year Completed Law School (Call to Bar){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Select value={callToBarYear} onValueChange={setCallToBarYear}>
                    <SelectTrigger id="lawyer-calltobar" className="h-11 w-full">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground shrink-0" />
                        <SelectValue placeholder="Select Call to Bar Year" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {CALL_TO_BAR_YEARS.map((yr) => (
                        <SelectItem key={yr} value={yr}>
                          {yr} {yr === "2026" ? "(Latest Call)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Year of formal induction into the Nigerian Bar
                </span>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lawyer-caseswon"
                  className="text-xs font-bold uppercase tracking-wider text-ink"
                >
                  Cases Won So Far <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Select value={casesWon} onValueChange={setCasesWon}>
                    <SelectTrigger id="lawyer-caseswon" className="h-11 w-full">
                      <div className="flex items-center gap-2">
                        <Award className="size-4 text-amber-500 shrink-0" />
                        <SelectValue placeholder="Select cases won (1 - 100)" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {CASES_WON_OPTIONS.map((num) => (
                        <SelectItem key={num} value={num}>
                          {num} {Number(num) === 1 ? "Case Won" : "Cases Won"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Dropdown from 1 to 100 cases won in superior or subordinate courts
                </span>
              </div>
            </div>

            {/* Row 5: Primary Jurisdiction State */}
            <div className="space-y-2">
              <Label
                htmlFor="lawyer-jurisdiction"
                className="text-xs font-bold uppercase tracking-wider text-ink"
              >
                Primary Court Jurisdiction / State of Practice
              </Label>
              <Select value={jurisdictionState} onValueChange={setJurisdictionState}>
                <SelectTrigger id="lawyer-jurisdiction" className="h-11 w-full">
                  <SelectValue placeholder="Select Primary State" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {NIGERIAN_STATES.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-[11px] text-muted-foreground">
                State where you are most readily available to attend court sittings
              </span>
            </div>

            {/* Specialization Tags */}
            <div className="space-y-3 pt-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-ink block">
                Preferred Pro Bono Advocacy Focus Areas
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LEGAL_SPECIALTIES.map((spec) => {
                  const checked = selectedSpecialties.includes(spec);
                  return (
                    <button
                      type="button"
                      key={spec}
                      onClick={() => toggleSpecialty(spec)}
                      className={`text-left text-xs p-3 rounded-md border transition-all flex items-start gap-2.5 ${
                        checked
                          ? "bg-emerald-50/80 border-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-500 text-ink"
                          : "bg-surface/60 border-hairline hover:border-emerald-300 text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`size-4 rounded-sm mt-0.5 border flex items-center justify-center shrink-0 ${
                          checked
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {checked && <CheckCircle2 className="size-3" />}
                      </div>
                      <span className="leading-snug">{spec}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Commitment Pledge */}
            <div className="p-4 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pledgeConsent}
                  onChange={(e) => setPledgeConsent(e.target.checked)}
                  className="size-4.5 mt-0.5 accent-emerald-600 rounded cursor-pointer"
                />
                <span className="text-xs text-ink leading-relaxed font-medium">
                  <strong>Pledge of Service:</strong> I hereby enroll as an honorary Pro Bono Legal
                  Counsel with the Abba Roller Foundation. I agree to dedicate my professional
                  skills to{" "}
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    win cases for the less privileged
                  </span>
                  , defend fundamental human rights, and treat every indigent client with dignifying
                  confidentiality and utmost diligence.
                </span>
              </label>
            </div>

            {/* Submit CTA Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Scale className="size-4" />
                <span>
                  {submitting
                    ? "Enrolling Legal Counsel..."
                    : "Enroll as Pro Bono Advocate & Generate Slip"}
                </span>
              </Button>
              <p className="text-[11px] text-center text-muted-foreground mt-2">
                Verified enrollment triggers an instant, high-resolution official ARF Pro Bono Bar
                Slip.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Slip Presentation Dialog Modal */}
      <Dialog open={isSlipOpen} onOpenChange={setIsSlipOpen}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-6 md:p-8">
          <DialogHeader>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs tracking-wider uppercase">
              <CheckCircle2 className="size-4" />
              <span>Enrollment Verified</span>
            </div>
            <DialogTitle className="font-display text-2xl font-bold text-ink">
              Official Pro Bono Lawyer Accreditation Slip
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Thank you for standing up for the less privileged. Your official ARF Legal Corps
              registration is ready for instant download and verification.
            </DialogDescription>
          </DialogHeader>

          {slipData && (
            <div className="mt-4 space-y-6">
              {/* Slip Card Preview */}
              <div className="p-6 rounded-lg bg-surface border-2 border-emerald-700/40 relative overflow-hidden shadow-inner">
                {/* Header ribbon */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-hairline gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                      Federal Republic of Nigeria • ARF Legal Corps
                    </span>
                    <h4 className="font-display text-lg font-bold text-ink">{slipData.fullName}</h4>
                    <p className="text-xs text-muted-foreground">
                      {slipData.lawFirm || "Independent Legal Practitioner"}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-muted-foreground uppercase block">
                      Advocate Bar ID
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-background border border-hairline text-emerald-800 dark:text-emerald-300">
                      {slipData.refNumber}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                      Call to Bar Year
                    </span>
                    <span className="font-bold text-ink">{slipData.callToBarYear}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                      Cases Won
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {slipData.casesWon} {Number(slipData.casesWon) === 1 ? "Case" : "Cases"} Won
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                      Jurisdiction
                    </span>
                    <span className="font-bold text-ink">
                      {slipData.jurisdictionState || "Nigeria"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                      University (LL.B)
                    </span>
                    <span className="font-medium text-ink truncate block">
                      {slipData.university}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                      Enrollment Date
                    </span>
                    <span className="font-medium text-ink">{slipData.submissionDate}</span>
                  </div>
                </div>

                {/* Motto Stamp */}
                <div className="mt-3 pt-3 border-t border-hairline flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="italic font-medium text-emerald-800 dark:text-emerald-400">
                    “Win a case for the less privileged”
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-600">
                    ⚖️ Pro Bono Certified
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex-1 h-11 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs gap-2"
                >
                  <Download className="size-4" />
                  <span>
                    {downloading ? "Generating Slip..." : "Download Official Bar Slip (PNG)"}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsSlipOpen(false)}
                  className="h-11 text-xs"
                >
                  Close Window
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

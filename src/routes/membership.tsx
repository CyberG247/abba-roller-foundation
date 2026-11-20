import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  Building,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  UploadCloud,
  User,
  Users,
  X,
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
import { saveMemberToStorage, type Member, type MembershipTier } from "@/data/membershipStore";
import { ALL_STATES, getLgasForState } from "@/data/nigeriaStatesLgas";
import { CredentialLookupWidget } from "@/components/site/CredentialLookupWidget";
import { cn, compressPassportPhoto } from "@/lib/utils";

const title = "Become a Member — Abba Roller Foundation";
const description =
  "Register as an official citizen member of Abba Roller Foundation across all 36 states and FCT Abuja, and download your digital membership ID card.";

export const Route = createFileRoute("/membership")({
  validateSearch: (search: Record<string, unknown>): { state?: string | undefined } => ({
    state: typeof search["state"] === "string" ? search["state"] : undefined,
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: MembershipPage,
});

const DRAFT_STORAGE_KEY = "arf_membership_draft_v1";

const TIERS: {
  name: MembershipTier;
  badge: string;
  badgeColor: string;
  desc: string;
}[] = [
  {
    name: "Standard Member",
    badge: "Free · Grassroots",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
    desc: "Citizens championing social welfare, community unity & local mobilization.",
  },
  {
    name: "Youth Ambassador",
    badge: "Youth Leadership",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    desc: "Young leaders driving sports leagues, mentorship & peace outreach.",
  },
  {
    name: "Volunteer Corps",
    badge: "Field Operations",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    desc: "Hands-on volunteers executing food aid & special-education relief.",
  },
  {
    name: "Executive Supporter",
    badge: "Advisory & Mentorship",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
    desc: "Professionals and diaspora citizens providing technical & policy backing.",
  },
  {
    name: "Patron",
    badge: "Philanthropic Pillar",
    badgeColor: "bg-brand-red-wash text-brand-red border-brand-red/30",
    desc: "Distinguished sponsors sustaining multi-state humanitarian programs.",
  },
];

const STEPS = [
  { id: 1 as const, label: "Personal Details" },
  { id: 2 as const, label: "Chapter & Photo" },
  { id: 3 as const, label: "Category & Submit" },
];

type WizardStep = 1 | 2 | 3;

function MembershipPage() {
  const { state: preselectedState } = Route.useSearch();
  const validPreselectedState =
    preselectedState && ALL_STATES.includes(preselectedState) ? preselectedState : "";

  const [step, setStep] = useState<WizardStep>(1);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedState, setSelectedState] = useState(validPreselectedState);
  const [selectedLga, setSelectedLga] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [tier, setTier] = useState<MembershipTier>("Standard Member");
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [registeredMember, setRegisteredMember] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeView, setActiveView] = useState<"register" | "lookup">("register");
  const [lookupPhoneSeed, setLookupPhoneSeed] = useState("");

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore saved section draft on mount if present
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Partial<{
        fullName: string;
        email: string;
        phone: string;
        selectedState: string;
        selectedLga: string;
        gender: string;
        occupation: string;
        tier: MembershipTier;
      }>;
      if (draft.fullName) setFullName(draft.fullName);
      if (draft.email) setEmail(draft.email);
      if (draft.phone) setPhone(draft.phone);
      if (
        !validPreselectedState &&
        draft.selectedState &&
        ALL_STATES.includes(draft.selectedState)
      ) {
        setSelectedState(draft.selectedState);
      }
      if (draft.selectedLga) setSelectedLga(draft.selectedLga);
      if (draft.gender) setGender(draft.gender);
      if (draft.occupation) setOccupation(draft.occupation);
      if (draft.tier) setTier(draft.tier);
    } catch {
      // ignore corrupted draft
    }
  }, [validPreselectedState]);

  useEffect(() => {
    if (preselectedState && ALL_STATES.includes(preselectedState)) {
      setSelectedState(preselectedState);
      setSelectedLga("");
    }
  }, [preselectedState]);

  const persistSectionDraft = () => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({
          fullName,
          email,
          phone,
          selectedState,
          selectedLga,
          gender,
          occupation,
          tier,
        }),
      );
      setDraftSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch {
      // ignore storage failure
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size is too large. Please select an image under 5MB.");
      return;
    }

    try {
      const compressed = await compressPassportPhoto(file);
      setPhotoPreview(compressed);
    } catch {
      toast.error("Could not process image. Please choose a valid PNG or JPG photo.");
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const availableLgas = selectedState ? getLgasForState(selectedState) : [];

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedLga("");
  };

  const handleSaveAndContinue = () => {
    if (step === 1) {
      if (!fullName.trim()) {
        toast.error("Please enter your full name (first name and surname).");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        toast.error("Please enter a valid email address.");
        return;
      }
      persistSectionDraft();
      if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
        toast.error(
          "Please enter an active Nigerian phone number (at least 10 digits) so you can check and download your ID Card after verification.",
        );
        return;
      }
      setStep(2);
      toast.success("Personal details saved. Next: select your chapter state & LGA.");
      return;
    }

    if (step === 2) {
      if (!selectedState) {
        toast.error("Please select your State of Residence.");
        return;
      }
      if (!selectedLga) {
        toast.error("Please select your Local Government Area (LGA).");
        return;
      }
      persistSectionDraft();
      setStep(3);
      toast.success("Chapter location saved. Select your membership category to finish.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      handleSaveAndContinue();
      return;
    }

    if (!fullName.trim() || !email.trim() || !selectedState || !selectedLga) {
      toast.error("Please complete required identity and location details.");
      return;
    }
    if (!acceptTerms) {
      toast.error("Please accept the ARF Member Code of Conduct.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newMember = saveMemberToStorage({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        state: selectedState,
        lga: selectedLga,
        gender: (gender as Member["gender"]) || undefined,
        occupation: occupation.trim() || undefined,
        tier,
        photoUrl: photoPreview || undefined,
      });

      if (typeof window !== "undefined") {
        sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      }

      setRegisteredMember(newMember);
      setLookupPhoneSeed(phone.trim());
      toast.success("Application Received — Pending Admin Verification", {
        description: `Ref ${newMember.id}. Once verified, enter ${phone.trim()} on Verify ID to download your ID Card.`,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForNextMember = () => {
    setRegisteredMember(null);
    setStep(1);
    setFullName("");
    setEmail("");
    setPhone("");
    setSelectedLga("");
    setGender("");
    setOccupation("");
    setPhotoPreview(null);
    setDraftSavedAt(null);
  };

  return (
    <div className="min-h-screen bg-background text-ink">
      {/* Compact Institutional Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-deep via-green-deep to-slate-950 pt-26 pb-10 text-white md:pt-32 md:pb-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-brand-red/15 blur-3xl"
        />
        <div className="shell relative max-w-4xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-md">
                <Users className="size-3.5" />
                <span>National Citizen Registry · 36 States + FCT</span>
              </div>
              <h1 className="display-2 mt-3 text-white">
                Become a Registered <span className="text-amber-400">ARF Member</span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-200">
                Complete our 3-step citizen onboarding to submit your application for Admin
                verification. Once approved, use your registered phone number to download your
                official Digital ID Card.
              </p>
            </div>

            <Link
              to="/chapters"
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-sm border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-white/20"
            >
              <MapPin className="size-3.5 text-amber-300" />
              <span>Regional Chapters</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Focused Single-Page Application Container */}
      <div className="shell max-w-3xl py-10 md:py-14">
        {/* Mode Switcher: New Application vs Phone Lookup */}
        <div
          className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-md border border-hairline bg-surface p-1.5 shadow-xs"
          role="tablist"
          aria-label="Membership actions"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "register"}
            onClick={() => setActiveView("register")}
            className={cn(
              "min-h-11 rounded-sm px-4 py-2 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer",
              activeView === "register"
                ? "bg-green-deep text-white shadow-xs"
                : "text-muted-foreground hover:text-ink hover:bg-background",
            )}
          >
            <Users className="size-4" />
            <span>New Member Registration</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "lookup"}
            onClick={() => setActiveView("lookup")}
            className={cn(
              "min-h-11 rounded-sm px-4 py-2 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer",
              activeView === "lookup"
                ? "bg-green-deep text-white shadow-xs"
                : "text-muted-foreground hover:text-ink hover:bg-background",
            )}
          >
            <Search className="size-4" />
            <span>Check Status &amp; Download ID by Phone</span>
          </button>
        </div>

        {activeView === "lookup" ? (
          <CredentialLookupWidget defaultFilter="member" initialPhone={lookupPhoneSeed} />
        ) : registeredMember ? (
          /* ===================================================================== */
          /* APPLICATION CONFIRMATION — PENDING ADMIN VERIFICATION                 */
          /* ===================================================================== */
          <div className="rounded-md border border-hairline bg-surface p-6 text-center shadow-lift sm:p-10">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-amber-300 bg-amber-50 text-amber-700">
              <Clock className="size-7" />
            </div>

            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
              <Clock className="size-3.5" />
              Pending Admin Verification
            </span>
            <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
              Membership Application Received
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-ink-soft leading-relaxed">
              Thank you, <strong>{registeredMember.fullName}</strong>. Your application has been
              submitted to the {registeredMember.state} Chapter registry for Admin review. Your
              Digital Membership ID Card is not issued immediately upon submission.
            </p>

            {/* Reference Summary (NO ID Card / Download) */}
            <div className="mt-7 grid gap-3 text-left text-xs sm:grid-cols-2">
              <div className="rounded-sm border border-hairline bg-background p-4">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Application Reference ID
                </span>
                <span className="mt-1 block font-mono text-sm font-bold text-ink">
                  {registeredMember.id}
                </span>
              </div>
              <div className="rounded-sm border border-hairline bg-background p-4">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Registered Phone (Lookup Key)
                </span>
                <span className="mt-1 block font-mono text-sm font-bold text-green-deep">
                  {registeredMember.phone}
                </span>
              </div>
              <div className="rounded-sm border border-hairline bg-background p-4">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  State &amp; LGA Chapter
                </span>
                <span className="mt-1 block font-semibold text-ink">
                  {registeredMember.lga} LGA, {registeredMember.state}
                </span>
              </div>
              <div className="rounded-sm border border-hairline bg-background p-4">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Applied Tier &amp; Status
                </span>
                <span className="mt-1 block font-semibold text-amber-800">
                  {registeredMember.tier} · Pending Approval
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-sm border border-amber-300/80 bg-amber-50/70 p-4 text-left text-xs sm:text-sm text-amber-950 leading-relaxed">
              <strong>How to retrieve your ID Card:</strong> Once an ARF Administrator verifies your
              membership, return here or open{" "}
              <Link to="/verify-id" className="font-bold text-green-deep underline">
                Check &amp; Download ID
              </Link>{" "}
              and enter your registered phone number (
              <span className="font-mono font-semibold">{registeredMember.phone}</span>) to unlock
              and download your official ID Card.
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  setLookupPhoneSeed(registeredMember.phone ?? "");
                  setActiveView("lookup");
                }}
                className="min-h-12 w-full gap-2 bg-green-deep font-bold text-white shadow-md hover:bg-green-mid sm:w-auto"
              >
                <Search className="size-4" />
                <span>Check ID Status with {registeredMember.phone}</span>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-h-12 w-full gap-2 sm:w-auto"
              >
                <Link to="/verify-id">
                  <ShieldCheck className="size-4" />
                  <span>Open Verify ID Portal</span>
                </Link>
              </Button>
            </div>

            <div className="mt-6 border-t border-hairline pt-5 text-center">
              <button
                type="button"
                onClick={resetForNextMember}
                className="cursor-pointer text-xs font-semibold text-muted-foreground underline hover:text-ink"
              >
                Register another member
              </button>
            </div>
          </div>
        ) : (
          /* ===================================================================== */
          /* STREAMLINED 3-STEP WIZARD APPLICATION CARD                            */
          /* ===================================================================== */
          <div className="space-y-6">
            <div className="overflow-hidden rounded-lg border border-hairline bg-surface shadow-lift">
              {/* Interactive 3-Step Header */}
              <div className="border-b border-hairline bg-background px-5 py-4 sm:px-8">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
                  <span className="text-xs font-bold tracking-wider text-green-deep uppercase">
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
                  {STEPS.map((item) => {
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
                              ? "border-green-deep bg-green-wash/60 text-green-deep"
                              : isCompleted
                                ? "cursor-pointer border-emerald-200 bg-emerald-50/40 text-emerald-800 hover:bg-emerald-50"
                                : "cursor-default border-hairline bg-surface text-muted-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                              isCurrent
                                ? "bg-green-deep text-white"
                                : isCompleted
                                  ? "bg-emerald-700 text-white"
                                  : "bg-background text-muted-foreground border border-hairline",
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

              {/* Active Section Form Body */}
              <form onSubmit={handleSubmit} className="p-5 sm:p-8">
                {/* SECTION 1: PERSONAL DETAILS */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="font-display text-xl font-bold text-ink">
                        Section 1 · Personal &amp; Contact Information
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Enter your legal name and reachable contact details for official member
                        verification.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label
                          htmlFor="fullName"
                          className="flex items-center gap-1.5 text-xs font-bold"
                        >
                          <User className="size-3.5 text-green-deep" />
                          <span>Full Name (First Name &amp; Surname)</span>
                          <span className="text-brand-red">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          placeholder="e.g. Usman Aminu Gumel"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="min-h-11 bg-background"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="email"
                          className="flex items-center gap-1.5 text-xs font-bold"
                        >
                          <Mail className="size-3.5 text-green-deep" />
                          <span>Email Address</span>
                          <span className="text-brand-red">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="min-h-11 bg-background"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="phone"
                          className="flex items-center gap-1.5 text-xs font-bold"
                        >
                          <Phone className="size-3.5 text-green-deep" />
                          <span>Phone Number (WhatsApp)</span>
                          <span className="text-brand-red">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="e.g. 0803 123 4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="min-h-11 bg-background"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Used later to check verification status and download your ID Card.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="occupation"
                          className="flex items-center gap-1.5 text-xs font-bold"
                        >
                          <Briefcase className="size-3.5 text-ink-soft" />
                          <span>Occupation / Vocation (Optional)</span>
                        </Label>
                        <Input
                          id="occupation"
                          placeholder="e.g. Teacher, Entrepreneur, Student"
                          value={occupation}
                          onChange={(e) => setOccupation(e.target.value)}
                          className="min-h-11 bg-background"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="gender" className="text-xs font-bold">
                          Gender (Optional)
                        </Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger id="gender" className="min-h-11 w-full bg-background">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 2: CHAPTER LOCATION & PHOTOGRAPH */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="font-display text-xl font-bold text-ink">
                        Section 2 · State Chapter &amp; ID Photograph
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Map your registration to your State &amp; Local Government Area and attach
                        an optional headshot for your official card.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="state"
                          className="flex items-center gap-1.5 text-xs font-bold"
                        >
                          <MapPin className="size-3.5 text-brand-red" />
                          <span>State of Residence</span>
                          <span className="text-brand-red">*</span>
                        </Label>
                        <Select value={selectedState} onValueChange={handleStateChange}>
                          <SelectTrigger id="state" className="min-h-11 w-full bg-background">
                            <SelectValue placeholder="Select Nigerian State" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {ALL_STATES.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="lga"
                          className="flex items-center gap-1.5 text-xs font-bold"
                        >
                          <Building className="size-3.5 text-brand-red" />
                          <span>Local Government Area (LGA)</span>
                          <span className="text-brand-red">*</span>
                        </Label>
                        <Select
                          value={selectedLga}
                          onValueChange={setSelectedLga}
                          disabled={!selectedState || availableLgas.length === 0}
                        >
                          <SelectTrigger id="lga" className="min-h-11 w-full bg-background">
                            <SelectValue
                              placeholder={selectedState ? "Select LGA" : "Choose state first"}
                            />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {availableLgas.map((lga) => (
                              <SelectItem key={lga} value={lga}>
                                {lga}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Compact Photo Upload Strip */}
                    <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-amber-400/50 bg-background p-4 sm:flex-row">
                      <div className="relative flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-amber-500/40 bg-surface">
                        {photoPreview ? (
                          <>
                            <img
                              src={photoPreview}
                              alt="Passport preview"
                              className="size-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={removePhoto}
                              className="absolute top-0.5 right-0.5 flex size-5 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-destructive"
                              title="Remove photo"
                            >
                              <X className="size-3" />
                            </button>
                          </>
                        ) : (
                          <Camera className="size-6 text-muted-foreground/60" />
                        )}
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <p className="text-xs font-bold text-ink">
                          Passport Photograph (Optional — Embedded on Digital ID)
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Clean portrait (PNG or JPG under 5MB). Auto-optimized for instant
                          download.
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/jpg"
                          onChange={handlePhotoChange}
                          className="hidden"
                          id="member-photo-input"
                        />
                        <div className="mt-2.5 flex flex-wrap justify-center gap-2 sm:justify-start">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="min-h-9 gap-1.5 text-xs"
                          >
                            <UploadCloud className="size-3.5" />
                            <span>{photoPreview ? "Change Photo" : "Select Photograph"}</span>
                          </Button>
                          {photoPreview && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removePhoto}
                              className="min-h-9 text-xs text-destructive"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 3: MEMBERSHIP CATEGORY & CONFIRMATION */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="font-display text-xl font-bold text-ink">
                        Section 3 · Membership Category &amp; Submission
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Select your participation tier and confirm your citizen code-of-conduct
                        pledge.
                      </p>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {TIERS.map((t) => {
                        const selected = tier === t.name;
                        return (
                          <label
                            key={t.name}
                            className={cn(
                              "flex cursor-pointer items-start gap-2.5 rounded-sm border p-3.5 transition-all",
                              selected
                                ? "border-green-deep bg-green-wash/50 ring-1 ring-green-deep"
                                : "border-hairline bg-background hover:border-ink-soft/40",
                            )}
                          >
                            <input
                              type="radio"
                              name="tier"
                              value={t.name}
                              checked={selected}
                              onChange={() => setTier(t.name)}
                              className="mt-1 accent-green-deep"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-1.5">
                                <span className="text-xs font-bold text-ink sm:text-sm">
                                  {t.name}
                                </span>
                                <span
                                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${t.badgeColor}`}
                                >
                                  {t.badge}
                                </span>
                              </div>
                              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                                {t.desc}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {/* Compact Pre-Submit Summary */}
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-hairline bg-background px-4 py-3 text-xs">
                      <div>
                        <span className="font-bold text-ink">{fullName}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          · {selectedLga}, {selectedState}
                        </span>
                      </div>
                      <span className="font-semibold text-green-deep">{tier}</span>
                    </div>

                    <label className="flex cursor-pointer items-start gap-2.5 rounded-sm border border-hairline bg-background p-3.5">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-0.5 accent-green-deep"
                      />
                      <span className="text-xs leading-relaxed text-ink-soft">
                        I declare that the information provided is accurate and agree to uphold Abba
                        Roller Foundation&apos;s values of unity, integrity, and humanitarian
                        service across Nigeria.
                      </span>
                    </label>
                  </div>
                )}

                {/* Bottom Action Footer Bar */}
                <div className="mt-7 flex flex-col-reverse gap-3 border-t border-hairline pt-5 sm:flex-row sm:items-center sm:justify-between">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
                      className="min-h-12 gap-2 font-semibold"
                    >
                      <ArrowLeft className="size-4" />
                      <span>Previous Section</span>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Zero registration fee · ID Card unlocked after Admin verification
                    </span>
                  )}

                  {step < 3 ? (
                    <Button
                      type="button"
                      size="lg"
                      onClick={handleSaveAndContinue}
                      className="min-h-12 gap-2 bg-green-deep px-6 font-bold text-white shadow-sm hover:bg-green-mid"
                    >
                      <span>Save &amp; Continue</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="give"
                      size="lg"
                      disabled={isSubmitting}
                      className="min-h-12 gap-2 px-6 font-bold shadow-lift"
                    >
                      <ShieldCheck className="size-4.5" />
                      <span>
                        {isSubmitting
                          ? "Submitting Application..."
                          : "Submit Registration for Verification"}
                      </span>
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Compact 3-Column Trust Strip Below Card */}
            <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
              <Link
                to="/verify-id"
                className="flex items-center gap-2.5 rounded-sm border border-hairline bg-surface px-4 py-3 font-medium text-ink hover:border-green-deep/40"
              >
                <ShieldCheck className="size-4 shrink-0 text-green-deep" />
                <span>Check &amp; Download Verified ID</span>
              </Link>
              <div className="flex items-center gap-2.5 rounded-sm border border-hairline bg-surface px-4 py-3">
                <CheckCircle2 className="size-4 shrink-0 text-green-deep" />
                <span>Mapped to all 774 LGAs Nationwide</span>
              </div>
              <Link
                to="/admin"
                className="flex items-center justify-between rounded-sm border border-hairline bg-surface px-4 py-3 font-semibold text-green-deep hover:border-green-deep/40"
              >
                <span>Coordinator Registry Console</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

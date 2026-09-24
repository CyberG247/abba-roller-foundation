import { useState, useId, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  CheckCircle2,
  ShieldCheck,
  Award,
  Download,
  Printer,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  User,
  Briefcase,
  IdCard,
  Building,
  Heart,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Camera,
  UploadCloud,
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
import { Reveal } from "@/components/site/Reveal";
import { ALL_STATES, getLgasForState } from "@/data/nigeriaStatesLgas";
import { saveMemberToStorage, type Member, type MembershipTier } from "@/data/membershipStore";
import { downloadMembershipCard } from "@/lib/generateMembershipSlip";
import arfLogo from "@/assets/arf-logo-official.png";

export const Route = createFileRoute("/membership")({
  component: MembershipPage,
});

const TIERS: {
  name: MembershipTier;
  badge: string;
  badgeColor: string;
  desc: string;
  benefits: string[];
}[] = [
  {
    name: "Standard Member",
    badge: "Free · Grassroots",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
    desc: "Citizens dedicated to promoting social welfare, community unity, and good governance across Nigeria.",
    benefits: [
      "Official ARF Membership ID Card & Number",
      "Inclusion in LGA grassroots communications",
      "Voting rights at general foundation town halls",
    ],
  },
  {
    name: "Youth Ambassador",
    badge: "Youth Leadership",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    desc: "Dynamic young leaders championing youth development, athletic sports leagues, and peace initiatives.",
    benefits: [
      "Ambassadorial identification & badge",
      "Youth tournament & mentorship leadership",
      "ARF branded cap & promotional materials",
    ],
  },
  {
    name: "Volunteer Corps",
    badge: "Field Operations",
    badgeColor: "bg-green-100 text-green-800 border-green-300",
    desc: "Hands-on volunteers executing weekly meals distribution, special education relief, and field outreaches.",
    benefits: [
      "Direct deployment in humanitarian missions",
      "Field duty acknowledgement certificate",
      "Community welfare leadership experience",
    ],
  },
  {
    name: "Executive Supporter",
    badge: "Professional Mentorship",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    desc: "Professionals, civil servants, and diaspora members contributing advisory and technical capacity.",
    benefits: [
      "Strategic advisory committee access",
      "Direct briefings from Foundation Executive Board",
      "High-level networking with civic partners",
    ],
  },
  {
    name: "Patron",
    badge: "Philanthropic Pillar",
    badgeColor: "bg-brand-red-wash text-brand-red border-brand-red/30",
    desc: "Distinguished patrons providing sustainable financial sponsorship to scale humanitarian impacts.",
    benefits: [
      "Permanent recognition in Annual Impact Report",
      "VIP invitation to Annual Foundation Gala & Tourneys",
      "Personal consultation with Founder Hon. Usman Aminu Usman",
    ],
  },
];

function MembershipPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedLga, setSelectedLga] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [tier, setTier] = useState<MembershipTier>("Standard Member");
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [registeredMember, setRegisteredMember] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Passport Photograph State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size is too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
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
    setSelectedLga(""); // Reset LGA when state changes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your full name (first name and surname).");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!selectedState) {
      toast.error("Please select your State of Residence.");
      return;
    }
    if (!selectedLga) {
      toast.error("Please select your Local Government Area (LGA).");
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
        phone: phone.trim() || undefined,
        state: selectedState,
        lga: selectedLga,
        gender: (gender as Member["gender"]) || undefined,
        occupation: occupation.trim() || undefined,
        tier,
        photoUrl: photoPreview || undefined,
      });

      setRegisteredMember(newMember);
      toast.success("Membership Registration Successful!", {
        description: `Welcome to ARF Foundation! Your ID is ${newMember.id}`,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Failed to complete registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCard = async () => {
    if (!registeredMember) return;
    setIsDownloading(true);
    try {
      await downloadMembershipCard(registeredMember);
      toast.success("Official Membership Card downloaded successfully!");
    } catch {
      toast.error("Unable to generate ID Card. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-background text-ink min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-deep via-green-deep to-slate-950 text-white py-16 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-brand-red/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl"
        />

        <div className="shell relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md border border-white/15">
              <Users className="size-3.5" />
              <span>National Citizen Registry · All 36 States + FCT</span>
            </div>
            <h1 className="display-1 mt-4 text-white">
              Become a Registered <span className="text-amber-400">ARF Member</span>
            </h1>
            <p className="lede mt-4 text-slate-200">
              Join thousands of dedicated citizens driving education for vulnerable children,
              grassroots sports development, food sustenance, and youth empowerment. Register today
              to receive your official Membership ID and digital membership card.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-amber-400" />
                <span>Zero Registration Fee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-amber-400" />
                <span>Instant Digital ID Card</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-amber-400" />
                <span>State &amp; LGA Community Mapping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="shell py-12 md:py-20">
        {registeredMember ? (
          /* ========================================================================= */
          /* REGISTRATION SUCCESS VIEW WITH DIGITAL MEMBERSHIP CARD                    */
          /* ========================================================================= */
          <div className="max-w-3xl mx-auto">
            <div className="rounded-md border-2 border-green-deep/30 bg-surface p-6 sm:p-10 shadow-lift text-center">
              <div className="size-16 rounded-full bg-green-wash text-green-deep flex items-center justify-center mx-auto mb-4 border border-green-deep/20">
                <ShieldCheck className="size-8" />
              </div>

              <span className="inline-block rounded-full bg-green-wash px-3 py-1 text-xs font-bold text-green-deep mb-2">
                Registration Confirmed &amp; Verified
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
                Welcome to the Abba Roller Foundation!
              </h2>
              <p className="text-sm text-ink-soft mt-2 max-w-lg mx-auto">
                Congratulations, <strong>{registeredMember.fullName}</strong>. You are officially
                enrolled in the ARF National Citizen Database. Your official membership identity has
                been recorded and assigned.
              </p>

              {/* Digital Membership ID Card Preview */}
              <div className="mt-8 rounded-sm bg-gradient-to-br from-slate-950 via-slate-900 to-green-deep p-6 text-white text-left shadow-xl border-2 border-amber-400/40 relative overflow-hidden">
                {/* Background watermarked logo */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-10 size-64 select-none"
                >
                  <img src={arfLogo} alt="" className="size-full object-contain" />
                </div>

                {/* Card Top Banner */}
                <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={arfLogo}
                      alt="ARF Logo"
                      className="size-12 rounded-full bg-white p-0.5 object-contain"
                    />
                    <div>
                      <h3 className="font-display text-base font-extrabold tracking-tight text-white leading-tight">
                        ABBA ROLLER FOUNDATION
                      </h3>
                      <p className="text-[10px] text-amber-300 font-medium">
                        OFFICIAL NATIONAL MEMBERSHIP IDENTITY
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                      Membership ID
                    </span>
                    <span className="font-mono text-sm sm:text-base font-extrabold text-amber-400">
                      {registeredMember.id}
                    </span>
                  </div>
                </div>

                {/* Card Body Details with Photo Frame */}
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  {/* Photo Frame */}
                  <div className="w-28 h-34 sm:w-32 sm:h-38 rounded-sm border-2 border-amber-400 bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center shadow-md relative">
                    {registeredMember.photoUrl ? (
                      <img
                        src={registeredMember.photoUrl}
                        alt={registeredMember.fullName}
                        className="size-full object-cover object-center"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <div className="size-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-1">
                          <User className="size-6 text-amber-400" />
                        </div>
                        <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">
                          MEMBER PHOTO
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">
                        Member Name
                      </span>
                      <p className="font-bold text-white text-base mt-0.5">
                        {registeredMember.fullName}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">
                        State &amp; LGA
                      </span>
                      <p className="font-bold text-white text-sm mt-0.5">
                        {registeredMember.lga} LGA, {registeredMember.state} State
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">
                        Membership Tier
                      </span>
                      <p className="font-bold text-amber-300 mt-0.5">{registeredMember.tier}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">
                        Date of Issue
                      </span>
                      <p className="font-mono text-slate-200 mt-0.5">
                        {registeredMember.joinedDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer Strip */}
                <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Authorized by Founder &amp; Board of Trustees</span>
                  <span className="text-green-400 font-bold">● Active Status</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  type="button"
                  size="lg"
                  onClick={handleDownloadCard}
                  disabled={isDownloading}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-2 w-full sm:w-auto shadow-md"
                >
                  <Download className="size-4" />
                  <span>
                    {isDownloading ? "Generating Card..." : "Download Official ID Card (PNG)"}
                  </span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto gap-2"
                >
                  <Printer className="size-4" />
                  <span>Print Slip</span>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-green-deep font-bold"
                >
                  <Link to="/admin">
                    <span>View Member Directory</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-hairline text-center">
                <button
                  type="button"
                  onClick={() => setRegisteredMember(null)}
                  className="text-xs text-muted-foreground hover:text-ink underline cursor-pointer"
                >
                  Register another member
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* REGISTRATION FORM & TIERS EXPLANATION                                      */
          /* ========================================================================= */
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            {/* Left 7 Columns: The Official Registration Form */}
            <div className="lg:col-span-7">
              <div className="rounded-md border border-hairline bg-surface p-6 sm:p-8 md:p-10 shadow-xs">
                <div className="border-b border-hairline pb-4 mb-6">
                  <h2 className="font-display text-2xl font-bold text-ink">
                    Membership Registration Form
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-soft mt-1">
                    Please provide your authentic details. Your State and LGA will be used for
                    community mapping and local mobilisation.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Passport Photograph Upload (For Official ID Card) */}
                  <div className="space-y-2 p-4 rounded-lg bg-surface/80 border-2 border-dashed border-amber-400/40 hover:border-amber-400/70 transition-colors">
                    <Label className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <Camera className="size-3.5 text-green-deep" />
                      <span>Upload Passport Photograph (For Official ID Card)</span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        (Recommended)
                      </span>
                    </Label>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                      {/* Photo Preview / Placeholder Box */}
                      <div className="size-24 rounded-md border-2 border-amber-500/50 bg-background flex items-center justify-center overflow-hidden shrink-0 relative group shadow-sm">
                        {photoPreview ? (
                          <>
                            <img
                              src={photoPreview}
                              alt="Passport Preview"
                              className="size-full object-cover object-center"
                            />
                            <button
                              type="button"
                              onClick={removePhoto}
                              className="absolute top-1 right-1 size-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-destructive transition-colors"
                              title="Remove photo"
                            >
                              <X className="size-3" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-2">
                            <Camera className="size-7 mx-auto text-muted-foreground/60" />
                            <span className="text-[9px] text-muted-foreground font-semibold mt-1 block">
                              Passport Photo
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Upload Controls & Instructions */}
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/jpg"
                          onChange={handlePhotoChange}
                          className="hidden"
                          id="member-photo-input"
                        />
                        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs gap-1.5 border-green-deep/30 text-green-deep hover:bg-green-wash"
                          >
                            <UploadCloud className="size-3.5" />
                            <span>{photoPreview ? "Change Photograph" : "Select Photograph"}</span>
                          </Button>
                          {photoPreview && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removePhoto}
                              className="text-xs text-destructive hover:bg-destructive/10"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Upload a portrait or passport headshot (JPEG, PNG, max 5MB). This
                          photograph will be embedded directly onto your downloadable National
                          Membership ID Card.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="fullName"
                      className="text-xs font-bold text-ink flex items-center gap-1.5"
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
                      className="bg-background"
                    />
                  </div>

                  {/* Contact Fields: Email & Phone */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="email"
                        className="text-xs font-bold text-ink flex items-center gap-1.5"
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
                        className="bg-background"
                      />
                      <span className="text-[10px] text-muted-foreground">
                        For correspondence &amp; notifications
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="phone"
                        className="text-xs font-bold text-ink flex items-center gap-1.5"
                      >
                        <Phone className="size-3.5 text-green-deep" />
                        <span>Phone Number (WhatsApp)</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g. 0803 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-background"
                      />
                      <span className="text-[10px] text-muted-foreground">
                        Optional but recommended
                      </span>
                    </div>
                  </div>

                  {/* State and Dynamic LGA Dropdowns */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="state"
                        className="text-xs font-bold text-ink flex items-center gap-1.5"
                      >
                        <MapPin className="size-3.5 text-brand-red" />
                        <span>State of Residence</span>
                        <span className="text-brand-red">*</span>
                      </Label>
                      <Select value={selectedState} onValueChange={handleStateChange}>
                        <SelectTrigger id="state" className="bg-background w-full">
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
                        className="text-xs font-bold text-ink flex items-center gap-1.5"
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
                        <SelectTrigger id="lga" className="bg-background w-full">
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
                      <span className="text-[10px] text-muted-foreground">
                        Dynamic LGA based on selected state
                      </span>
                    </div>
                  </div>

                  {/* Gender & Occupation */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="gender" className="text-xs font-bold text-ink">
                        Gender (Optional)
                      </Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger id="gender" className="bg-background w-full">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="occupation"
                        className="text-xs font-bold text-ink flex items-center gap-1.5"
                      >
                        <Briefcase className="size-3.5 text-ink-soft" />
                        <span>Occupation / Profession (Optional)</span>
                      </Label>
                      <Input
                        id="occupation"
                        placeholder="e.g. Teacher, Nurse, Trader, Student"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                  </div>

                  {/* Membership Tier Radio / Cards */}
                  <div className="space-y-2 pt-2">
                    <Label className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <Award className="size-3.5 text-amber-500" />
                      <span>Select Membership Tier</span>
                      <span className="text-brand-red">*</span>
                    </Label>

                    <div className="grid gap-2 sm:grid-cols-1">
                      {TIERS.map((t) => (
                        <label
                          key={t.name}
                          className={`flex items-start gap-3 p-3.5 rounded-sm border cursor-pointer transition-all ${
                            tier === t.name
                              ? "border-green-deep bg-green-wash/40 ring-1 ring-green-deep"
                              : "border-hairline bg-background hover:border-ink-soft/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name="tier"
                            value={t.name}
                            checked={tier === t.name}
                            onChange={() => setTier(t.name)}
                            className="mt-1 accent-green-deep"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-sm text-ink">{t.name}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${t.badgeColor}`}
                              >
                                {t.badge}
                              </span>
                            </div>
                            <p className="text-xs text-ink-soft mt-0.5">{t.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Code of Conduct Checkbox */}
                  <div className="flex items-start gap-2.5 pt-2">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 accent-green-deep"
                    />
                    <label
                      htmlFor="acceptTerms"
                      className="text-xs text-ink-soft leading-snug cursor-pointer"
                    >
                      I declare that the information provided is accurate, and I agree to uphold the
                      Abba Roller Foundation&apos;s values of unity, integrity, peace, and
                      humanitarian service across Nigeria.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="give"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full text-base font-bold shadow-lift cursor-pointer py-6"
                  >
                    <IdCard className="size-5" />
                    <span>
                      {isSubmitting
                        ? "Processing Registration..."
                        : "Complete Registration & Generate ID Card"}
                    </span>
                  </Button>
                </form>
              </div>
            </div>

            {/* Right 5 Columns: Membership Benefits & Value Props */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Card 1: Why Register as a Member */}
              <div className="rounded-md border border-hairline bg-surface p-6 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-green-deep">
                  Foundation Membership
                </span>
                <h3 className="font-display text-xl font-bold text-ink mt-1">
                  Why Your Membership Matters
                </h3>
                <p className="text-xs text-ink-soft mt-2 leading-relaxed">
                  The Abba Roller Foundation is building a nationwide civic network to ensure that
                  every community from the grassroots in Jigawa, Kano, and northern Nigeria to all
                  36 states has active champions for education, youth, and welfare.
                </p>

                <ul className="mt-4 space-y-2.5 text-xs text-ink">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 text-green-mid shrink-0 mt-0.5" />
                    <span>
                      <strong>Authentic Representation:</strong> Your LGA registration directly
                      informs our resource deployment for food distribution and student aid.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 text-green-mid shrink-0 mt-0.5" />
                    <span>
                      <strong>Verified Identification:</strong> Receive an official digital
                      Membership ID Card recognized across foundation hubs.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 text-green-mid shrink-0 mt-0.5" />
                    <span>
                      <strong>Youth &amp; Leadership Programs:</strong> Priority access to
                      tournaments, grants, leadership mentorship, and volunteer roles.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Admin Dashboard Link for Coordinators */}
              <div className="rounded-md border border-slate-800 bg-slate-950 p-6 text-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <ShieldCheck className="size-4" />
                  <span>State &amp; LGA Coordinator Portal</span>
                </div>
                <h4 className="font-display text-lg font-bold text-white mt-1">
                  Foundation Admin Dashboard
                </h4>
                <p className="text-xs text-slate-300 mt-2">
                  Foundation executives and state coordinators can view, filter by State/LGA, and
                  export the membership database to CSV for targeted community engagement.
                </p>
                <div className="mt-4">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800 gap-1.5 text-xs"
                  >
                    <Link to="/admin">
                      <span>Access Admin Dashboard</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Card 3: Founder's Quote */}
              <div className="rounded-md border-l-4 border-amber-500 bg-surface p-5 shadow-2xs">
                <p className="text-xs italic text-ink-soft leading-relaxed">
                  &ldquo;A foundation is only as strong as the people who believe in its mission.
                  When you register as an ARF member, you become the voice and hands of compassion
                  in your local government area.&rdquo;
                </p>
                <p className="text-xs font-bold text-ink mt-2">
                  Hon. Usman Aminu Usman (Abba Roller)
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Founder &amp; Chairman, Abba Roller Foundation
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

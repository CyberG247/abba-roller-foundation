import React, { useState, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Users2,
  CheckCircle2,
  Download,
  Printer,
  Copy,
  Upload,
  Camera,
  HeartHandshake,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  FileCheck2,
  AlertCircle,
  Loader2,
  Briefcase,
  MapPin,
  Calendar,
  X,
} from "lucide-react";
import { toast } from "sonner";

import arfLogo from "@/assets/arf-logo-official.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Reveal } from "./Reveal";
import { org } from "@/data/site";
import { downloadVolunteerSlip, VolunteerSlipData } from "@/lib/generateVolunteerSlip";

export const PHILANTHROPIC_ACTIVITIES = [
  {
    id: "weekly-food",
    name: "Weekly Community Food Distribution",
    detail:
      "Distributing 250+ hot, balanced cooked meals to street children & vulnerable families weekly",
    category: "Nutrition & Food Aid",
  },
  {
    id: "ramadan-relief",
    name: "Ramadan Multi-State Humanitarian Food Relief",
    detail:
      "Packaging and multi-state logistics for 1,500 wholesome food package pieces across 10 states",
    category: "Seasonal Relief",
  },
  {
    id: "pad-up-girls",
    name: "Pad Up Nigerian Girls (Menstrual Health & Dignity)",
    detail: "School sensitisation, menstrual hygiene education & sanitary supplies distribution",
    category: "Girl-Child Advocacy",
  },
  {
    id: "visually-impaired-outreach",
    name: "Special Needs & Visually Impaired School Outreach",
    detail:
      "Hostel living support, food, hygiene packs, detergents & sports kits for special pupils",
    category: "Special Education & Welfare",
  },
  {
    id: "youth-sports",
    name: "Grassroots Youth & Sports Development (Peace Cup)",
    detail:
      "Grassroots football tournaments, kit donation, athletic mentorship & youth anti-vice drives",
    category: "Youth Empowerment",
  },
  {
    id: "hospital-medical-relief",
    name: "Hospital Medical Bill Relief & Sanitation Interventions",
    detail: "Defraying clinical costs for indigent patients and donating hospital hygiene supplies",
    category: "Healthcare Assistance",
  },
  {
    id: "custodial-centre-support",
    name: "Custodial Centre & Inmate Humanitarian Aid",
    detail:
      "Donating staple foodstuffs and personal welfare items to Nigerian Correctional Service inmates",
    category: "Vulnerable Demographics",
  },
  {
    id: "women-empowerment",
    name: "Women & Widows Economic Empowerment & Trade Grants",
    detail: "Financial relief, petty trade support, mentorship and small business grants for women",
    category: "Livelihood & Trade",
  },
  {
    id: "vocational-skills",
    name: "Vocational Skills Training & Capacity Development",
    detail:
      "Practical instruction in tailoring, crafts, computer literacy and community entrepreneurship",
    category: "Skills & Education",
  },
  {
    id: "logistics-warehouse",
    name: "Field Logistics, Relief Packaging & Handover Coordination",
    detail:
      "Supply chain sorting, warehouse stock safety, transport and orderly community handovers",
    category: "Field Operations",
  },
  {
    id: "media-documentation",
    name: "Media, Photography, Videography & Storytelling",
    detail:
      "Capturing authentic field reports, beneficiary stories and transparent public documentation",
    category: "Communications",
  },
  {
    id: "emergency-relief",
    name: "Disaster & Emergency Household Relief Response",
    detail: "Rapid mobilization of essentials during unexpected community crises and hardship",
    category: "Emergency Aid",
  },
  {
    id: "general-volunteer",
    name: "General Humanitarian Mobilization (Deploy Where Most Needed)",
    detail: "Flexible deployment across all foundation campaigns based on operational priority",
    category: "All-Round Support",
  },
] as const;

export const PROFESSIONS = [
  "Accountant / Auditor / Financial Analyst",
  "Medical Doctor / Physician",
  "Nurse / Midwife / Community Health Worker",
  "Pharmacist / Medical Lab Scientist",
  "Teacher / Lecturer / Education Specialist",
  "Software Engineer / IT & Web Specialist",
  "Journalist / Media & Public Relations Officer",
  "Graphic Designer / UI Designer",
  "Photographer / Videographer / Content Creator",
  "Social Worker / Counselor / Sociologist",
  "Logistics / Procurement & Supply Chain Specialist",
  "Civil Servant / Public Administrator",
  "Business Administrator / Project Manager",
  "Entrepreneur / Merchant / Business Owner",
  "Student / NYSC Youth Corps Member",
  "Artisan / Skilled Craftsman (Tailor, Electrician, Carpenter, Plumber)",
  "Sports Coach / Athlete / Physical Trainer",
  "Community Leader / Clergy / Religious Scholar",
  "Other Profession",
] as const;

export const NIGERIAN_STATES = [
  "Jigawa",
  "Kano",
  "Kaduna",
  "Katsina",
  "Borno",
  "Yobe",
  "Bauchi",
  "Sokoto",
  "Gombe",
  "Zamfara",
  "FCT Abuja",
  "Lagos",
  "Adamawa",
  "Kebbi",
  "Niger",
  "Plateau",
  "Taraba",
  "Benue",
  "Kogi",
  "Kwara",
  "Nasarawa",
  "Other Nigerian State",
] as const;

export const AVAILABILITY_OPTIONS = [
  "Weekends Only (Saturdays & Sundays)",
  "Weekdays (Flexible / Part-time)",
  "Full-time / Dedicated Campaign Corridors",
  "Emergency & Rapid Call-out Availability",
  "Remote / Digital Contribution (Communications & Admin)",
] as const;

export function VolunteerSection({ id = "volunteer" }: { id?: string }) {
  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [state, setState] = useState("Jigawa");
  const [lga, setLga] = useState("");
  const [address, setAddress] = useState("");
  const [profession, setProfession] = useState("");
  const [customProfession, setCustomProfession] = useState("");
  const [activity, setActivity] = useState("");
  const [availability, setAvailability] = useState(AVAILABILITY_OPTIONS[0]);
  const [motivation, setMotivation] = useState("");
  const [pledge, setPledge] = useState(false);

  // Photo upload
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Slip modal state
  const [slipData, setSlipData] = useState<VolunteerSlipData | null>(null);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Photo handler
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

  // Form submission
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
    if (!phone.trim()) {
      setErrorMsg("Please provide your active phone / WhatsApp number.");
      return;
    }
    if (!state) {
      setErrorMsg("Please select your state of residence.");
      return;
    }
    if (!lga.trim()) {
      setErrorMsg("Please specify your Local Government Area (LGA) or city.");
      return;
    }
    if (!profession) {
      setErrorMsg("Please choose your profession from the dropdown.");
      return;
    }
    if (profession === "Other Profession" && !customProfession.trim()) {
      setErrorMsg("Please specify your profession in the text box.");
      return;
    }
    if (!activity) {
      setErrorMsg("Please select where you wish to volunteer from the dropdown menu.");
      return;
    }
    if (!pledge) {
      setErrorMsg("Please agree to the volunteer declaration to continue.");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const refNumber = `ARF-VOL-2026-${randomSuffix}`;
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const effectiveProfession =
        profession === "Other Profession" ? customProfession.trim() : profession;

      const selectedActivityObj = PHILANTHROPIC_ACTIVITIES.find((a) => a.id === activity);
      const activityTitle = selectedActivityObj ? selectedActivityObj.name : activity;

      const generatedSlip: VolunteerSlipData = {
        refNumber,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gender: gender || "Not Specified",
        ageGroup: ageGroup || "18 - 35 years",
        state,
        lga: lga.trim(),
        address: address.trim() || undefined,
        profession: effectiveProfession,
        activity: activityTitle,
        availability,
        photoUrl: photoPreview,
        submissionDate: formattedDate,
      };

      setSlipData(generatedSlip);
      setSubmitting(false);
      setIsSlipOpen(true);

      // Trigger celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0B3D2E", "#C62828", "#145A43", "#F59E0B"],
      });

      toast.success("Application Received! Your Volunteer Acknowledgement Slip is ready.");
    }, 600);
  };

  const handleDownloadSlip = async () => {
    if (!slipData) return;
    try {
      setDownloading(true);
      await downloadVolunteerSlip(slipData);
      toast.success("Acknowledgement Slip downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Could not download slip image. Please use Print to Save PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const copyRefNumber = () => {
    if (!slipData) return;
    navigator.clipboard.writeText(slipData.refNumber);
    toast.success(`Reference ${slipData.refNumber} copied to clipboard!`);
  };

  return (
    <section
      id={id}
      className="scroll-mt-20 py-20 md:py-28 bg-gradient-to-b from-surface via-background to-surface border-t border-hairline relative overflow-hidden"
    >
      {/* Background Motifs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-green-wash/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-brand-red-wash/40 blur-3xl pointer-events-none" />

      <div className="shell relative">
        {/* Section Heading */}
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-wash text-green-deep border border-green-mid/20 text-xs font-bold tracking-wide uppercase mb-4">
              <Users2 className="size-3.5" />
              <span>ARF Volunteer Mobilization</span>
            </div>
            <h2 className="display-2 text-ink">Volunteer With Abba Roller Foundation</h2>
            <p className="lede mt-4">
              Step forward to serve humanity. Join our network of dedicated volunteers bringing
              sustenance, educational hope, dignity, and real empowerment to vulnerable children,
              women, and communities across Nigeria.
            </p>
          </div>
        </Reveal>

        {/* 4 Pillars of Volunteering with ARF */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal
            delay={40}
            className="p-5 rounded-sm bg-background border border-hairline shadow-2xs"
          >
            <div className="size-10 rounded-sm bg-green-wash text-green-deep flex items-center justify-center mb-3">
              <HeartHandshake className="size-5" />
            </div>
            <h3 className="font-display font-bold text-ink">Direct Grassroots Touch</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Hands-on distribution of food, sanitary supplies, and school welfare directly to
              individuals in need.
            </p>
          </Reveal>

          <Reveal
            delay={80}
            className="p-5 rounded-sm bg-background border border-hairline shadow-2xs"
          >
            <div className="size-10 rounded-sm bg-brand-red-wash text-brand-red flex items-center justify-center mb-3">
              <Briefcase className="size-5" />
            </div>
            <h3 className="font-display font-bold text-ink">Professional Skills Alignment</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Whether you are a doctor, accountant, educator, engineer, or craftsman, your
              professional talent is put to purpose.
            </p>
          </Reveal>

          <Reveal
            delay={120}
            className="p-5 rounded-sm bg-background border border-hairline shadow-2xs"
          >
            <div className="size-10 rounded-sm bg-green-wash text-green-deep flex items-center justify-center mb-3">
              <Award className="size-5" />
            </div>
            <h3 className="font-display font-bold text-ink">Official ARF Accreditation</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Receive verified volunteer accreditation, official registration slip, and recognized
              community service credentials.
            </p>
          </Reveal>

          <Reveal
            delay={160}
            className="p-5 rounded-sm bg-background border border-hairline shadow-2xs"
          >
            <div className="size-10 rounded-sm bg-muted text-ink flex items-center justify-center mb-3">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="font-display font-bold text-ink">Dignity-First Operations</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Work under safe, structured field protocols that protect the honor and humanity of
              every person served.
            </p>
          </Reveal>
        </div>

        {/* Application Form Card */}
        <Reveal delay={100} className="mt-14 max-w-4xl mx-auto">
          <div className="rounded-md border border-hairline bg-card shadow-lift overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-green-deep via-green-mid to-green-deep px-6 py-6 sm:px-10 text-white relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={arfLogo}
                    alt="ARF Logo"
                    className="size-12 rounded-full border-2 border-white/30 bg-white object-contain p-0.5 shadow-sm"
                  />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-green-wash">
                      Official Intake Form — 2026 Humanitarian Cohort
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-bold leading-tight">
                      Volunteer Registration Application
                    </h3>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold self-start sm:self-auto border border-white/20">
                  <Sparkles className="size-3.5 text-yellow-300" />
                  <span>Instant Verification Slip</span>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
              {errorMsg && (
                <div className="p-4 rounded-sm bg-red-50 border border-brand-red/30 flex items-start gap-3 text-brand-red text-sm">
                  <AlertCircle className="size-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Required Information Missing:</span>
                    <p className="mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* 1. APPLICANT PHOTO & BASIC DETAILS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-hairline pb-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-green-deep text-white text-xs font-bold">
                    1
                  </span>
                  <h4 className="font-display font-bold text-ink text-base sm:text-lg">
                    Applicant Identity &amp; Passport Photo
                  </h4>
                </div>

                <div className="grid gap-6 sm:grid-cols-[160px_1fr] items-start pt-2">
                  {/* Photo Upload Box */}
                  <div className="flex flex-col items-center">
                    <div className="relative size-36 sm:size-40 rounded-sm border-2 border-dashed border-hairline hover:border-green-deep transition-colors bg-muted/30 flex flex-col items-center justify-center overflow-hidden group">
                      {photoPreview ? (
                        <>
                          <img
                            src={photoPreview}
                            alt="Applicant Preview"
                            className="size-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                            title="Remove photo"
                          >
                            <X className="size-3.5" />
                          </button>
                        </>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center justify-center p-3 text-center cursor-pointer size-full hover:bg-green-wash/30 transition-colors"
                        >
                          <Camera className="size-8 text-muted-foreground group-hover:text-green-deep transition-colors mb-1.5" />
                          <span className="text-xs font-semibold text-ink leading-tight">
                            Upload Passport Photo
                          </span>
                          <span className="text-[10px] text-muted-foreground mt-1">
                            JPG or PNG (Max 5MB)
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] h-7"
                      >
                        <Upload className="size-3 mr-1" />
                        {photoPreview ? "Change Photo" : "Select Photo"}
                      </Button>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 text-center">
                      * Will appear on your official acknowledgement slip
                    </span>
                  </div>

                  {/* Personal Fields */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="fullName" className="text-xs font-bold text-ink">
                        Full Name (Surname First or Official Order){" "}
                        <span className="text-brand-red">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ibrahim Abubakar Garba"
                        className="mt-1.5"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender" className="text-xs font-bold text-ink">
                        Gender
                      </Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger id="gender" className="mt-1.5">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="ageGroup" className="text-xs font-bold text-ink">
                        Age Group
                      </Label>
                      <Select value={ageGroup} onValueChange={setAgeGroup}>
                        <SelectTrigger id="ageGroup" className="mt-1.5">
                          <SelectValue placeholder="Select age bracket" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="18 - 24 years">18 - 24 years</SelectItem>
                          <SelectItem value="25 - 34 years">25 - 34 years</SelectItem>
                          <SelectItem value="35 - 44 years">35 - 44 years</SelectItem>
                          <SelectItem value="45+ years">45+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. CONTACT & RESIDENTIAL LOCATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-hairline pb-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-green-deep text-white text-xs font-bold">
                    2
                  </span>
                  <h4 className="font-display font-bold text-ink text-base sm:text-lg">
                    Contact &amp; Location Information
                  </h4>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div>
                    <Label htmlFor="email" className="text-xs font-bold text-ink">
                      Email Address <span className="text-brand-red">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. volunteer@example.com"
                      className="mt-1.5"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-xs font-bold text-ink">
                      Active Phone / WhatsApp Number <span className="text-brand-red">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +234 803 123 4567"
                      className="mt-1.5"
                      required
                    />
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">
                      Our volunteer coordinators will reach out via WhatsApp/Call.
                    </span>
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-xs font-bold text-ink">
                      State of Residence <span className="text-brand-red">*</span>
                    </Label>
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger id="state" className="mt-1.5">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {NIGERIAN_STATES.map((st) => (
                          <SelectItem key={st} value={st}>
                            {st}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="lga" className="text-xs font-bold text-ink">
                      Local Government Area (LGA) / Town <span className="text-brand-red">*</span>
                    </Label>
                    <Input
                      id="lga"
                      value={lga}
                      onChange={(e) => setLga(e.target.value)}
                      placeholder="e.g. Gumel, Dutse, Kano Municipal"
                      className="mt-1.5"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="address" className="text-xs font-bold text-ink">
                      Residential Area / Community Address (Optional)
                    </Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Limawa Ward, Near Central Mosque, Dutse"
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>

              {/* 3. PROFESSION & SKILLS (DROPDOWN AS REQUESTED) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-hairline pb-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-green-deep text-white text-xs font-bold">
                    3
                  </span>
                  <h4 className="font-display font-bold text-ink text-base sm:text-lg">
                    Profession &amp; Background (Dropdown)
                  </h4>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="profession" className="text-xs font-bold text-ink">
                      Select Your Profession <span className="text-brand-red">*</span>
                    </Label>
                    <Select value={profession} onValueChange={setProfession}>
                      <SelectTrigger id="profession" className="mt-1.5 bg-background">
                        <SelectValue placeholder="Select profession (e.g. Doctor, Accountant, Teacher...)" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {PROFESSIONS.map((prof) => (
                          <SelectItem key={prof} value={prof}>
                            {prof}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      ⚖️ <strong>Are you a Lawyer or Legal Practitioner?</strong> Please apply
                      through our dedicated{" "}
                      <a
                        href="#lawyers-volunteer"
                        className="text-emerald-700 dark:text-emerald-400 font-bold underline hover:text-emerald-800"
                      >
                        Lawyers Volunteer Section
                      </a>{" "}
                      to win a case for the less privileged.
                    </p>
                    <span className="text-[11px] text-muted-foreground mt-1 block">
                      Choose the field closest to your primary vocation or training.
                    </span>
                  </div>

                  {profession === "Other Profession" && (
                    <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-2">
                      <Label htmlFor="customProfession" className="text-xs font-bold text-ink">
                        Specify Your Profession / Vocation <span className="text-brand-red">*</span>
                      </Label>
                      <Input
                        id="customProfession"
                        value={customProfession}
                        onChange={(e) => setCustomProfession(e.target.value)}
                        placeholder="Please write your profession or trade"
                        className="mt-1.5"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 4. WHERE DO YOU WISH TO VOLUNTEER (DROPDOWN OF ALL PHILANTHROPIC ACTIVITIES) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-hairline pb-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-green-deep text-white text-xs font-bold">
                    4
                  </span>
                  <h4 className="font-display font-bold text-ink text-base sm:text-lg">
                    Philanthropic Activity Selection (Dropdown)
                  </h4>
                </div>

                <div className="pt-2 space-y-4">
                  <div>
                    <Label htmlFor="activity" className="text-xs font-bold text-ink">
                      Where Do You Wish to Volunteer? <span className="text-brand-red">*</span>
                    </Label>
                    <Select value={activity} onValueChange={setActivity}>
                      <SelectTrigger
                        id="activity"
                        className="mt-1.5 bg-background h-auto py-2.5 text-left"
                      >
                        <SelectValue placeholder="Choose an outreach program (e.g. Food Distribution, Ramadan Relief...)" />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {PHILANTHROPIC_ACTIVITIES.map((act) => (
                          <SelectItem key={act.id} value={act.id} className="py-2">
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-ink text-sm">{act.name}</span>
                              <span className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                                [{act.category}] — {act.detail}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-[11px] text-muted-foreground mt-1.5 block">
                      Select your primary area of service. You may also assist in complementary
                      campaigns as needed.
                    </span>
                  </div>

                  {/* Highlight card of selected activity */}
                  {activity && (
                    <div className="p-3.5 rounded-sm bg-green-wash/60 border border-green-mid/20 text-xs text-green-deep animate-in fade-in">
                      <span className="font-bold block text-sm">
                        Selected Campaign:{" "}
                        {PHILANTHROPIC_ACTIVITIES.find((a) => a.id === activity)?.name}
                      </span>
                      <p className="mt-1 text-ink-soft">
                        {PHILANTHROPIC_ACTIVITIES.find((a) => a.id === activity)?.detail}
                      </p>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2 pt-2">
                    <div>
                      <Label htmlFor="availability" className="text-xs font-bold text-ink">
                        Preferred Availability / Schedule
                      </Label>
                      <Select value={availability} onValueChange={setAvailability}>
                        <SelectTrigger id="availability" className="mt-1.5">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABILITY_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="motivation" className="text-xs font-bold text-ink">
                        Brief Motivation / Previous Experience (Optional)
                      </Label>
                      <Input
                        id="motivation"
                        value={motivation}
                        onChange={(e) => setMotivation(e.target.value)}
                        placeholder="Tell us what inspires you to serve"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. DECLARATION PLEDGE */}
              <div className="pt-2">
                <div className="flex items-start gap-3 p-4 rounded-sm bg-muted/40 border border-hairline">
                  <input
                    type="checkbox"
                    id="pledge"
                    checked={pledge}
                    onChange={(e) => setPledge(e.target.checked)}
                    className="size-4.5 rounded-xs border-hairline text-green-deep focus:ring-green-deep mt-0.5 cursor-pointer accent-green-deep"
                    required
                  />
                  <Label
                    htmlFor="pledge"
                    className="text-xs leading-relaxed text-ink cursor-pointer"
                  >
                    <span className="font-bold">Volunteer Commitment &amp; Ethics Pledge:</span> I
                    confirm that all information provided is genuine. I commit to conducting myself
                    with compassion, accountability, and respect for the dignity and safety of every
                    beneficiary served by the Abba Roller Foundation.
                  </Label>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-hairline">
                <p className="text-xs text-muted-foreground">
                  * An official acknowledgement slip will pop out immediately upon submission.
                </p>
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-green-deep hover:bg-green-mid text-white font-bold px-8 shadow-md"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Generating Registration Slip...
                    </>
                  ) : (
                    <>
                      Submit Application &amp; View Slip
                      <ArrowRight className="size-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>

      {/* ========================================================== */}
      {/* ACKNOWLEDGEMENT SLIP POP-OUT MODAL */}
      {/* ========================================================== */}
      <Dialog open={isSlipOpen} onOpenChange={setIsSlipOpen}>
        <DialogContent className="max-w-2xl w-[95vw] p-0 overflow-hidden border-2 border-green-deep shadow-2xl bg-white max-h-[92vh] flex flex-col">
          {slipData && (
            <>
              {/* Slip Scrollable Preview Area */}
              <div className="overflow-y-auto p-4 sm:p-8 flex-1">
                {/* Print Container with ID for direct clean print */}
                <div className="printable-slip border-2 border-green-deep rounded-sm bg-[#FAFBF9] p-5 sm:p-7 relative shadow-sm text-ink">
                  {/* Subtle Background Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden select-none">
                    <img src={arfLogo} alt="" className="size-96 object-contain" />
                  </div>

                  {/* Header Lockup */}
                  <div className="border-b-2 border-green-deep pb-4 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={arfLogo}
                        alt="ARF Logo"
                        className="size-16 sm:size-18 shrink-0 rounded-full border-2 border-green-deep bg-white object-contain p-0.5 shadow-xs"
                      />
                      <div>
                        <h3 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-green-deep">
                          ABBA ROLLER FOUNDATION
                        </h3>
                        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Directorate of Volunteer Services &amp; Humanitarian Intake
                        </p>
                        <p className="text-[10px] text-muted-foreground italic">
                          Empowering youth &amp; women. Strengthening communities across Nigeria.
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-center sm:text-right">
                      <span className="inline-block px-2.5 py-1 rounded-xs bg-green-wash border border-green-mid/30 text-[10px] font-bold text-green-deep uppercase tracking-wider">
                        Official Slip
                      </span>
                      <p className="text-[10px] font-mono text-muted-foreground mt-1">
                        Form ARF-V26
                      </p>
                    </div>
                  </div>

                  {/* Title Banner */}
                  <div className="my-4 py-2 px-3 bg-muted/60 border border-hairline rounded-xs text-center">
                    <h4 className="font-display text-sm sm:text-base font-bold text-green-deep tracking-wide uppercase">
                      Volunteer Registration Acknowledgement Slip
                    </h4>
                  </div>

                  {/* Ref & Status Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border-b border-hairline pb-3.5">
                    <div>
                      <span className="text-muted-foreground text-[11px] block">
                        Registration Reference:
                      </span>
                      <span className="font-mono font-bold text-sm sm:text-base text-brand-red">
                        {slipData.refNumber}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-muted-foreground text-[11px] block">
                        Date of Submission:
                      </span>
                      <span className="font-semibold text-ink">{slipData.submissionDate}</span>
                    </div>
                  </div>

                  {/* Status Tag */}
                  <div className="my-3.5 flex items-center gap-2 px-3 py-1.5 rounded-xs bg-green-50 border border-green-200 text-green-800 text-xs font-semibold">
                    <CheckCircle2 className="size-4 text-green-600 shrink-0" />
                    <span>STATUS: APPLICATION LOGGED &amp; AWAITING DEPLOYMENT BRIEFING</span>
                  </div>

                  {/* Main Grid: Details + Photo */}
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4 sm:gap-6 mt-4">
                    {/* Left Column: Data points */}
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-2.5 rounded-xs bg-white border border-hairline">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                            Full Name
                          </span>
                          <span className="font-display font-bold text-sm text-ink block mt-0.5">
                            {slipData.fullName}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xs bg-white border border-hairline">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                            Profession / Vocation
                          </span>
                          <span className="font-display font-bold text-sm text-green-deep block mt-0.5">
                            {slipData.profession}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-2.5 rounded-xs bg-white border border-hairline">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                            Phone / WhatsApp
                          </span>
                          <span className="font-semibold text-ink block mt-0.5">
                            {slipData.phone}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xs bg-white border border-hairline">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                            Email Address
                          </span>
                          <span className="font-semibold text-ink block mt-0.5 truncate">
                            {slipData.email}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-2.5 rounded-xs bg-white border border-hairline">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                            State &amp; LGA
                          </span>
                          <span className="font-semibold text-ink block mt-0.5">
                            {slipData.lga}, {slipData.state} State
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xs bg-white border border-hairline">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                            Gender &amp; Age Group
                          </span>
                          <span className="font-semibold text-ink block mt-0.5">
                            {slipData.gender} ({slipData.ageGroup})
                          </span>
                        </div>
                      </div>

                      {/* Selected Philanthropic Outreach Activity */}
                      <div className="p-3 rounded-xs bg-green-wash/40 border border-green-mid/20">
                        <span className="text-[10px] uppercase font-bold text-green-deep block">
                          Assigned Philanthropic Outreach / Activity
                        </span>
                        <span className="font-display font-bold text-sm text-ink block mt-0.5">
                          {slipData.activity}
                        </span>
                        <span className="text-[11px] text-muted-foreground mt-1 block">
                          Availability: {slipData.availability}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Passport Photo Frame */}
                    <div className="flex flex-col items-center">
                      <div className="size-32 sm:size-36 rounded-xs border-2 border-green-deep bg-muted/40 overflow-hidden relative shadow-xs flex items-center justify-center">
                        {slipData.photoUrl ? (
                          <img
                            src={slipData.photoUrl}
                            alt={slipData.fullName}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-2 text-center text-muted-foreground">
                            <Users2 className="size-8 mb-1" />
                            <span className="text-[10px] font-bold">APPLICANT</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-green-deep text-white text-[9px] font-bold text-center py-0.5 tracking-wider uppercase">
                          Verified Applicant
                        </div>
                      </div>
                      <span className="text-[9px] text-muted-foreground mt-1.5 font-mono text-center">
                        PASSPORT PHOTO
                      </span>
                    </div>
                  </div>

                  {/* Signatures & Verification Seal */}
                  <div className="mt-6 pt-4 border-t border-hairline grid grid-cols-2 sm:grid-cols-3 gap-3 items-end text-center text-xs">
                    <div>
                      <p className="font-display font-bold italic text-sm text-green-deep border-b border-muted pb-1">
                        Usman Aminu Usman
                      </p>
                      <p className="font-bold text-[11px] mt-1 text-ink">Hon. Usman Aminu Usman</p>
                      <p className="text-[9px] text-muted-foreground">
                        Founder &amp; Chairman, ARF
                      </p>
                    </div>

                    <div className="hidden sm:flex flex-col items-center justify-center">
                      <div className="size-14 rounded-full border-2 border-yellow-600 bg-yellow-50 flex flex-col items-center justify-center text-[8px] font-bold text-yellow-800 leading-tight">
                        <span>OFFICIAL</span>
                        <span>ARF SEAL</span>
                        <span>★ 2026 ★</span>
                      </div>
                    </div>

                    <div>
                      <p className="font-display font-bold italic text-sm text-green-deep border-b border-muted pb-1">
                        Directorate Registry
                      </p>
                      <p className="font-bold text-[11px] mt-1 text-ink">Volunteer Intake Bureau</p>
                      <p className="text-[9px] text-muted-foreground">ARF Field Operations</p>
                    </div>
                  </div>

                  {/* Official Notice */}
                  <div className="mt-5 p-2.5 rounded-xs bg-muted/50 border border-hairline text-[10px] text-muted-foreground leading-normal">
                    <p className="font-bold text-ink">IMPORTANT NOTICE:</p>
                    <p className="mt-0.5">
                      Please retain or download this slip. An official coordinator will contact you
                      via WhatsApp/Phone to confirm upcoming field deployments, briefing logistics,
                      and volunteer badge issuance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar (Sticky at bottom of modal) */}
              <div className="p-4 sm:px-8 border-t border-hairline bg-surface flex flex-wrap items-center justify-between gap-3 no-print">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyRefNumber}
                  className="text-xs h-9"
                >
                  <Copy className="size-3.5 mr-1.5" />
                  Copy Reference ID
                </Button>

                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    className="text-xs h-9 hidden sm:inline-flex"
                  >
                    <Printer className="size-3.5 mr-1.5" />
                    Print / Save PDF
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    disabled={downloading}
                    onClick={handleDownloadSlip}
                    className="bg-green-deep hover:bg-green-mid text-white text-xs font-bold h-9 shadow-sm"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="size-3.5 mr-1.5" />
                        Download Slip (Image)
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSlipOpen(false)}
                    className="text-xs h-9"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

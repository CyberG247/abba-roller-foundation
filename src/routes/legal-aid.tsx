import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  Building2,
  CheckCircle2,
  Eye,
  Gavel,
  Globe2,
  GraduationCap,
  Mail,
  MapPin,
  Scale,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LawyersVolunteerSection } from "@/components/site/LawyersVolunteerSection";
import { DonateBand, Section } from "@/components/site/blocks";
import {
  getLawyersList,
  LEGAL_CASE_ELIGIBILITY,
  LEGAL_PRACTICE_FILTERS,
  type LawyerVolunteer,
} from "@/data/lawyersStore";
import { org } from "@/data/site";

const title = "Pro Bono Legal Aid & Advocate Directory — Abba Roller Foundation";
const description =
  "Access free pro bono courtroom representation for indigent citizens, browse verified Nigerian Bar advocates by state and specialty, or enroll in the ARF Legal Defense Corps.";

export const Route = createFileRoute("/legal-aid")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LegalAidPage,
});

function matchesPracticeFilter(areas: string[] | undefined, selectedPractice: string): boolean {
  if (selectedPractice === "All Practice Areas") return true;
  if (!areas || areas.length === 0) return false;

  const joined = areas.join(" ").toLowerCase();
  switch (selectedPractice) {
    case "Criminal & Bail Defense":
      return (
        joined.includes("criminal") ||
        joined.includes("bail") ||
        joined.includes("detention") ||
        joined.includes("prison")
      );
    case "Human Rights & Fundamental Enforcement":
      return joined.includes("human rights") || joined.includes("fundamental");
    case "Family, Women & Child Rights":
      return (
        joined.includes("family") ||
        joined.includes("women") ||
        joined.includes("child") ||
        joined.includes("domestic")
      );
    case "Civil Litigation & Property":
      return (
        joined.includes("civil") ||
        joined.includes("land") ||
        joined.includes("tenancy") ||
        joined.includes("eviction") ||
        joined.includes("property")
      );
    case "Public Interest Advocacy":
      return (
        joined.includes("public interest") ||
        joined.includes("disability") ||
        joined.includes("pro bono")
      );
    default:
      return joined.includes(selectedPractice.toLowerCase());
  }
}

function getInitials(name: string): string {
  const cleaned = name.replace(/^(Barr\.|Hon\.|Chief)\s+/i, "");
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0) ?? "A";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

function LegalAidPage() {
  const [lawyers, setLawyers] = useState<LawyerVolunteer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [practiceFilter, setPracticeFilter] = useState("All Practice Areas");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedAdvocate, setSelectedAdvocate] = useState<LawyerVolunteer | null>(null);

  useEffect(() => {
    const refresh = () => setLawyers(getLawyersList());
    refresh();
    window.addEventListener("arf_members_updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("arf_members_updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const availableStates = useMemo(() => {
    const states = new Set<string>();
    for (const l of lawyers) {
      if (l.status !== "Removed" && l.jurisdictionState) states.add(l.jurisdictionState);
    }
    return ["All States", ...Array.from(states).sort()];
  }, [lawyers]);

  const filteredLawyers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return lawyers.filter((lawyer) => {
      if (lawyer.status === "Removed") {
        return false;
      }
      if (stateFilter !== "All States" && lawyer.jurisdictionState !== stateFilter) {
        return false;
      }
      if (statusFilter !== "All Statuses" && lawyer.status !== statusFilter) {
        return false;
      }
      if (!matchesPracticeFilter(lawyer.practiceAreas, practiceFilter)) {
        return false;
      }
      if (!q) return true;
      return (
        lawyer.fullName.toLowerCase().includes(q) ||
        lawyer.id.toLowerCase().includes(q) ||
        (lawyer.lawFirm ?? "").toLowerCase().includes(q) ||
        lawyer.university.toLowerCase().includes(q) ||
        (lawyer.jurisdictionState ?? "").toLowerCase().includes(q) ||
        (lawyer.practiceAreas ?? []).some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [lawyers, searchQuery, stateFilter, practiceFilter, statusFilter]);

  const stats = useMemo(() => {
    const totalCases = lawyers.reduce(
      (sum, l) => sum + (Number.isFinite(l.casesWon) ? l.casesWon : 0),
      0,
    );
    const jurisdictions = new Set(lawyers.map((l) => l.jurisdictionState).filter(Boolean)).size;
    return {
      advocateCount: lawyers.length,
      totalCases,
      jurisdictions,
    };
  }, [lawyers]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${id}`);
      }
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Access to Justice"
        title="Pro Bono Legal Aid & Verified Advocate Directory"
        lede="Bridging the justice gap for indigent defendants, widows, and vulnerable citizens across Nigeria through Bar-verified pro bono courtroom representation."
        crumbs={[{ label: "Pro Bono Legal Aid" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            size="lg"
            onClick={() => scrollToSection("directory")}
            className="min-h-12 bg-amber-400 font-bold text-slate-950 hover:bg-amber-300"
          >
            <Scale className="mr-2 size-4" />
            Browse Advocate Directory
          </Button>
          <Button
            type="button"
            variant="onDarkOutline"
            size="lg"
            onClick={() => scrollToSection("eligibility")}
            className="min-h-12"
          >
            Case Eligibility &amp; Referrals
          </Button>
          <Button
            type="button"
            variant="onDarkOutline"
            size="lg"
            onClick={() => scrollToSection("lawyers-volunteer")}
            className="min-h-12"
          >
            Enroll as Bar Volunteer
          </Button>
        </div>
      </PageHeader>

      {/* Sticky Sub-Nav */}
      <nav
        aria-label="Legal aid sections"
        className="sticky top-18 z-30 border-b border-hairline bg-background/95 backdrop-blur-md md:top-20"
      >
        <div className="shell flex items-center gap-2 overflow-x-auto py-2.5">
          {[
            { label: "Indigent Case Eligibility", id: "eligibility" },
            {
              label: `Verified Lawyer Directory (${lawyers.length})`,
              id: "directory",
            },
            { label: "Enroll as Advocate", id: "lawyers-volunteer" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => scrollToSection(tab.id)}
              className="inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-sm border border-hairline bg-surface px-4 py-2 text-xs font-bold whitespace-nowrap text-ink transition-colors hover:border-green-mid hover:bg-green-wash hover:text-green-deep sm:text-sm"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Section 1: Eligibility & Case Referral */}
      <Section id="eligibility">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Case Intake Standards"
              title="Qualifying Pro Bono Defense Mandates"
              lede="Our Legal Defense Corps takes up verified indigent matters at zero legal fee to the citizen or family."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {LEGAL_CASE_ELIGIBILITY.map((item) => (
                <article
                  key={item.title}
                  className="rounded-sm border border-hairline bg-surface p-5 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Gavel className="size-4 text-green-deep" />
                    <Badge
                      variant="outline"
                      className={
                        item.urgency === "High Priority"
                          ? "border-brand-red/30 bg-brand-red-wash text-brand-red"
                          : "border-emerald-200 bg-emerald-50 text-emerald-800"
                      }
                    >
                      {item.urgency}
                    </Badge>
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {item.criteria}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <Reveal className="rounded-sm border border-emerald-200 bg-emerald-950 p-6 text-white shadow-lift sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-300">
              <ShieldCheck className="size-3.5" />
              <span>Confidential Legal Referral Desk</span>
            </div>

            <h3 className="mt-4 font-display text-2xl font-bold text-white">
              Need Urgent Free Representation for an Indigent Citizen?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-emerald-100/85">
              Families, custodial welfare desks, and community elders can submit a case referral
              summary with full name, detention facility or court, offense/dispute summary, and
              contact phone.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-emerald-100">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-300" />
                <span>Initial indigence screening within 24–48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-300" />
                <span>
                  Matched with a Nigerian Bar Association verified practitioner in the state
                  jurisdiction
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-300" />
                <span>Zero legal retainer or consultation fees</span>
              </li>
            </ul>

            <div className="mt-7 flex flex-col gap-3">
              <a
                href={`mailto:${org.email}?subject=${encodeURIComponent(
                  "Pro Bono Legal Aid Case Referral - ARF Legal Desk",
                )}&body=${encodeURIComponent(
                  "Client / Detainee Full Name:\nState & Court / Facility:\nSummary of Legal Issue:\nEmergency Contact Phone:\n",
                )}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-300"
              >
                <Mail className="size-4" />
                <span>Email Confidential Case Referral</span>
              </a>
              <Button asChild variant="onDarkOutline" size="lg" className="min-h-12">
                <Link to="/contact">Use Secretariat Referral Form</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Section 2: Verified Lawyer Directory */}
      <Section id="directory" tone="muted">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Bar Registry Directory"
            title="Verified Pro Bono Legal Advocates"
            lede="Search Bar-admitted counsel across active jurisdictions. Newly enrolled advocates appear automatically after registration."
          />

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-sm border border-hairline bg-background px-4 py-3 text-center">
              <span className="block font-display text-2xl font-extrabold text-green-deep">
                {stats.advocateCount}
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                Active Counsel
              </span>
            </div>
            <div className="rounded-sm border border-hairline bg-background px-4 py-3 text-center">
              <span className="block font-display text-2xl font-extrabold text-brand-red">
                {stats.totalCases}+
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">Cases Won</span>
            </div>
            <div className="rounded-sm border border-hairline bg-background px-4 py-3 text-center">
              <span className="block font-display text-2xl font-extrabold text-ink">
                {stats.jurisdictions}
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">Jurisdictions</span>
            </div>
          </div>
        </div>

        {/* Directory Search & Filter Controls */}
        <div className="mt-10 grid gap-3 rounded-sm border border-hairline bg-background p-4 shadow-2xs sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, chambers, university, Bar ID..."
              className="min-h-11 pl-9"
            />
          </div>

          <select
            aria-label="Filter advocates by state jurisdiction"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="min-h-11 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {availableStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter advocates by practice area"
            value={practiceFilter}
            onChange={(e) => setPracticeFilter(e.target.value)}
            className="min-h-11 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {LEGAL_PRACTICE_FILTERS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter advocates by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-h-11 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Active Pro Bono">Active Pro Bono</option>
            <option value="Verified Advocate">Verified Advocate</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>

        {/* Directory Results Grid */}
        {filteredLawyers.length === 0 ? (
          <div className="mt-8 rounded-sm border border-dashed border-hairline bg-background px-6 py-14 text-center">
            <Scale className="mx-auto size-10 text-muted-foreground/60" />
            <h3 className="mt-4 font-display text-lg font-bold text-ink">
              No advocates matched your current filters
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Reset filters or contact our Legal Desk for cross-state referral coverage.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-5 min-h-11"
              onClick={() => {
                setSearchQuery("");
                setStateFilter("All States");
                setPracticeFilter("All Practice Areas");
                setStatusFilter("All Statuses");
              }}
            >
              Reset Directory Filters
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLawyers.map((lawyer) => (
              <article
                key={lawyer.id}
                className="flex flex-col justify-between rounded-sm border border-hairline bg-background p-6 shadow-2xs transition-all hover:border-green-mid hover:shadow-lift"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green-wash font-display text-sm font-extrabold text-green-deep">
                        {getInitials(lawyer.fullName)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-base font-bold text-ink">
                          {lawyer.fullName}
                        </h3>
                        <p className="truncate text-xs text-muted-foreground">
                          {lawyer.lawFirm || "Independent Pro Bono Counsel"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-[11px] font-bold text-emerald-800"
                    >
                      {lawyer.status}
                    </Badge>
                    <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                      {lawyer.id}
                    </span>
                  </div>

                  <dl className="mt-4 space-y-2 border-t border-hairline pt-4 text-xs">
                    <div className="flex items-center gap-2 text-ink-soft">
                      <MapPin className="size-3.5 shrink-0 text-green-mid" />
                      <span>
                        Jurisdiction:{" "}
                        <strong className="text-ink">
                          {lawyer.jurisdictionState || "Nigeria"}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-ink-soft">
                      <GraduationCap className="size-3.5 shrink-0 text-green-mid" />
                      <span className="truncate">
                        {lawyer.university} (Call {lawyer.callToBarYear})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-ink-soft">
                      <Award className="size-3.5 shrink-0 text-brand-red" />
                      <span>
                        <strong className="text-ink">{lawyer.casesWon} documented cases won</strong>
                      </span>
                    </div>
                  </dl>

                  {lawyer.practiceAreas && lawyer.practiceAreas.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {lawyer.practiceAreas.slice(0, 2).map((area) => (
                        <span
                          key={area}
                          className="rounded-xs border border-hairline bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-soft"
                        >
                          {area}
                        </span>
                      ))}
                      {lawyer.practiceAreas.length > 2 && (
                        <span className="rounded-xs bg-surface px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                          +{lawyer.practiceAreas.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-hairline pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11 w-full justify-center gap-2 text-xs font-bold"
                    onClick={() => setSelectedAdvocate(lawyer)}
                  >
                    <Eye className="size-4" />
                    <span>View Advocate Profile &amp; Refer</span>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      {/* Section 3: Legal Bar Onboarding Form */}
      <LawyersVolunteerSection id="lawyers-volunteer" />

      {/* General Volunteering Bridge */}
      <Section tone="muted">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-xl font-bold text-ink">
              Not a legal practitioner, but want to serve?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Join our General Humanitarian Volunteer Corps or register as an official citizen
              member nationwide.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="min-h-12 gap-2">
              <Link to="/volunteer">
                <Users className="size-4" />
                <span>General Volunteer Form</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-12">
              <Link to="/membership">Become a Member</Link>
            </Button>
          </div>
        </div>
      </Section>

      <DonateBand />

      {/* Advocate Profile & Referral Dialog */}
      <Dialog
        open={selectedAdvocate !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedAdvocate(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {selectedAdvocate && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green-wash font-display text-sm font-extrabold text-green-deep">
                    {getInitials(selectedAdvocate.fullName)}
                  </div>
                  <div>
                    <DialogTitle>{selectedAdvocate.fullName}</DialogTitle>
                    <DialogDescription className="font-mono text-xs">
                      {selectedAdvocate.id} · Call to Bar {selectedAdvocate.callToBarYear}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2 text-sm">
                {selectedAdvocate.bio && (
                  <p className="leading-relaxed text-muted-foreground">{selectedAdvocate.bio}</p>
                )}

                <dl className="grid gap-3 text-xs sm:grid-cols-2">
                  <div className="rounded-xs border border-hairline bg-surface p-3">
                    <dt className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                      <Building2 className="size-3.5" />
                      <span>Chambers / Firm</span>
                    </dt>
                    <dd className="mt-1 font-bold text-ink">
                      {selectedAdvocate.lawFirm || "Independent Practice"}
                    </dd>
                  </div>
                  <div className="rounded-xs border border-hairline bg-surface p-3">
                    <dt className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                      <MapPin className="size-3.5" />
                      <span>Primary Jurisdiction</span>
                    </dt>
                    <dd className="mt-1 font-bold text-ink">
                      {selectedAdvocate.jurisdictionState || "Nigeria"}
                    </dd>
                  </div>
                  <div className="rounded-xs border border-hairline bg-surface p-3">
                    <dt className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                      <GraduationCap className="size-3.5" />
                      <span>Alma Mater (LL.B)</span>
                    </dt>
                    <dd className="mt-1 font-bold text-ink">{selectedAdvocate.university}</dd>
                  </div>
                  <div className="rounded-xs border border-hairline bg-surface p-3">
                    <dt className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                      <Award className="size-3.5" />
                      <span>Track Record</span>
                    </dt>
                    <dd className="mt-1 font-bold text-green-deep">
                      {selectedAdvocate.casesWon} cases won
                    </dd>
                  </div>
                </dl>

                {selectedAdvocate.languages && selectedAdvocate.languages.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe2 className="size-3.5 shrink-0 text-green-mid" />
                    <span>
                      Languages:{" "}
                      <strong className="text-ink">{selectedAdvocate.languages.join(", ")}</strong>
                    </span>
                  </div>
                )}

                {selectedAdvocate.practiceAreas && selectedAdvocate.practiceAreas.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-ink uppercase">Pro Bono Focus Areas</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selectedAdvocate.practiceAreas.map((area) => (
                        <Badge key={area} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
                <a
                  href={`mailto:${org.email}?subject=${encodeURIComponent(
                    `Case Assignment Request — ${selectedAdvocate.fullName} (${selectedAdvocate.id})`,
                  )}&body=${encodeURIComponent(
                    `Requested Counsel: ${selectedAdvocate.fullName} (${selectedAdvocate.id})\nJurisdiction: ${selectedAdvocate.jurisdictionState || "Nigeria"}\n\nCase Summary:\n`,
                  )}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-green-deep px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-green-mid"
                >
                  <Mail className="size-4" />
                  <span>Request Assignment via ARF Desk</span>
                </a>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  onClick={() => setSelectedAdvocate(null)}
                >
                  Close Profile
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Filter,
  Heart,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { DonateBand, Section } from "@/components/site/blocks";
import { FoodDistributionSection } from "@/components/site/FoodDistributionSection";
import { RamadanSupportSection } from "@/components/site/RamadanSupportSection";
import { VisuallyImpairedSchoolSection } from "@/components/site/VisuallyImpairedSchoolSection";
import { FootballTournamentSection } from "@/components/site/FootballTournamentSection";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  DISBURSEMENT_PROTOCOL,
  ELIGIBILITY_GROUPS,
  RELIEF_CHANNELS,
  RELIEF_TARGET_FILTERS,
  type ReliefFilterCategory,
} from "@/data/relief";
import { org } from "@/data/site";

const title = "Relief Disbursements & Eligibility — Abba Roller Foundation";
const description =
  "Multi-channel humanitarian relief disbursements across Northern Nigeria: eligibility criteria, anti-diversion protocol, weekly feeding, 10-state Ramadan aid, medical bill settlement, and school outreach.";

export const Route = createFileRoute("/relief")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ReliefPage,
});

const SUBPAGE_ANCHORS = [
  { label: "Channels & Eligibility", id: "eligibility" },
  { label: "Weekly Feeding", id: "food-distribution" },
  { label: "Ramadan 10-State", id: "ramadan-support" },
  { label: "Dutse School & Care", id: "dutse-outreach" },
  { label: "Youth Championship", id: "football-tournament" },
] as const;

function ReliefPage() {
  const [selectedFilter, setSelectedFilter] = useState<ReliefFilterCategory>("All Channels");

  const visibleChannels =
    selectedFilter === "All Channels"
      ? RELIEF_CHANNELS
      : RELIEF_CHANNELS.filter((c) => c.category === selectedFilter);

  const jumpToAnchor = (id: string) => {
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
        eyebrow="Multi-Channel Relief"
        title="Direct Relief Disbursements & Eligibility"
        lede="Structured, zero-middleman humanitarian assistance reaching vulnerable households, indigent hospital patients, visually impaired students, and adolescent girls across 10 Nigerian states."
        crumbs={[{ label: "Relief Disbursements" }]}
      >
        <div className="grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-sm border border-white/15 bg-white/10 p-3.5 backdrop-blur-xs">
            <span className="block text-[10px] font-bold tracking-wider text-brand-red-wash uppercase">
              Ramadan Corridor
            </span>
            <p className="mt-1 font-display text-xl font-extrabold text-on-dark">1,500+ Packs</p>
          </div>
          <div className="rounded-sm border border-white/15 bg-white/10 p-3.5 backdrop-blur-xs">
            <span className="block text-[10px] font-bold tracking-wider text-brand-red-wash uppercase">
              Weekly Feeding
            </span>
            <p className="mt-1 font-display text-xl font-extrabold text-on-dark">250+ Meals/Wk</p>
          </div>
          <div className="rounded-sm border border-white/15 bg-white/10 p-3.5 backdrop-blur-xs">
            <span className="block text-[10px] font-bold tracking-wider text-brand-red-wash uppercase">
              Hospital &amp; Care
            </span>
            <p className="mt-1 font-display text-xl font-extrabold text-on-dark">480+ Patients</p>
          </div>
          <div className="rounded-sm border border-white/15 bg-white/10 p-3.5 backdrop-blur-xs">
            <span className="block text-[10px] font-bold tracking-wider text-brand-red-wash uppercase">
              Applicant Fee
            </span>
            <p className="mt-1 font-display text-xl font-extrabold text-amber-300">100% Free</p>
          </div>
        </div>
      </PageHeader>

      {/* Sticky Sub-Navigation Bar */}
      <nav
        aria-label="Relief sections"
        className="sticky top-18 z-30 border-b border-hairline bg-background/95 backdrop-blur-md md:top-20"
      >
        <div className="shell flex items-center gap-2 overflow-x-auto py-2.5">
          {SUBPAGE_ANCHORS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => jumpToAnchor(item.id)}
              className="inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-sm border border-hairline bg-surface px-4 py-2 text-xs font-bold whitespace-nowrap text-ink transition-colors hover:border-green-mid hover:bg-green-wash hover:text-green-deep sm:text-sm"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Section 1: Channels & Filter */}
      <Section id="eligibility">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Active Disbursement Matrix"
            title="Four Verified Channels to Frontline Communities"
            lede="Select a relief sector to inspect delivery scale, target beneficiaries, and on-ground verification mechanisms."
          />

          <div
            role="group"
            aria-label="Filter relief channels"
            className="flex flex-wrap items-center gap-2"
          >
            <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
              <Filter className="size-3.5" />
              <span>Filter:</span>
            </span>
            {RELIEF_TARGET_FILTERS.map((filterName) => {
              const active = selectedFilter === filterName;
              return (
                <button
                  key={filterName}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedFilter(filterName)}
                  className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    active
                      ? "bg-green-deep text-white shadow-xs"
                      : "border border-hairline bg-surface text-ink-soft hover:border-green-mid hover:text-green-deep"
                  }`}
                >
                  {filterName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {visibleChannels.map((channel, idx) => (
            <Reveal
              key={channel.id}
              delay={idx * 70}
              as="article"
              className="flex flex-col justify-between rounded-sm border border-hairline bg-surface p-6 shadow-2xs transition-all hover:border-green-mid/50 hover:shadow-lift sm:p-7"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-bold tracking-wider text-brand-red uppercase">
                    {channel.kicker}
                  </span>
                  <span className="rounded-full bg-green-wash px-3 py-1 text-[11px] font-bold text-green-deep">
                    {channel.cadence}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-xl font-bold text-ink">{channel.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {channel.summary}
                </p>

                <dl className="mt-5 space-y-2 rounded-xs border border-hairline bg-background p-4 text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <dt className="font-semibold text-muted-foreground">Verified Scale</dt>
                    <dd className="text-right font-bold text-green-deep">{channel.scaleMetric}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="font-semibold text-muted-foreground">Coverage</dt>
                    <dd className="text-right font-medium text-ink">{channel.coverage}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="font-semibold text-muted-foreground">Audit Check</dt>
                    <dd className="text-right text-ink-soft">{channel.verificationMethod}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {channel.targetGroups.map((group) => (
                    <span
                      key={group}
                      className="rounded-xs border border-hairline bg-background px-2.5 py-1 text-[11px] font-semibold text-ink-soft"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-hairline pt-4">
                {channel.anchorId && (
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="min-h-11 gap-2"
                    onClick={() => jumpToAnchor(channel.anchorId!)}
                  >
                    <span>Inspect Field Section</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                )}
                {channel.campaignSlug && (
                  <Button asChild variant="outline" size="sm" className="min-h-11 gap-2">
                    <Link to="/campaigns/$slug" params={{ slug: channel.campaignSlug }}>
                      <span>Read Campaign Dossier</span>
                    </Link>
                  </Button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Section 2: Transparent Eligibility Matrix */}
      <Section tone="muted">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Eligibility & Access Rules"
            title="Who Qualifies for ARF Relief Support"
            lede="Clear, publicly documented vulnerability criteria ensure humanitarian resources reach households with acute need without favouritism."
          />
          <div className="inline-flex items-center gap-2 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-900">
            <ShieldCheck className="size-4 shrink-0 text-emerald-700" />
            <span>Zero-Fee Charter: Beneficiaries never pay processing charges.</span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ELIGIBILITY_GROUPS.map((item, idx) => (
            <Reveal
              key={item.category}
              delay={idx * 60}
              as="article"
              className="flex flex-col justify-between rounded-sm border border-hairline bg-background p-6 shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-2 text-green-mid">
                  <ClipboardCheck className="size-4 shrink-0" />
                  <span className="text-[11px] font-bold tracking-wider uppercase">
                    Beneficiary Profile 0{idx + 1}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-ink">{item.category}</h3>

                <div className="mt-4 space-y-3 text-xs leading-relaxed">
                  <div>
                    <p className="font-bold text-ink">Qualifying Criteria</p>
                    <p className="mt-1 text-muted-foreground">{item.qualifyingCriteria}</p>
                  </div>
                  <div>
                    <p className="font-bold text-ink">Verification &amp; Referral</p>
                    <p className="mt-1 text-muted-foreground">{item.nominationPathway}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-hairline pt-3 text-xs font-semibold text-green-deep">
                Cadence: {item.disbursementCadence}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Section 3: 4-Step Anti-Diversion Protocol & Referral CTA */}
      <Section>
        <SectionHeading
          eyebrow="Operational Governance"
          title="4-Step Anti-Diversion Disbursement Protocol"
          lede="Every parcel, medical invoice settlement, and sanitary pack follows a documented field audit chain from nomination to publication."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DISBURSEMENT_PROTOCOL.map((step, idx) => (
            <Reveal
              key={step.step}
              delay={idx * 70}
              className="rounded-sm border-t-4 border-brand-red bg-surface p-6"
            >
              <span className="font-display text-3xl font-black text-brand-red">{step.step}</span>
              <h3 className="mt-3 font-display text-base font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
            </Reveal>
          ))}
        </div>

        {/* Community Nomination & Support Bar */}
        <Reveal className="mt-12 grid gap-6 rounded-sm bg-green-deep p-6 text-on-dark sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow text-brand-red-wash">
              Institutional Referrals &amp; Ward Nominations
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold text-white">
              Representing a clinic, school, or community ward in need?
            </h3>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-on-dark-muted">
              Hospital social welfare officers, school principals, and traditional ward leaders can
              submit direct beneficiary nominations or indigent legal referrals through the
              Secretariat Desk at <strong className="text-white">{org.email}</strong>.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button
              asChild
              size="lg"
              className="min-h-12 bg-amber-400 font-bold text-slate-950 hover:bg-amber-300"
            >
              <Link to="/contact">
                <CheckCircle2 className="mr-2 size-4" />
                Submit Community Nomination
              </Link>
            </Button>
            <div className="grid grid-cols-2 gap-2.5">
              <Button asChild variant="onDarkOutline" size="sm" className="min-h-11">
                <Link to="/chapters">
                  <MapPin className="mr-1.5 size-3.5" />
                  Chapters
                </Link>
              </Button>
              <Button asChild variant="give" size="sm" className="min-h-11">
                <Link to="/donate">
                  <Heart className="mr-1.5 size-3.5 fill-white" />
                  Fund Aid
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Migrated Rich Field Operations */}
      <FoodDistributionSection id="food-distribution" />
      <RamadanSupportSection id="ramadan-support" />
      <VisuallyImpairedSchoolSection id="dutse-outreach" />
      <FootballTournamentSection id="football-tournament" />

      <Section tone="muted">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-xl font-bold text-ink">
              Want to deploy alongside our relief teams on the ground?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Register as a regional citizen member or join the General Volunteer Corps across your
              Local Government Area.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="min-h-12 gap-2">
              <Link to="/membership">
                <Users className="size-4" />
                <span>Become a Member</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-12">
              <Link to="/legal-aid">Explore Pro Bono Legal Aid</Link>
            </Button>
          </div>
        </div>
      </Section>

      <DonateBand />
    </>
  );
}

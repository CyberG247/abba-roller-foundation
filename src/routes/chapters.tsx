import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  Scale,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { DonateBand, Section } from "@/components/site/blocks";
import {
  CHAPTER_GOVERNANCE_STANDARDS,
  CHAPTER_ZONE_FILTERS,
  type ChapterZone,
  REGIONAL_CHAPTERS,
} from "@/data/chapters";
import { getLawyersList, type LawyerVolunteer } from "@/data/lawyersStore";
import { loadMembersFromStorage, type Member } from "@/data/membershipStore";
import { ALL_STATES } from "@/data/nigeriaStatesLgas";

const title = "Regional Chapter Coordination — Abba Roller Foundation";
const description =
  "Explore Abba Roller Foundation state and LGA chapters across Jigawa, Kano, 10 Northern Ramadan corridor states, FCT Abuja, and nationwide 36-state membership coordination.";

export const Route = createFileRoute("/chapters")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ChaptersPage,
});

function getTierBadgeStyle(tier: string): string {
  switch (tier) {
    case "Primary Operations Hub":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "Urban & Skills Hub":
      return "border-sky-200 bg-sky-50 text-sky-800";
    case "National Policy & Legal Liaison":
      return "border-amber-200 bg-amber-50 text-amber-900";
    default:
      return "border-hairline bg-surface text-ink-soft";
  }
}

function ChaptersPage() {
  const [zoneFilter, setZoneFilter] = useState<ChapterZone>("All Zones");
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [lawyers, setLawyers] = useState<LawyerVolunteer[]>([]);

  useEffect(() => {
    const refresh = () => {
      setMembers(loadMembersFromStorage());
      setLawyers(getLawyersList());
    };
    refresh();
    window.addEventListener("arf_members_updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("arf_members_updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const countsByState = useMemo(() => {
    const memberMap = new Map<string, number>();
    for (const m of members) {
      if (m.status === "Removed") continue;
      const key = m.state.trim().toLowerCase();
      memberMap.set(key, (memberMap.get(key) ?? 0) + 1);
    }
    const lawyerMap = new Map<string, number>();
    for (const l of lawyers) {
      if (l.status === "Removed") continue;
      const raw = (l.jurisdictionState || "").trim().toLowerCase();
      const normalized = raw === "fct abuja" ? "federal capital territory" : raw;
      if (normalized) {
        lawyerMap.set(normalized, (lawyerMap.get(normalized) ?? 0) + 1);
      }
    }
    return { memberMap, lawyerMap };
  }, [members, lawyers]);

  const filteredChapters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return REGIONAL_CHAPTERS.filter((chapter) => {
      if (zoneFilter !== "All Zones" && chapter.zone !== zoneFilter) {
        return false;
      }
      if (!q) return true;
      return (
        chapter.displayName.toLowerCase().includes(q) ||
        chapter.headquarters.toLowerCase().includes(q) ||
        chapter.tier.toLowerCase().includes(q) ||
        chapter.activeLgas.some((lga) => lga.toLowerCase().includes(q)) ||
        chapter.focusMandates.some((m) => m.toLowerCase().includes(q))
      );
    });
  }, [zoneFilter, searchQuery]);

  return (
    <>
      <PageHeader
        eyebrow="Nationwide Chapter Network"
        title="Regional Chapter & LGA Coordination"
        lede="Rooted in Jigawa and Kano States and active across a 10-state northern humanitarian corridor, with open citizen onboarding across all 36 states and FCT Abuja."
        crumbs={[{ label: "Regional Chapters" }]}
      >
        <div className="grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-sm border border-white/15 bg-white/10 p-3.5 backdrop-blur-xs">
            <span className="block text-[10px] font-bold tracking-wider text-brand-red-wash uppercase">
              Active Relief States
            </span>
            <p className="mt-1 font-display text-xl font-extrabold text-on-dark">10+ States</p>
          </div>
          <div className="rounded-sm border border-white/15 bg-white/10 p-3.5 backdrop-blur-xs">
            <span className="block text-[10px] font-bold tracking-wider text-brand-red-wash uppercase">
              Core Jigawa/Kano
            </span>
            <p className="mt-1 font-display text-xl font-extrabold text-on-dark">14 Core LGAs</p>
          </div>
          <div className="rounded-sm border border-white/15 bg-white/10 p-3.5 backdrop-blur-xs">
            <span className="block text-[10px] font-bold tracking-wider text-brand-red-wash uppercase">
              National Coverage
            </span>
            <p className="mt-1 font-display text-xl font-extrabold text-amber-300">
              {ALL_STATES.length} States/FCT
            </p>
          </div>
          <div className="rounded-sm border border-white/15 bg-white/10 p-3.5 backdrop-blur-xs">
            <span className="block text-[10px] font-bold tracking-wider text-brand-red-wash uppercase">
              Active Registry
            </span>
            <p className="mt-1 font-display text-xl font-extrabold text-on-dark">
              {members.length} Members
            </p>
          </div>
        </div>
      </PageHeader>

      {/* Interactive Chapter Finder */}
      <Section>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Regional Chapters Directory"
            title="Select Your State Hub or Relief Corridor"
            lede="Review active Local Government Areas, field mandates, and join your state chapter directly via the pre-selected membership funnel."
          />

          <div className="flex flex-wrap gap-2">
            {CHAPTER_ZONE_FILTERS.map((zone) => {
              const active = zoneFilter === zone;
              return (
                <button
                  key={zone}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setZoneFilter(zone)}
                  className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    active
                      ? "bg-green-deep text-white shadow-xs"
                      : "border border-hairline bg-surface text-ink-soft hover:border-green-mid hover:text-green-deep"
                  }`}
                >
                  {zone}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by state, LGA (e.g. Gumel, Dutse, Dala), or mandate..."
              className="min-h-11 pl-9"
            />
          </div>
          <p className="text-xs font-semibold text-muted-foreground">
            Showing {filteredChapters.length} of {REGIONAL_CHAPTERS.length} coordinated chapter hubs
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredChapters.map((chapter, idx) => {
            const stateKeyLower = chapter.stateKey.toLowerCase();
            const memberCount = countsByState.memberMap.get(stateKeyLower) ?? 0;
            const lawyerCount = countsByState.lawyerMap.get(stateKeyLower) ?? 0;

            return (
              <Reveal
                key={chapter.id}
                delay={idx * 50}
                as="article"
                className="flex flex-col justify-between rounded-sm border border-hairline bg-surface p-6 shadow-2xs transition-all hover:border-green-mid/60 hover:shadow-lift"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-bold ${getTierBadgeStyle(chapter.tier)}`}
                    >
                      {chapter.tier}
                    </Badge>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {chapter.zone}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-bold text-ink">
                      {chapter.displayName}
                    </h3>
                    <span className="text-xs font-bold text-green-deep">
                      {chapter.baselineBeneficiaries}
                    </span>
                  </div>

                  <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-brand-red">
                    <Building2 className="size-3.5 shrink-0" />
                    <span>Hub HQ: {chapter.headquarters}</span>
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {chapter.summary}
                  </p>

                  {/* Live Registry Pill Strip */}
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xs border border-hairline bg-background p-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Users className="size-3.5 text-green-mid" />
                      <span className="text-muted-foreground">
                        <strong className="text-ink">{memberCount}</strong> members
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Scale className="size-3.5 text-green-deep" />
                      <span className="text-muted-foreground">
                        <strong className="text-ink">{lawyerCount}</strong> Bar counsel
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                      Coordinated LGAs
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {chapter.activeLgas.map((lga) => (
                        <span
                          key={lga}
                          className="rounded-xs border border-hairline bg-background px-2 py-0.5 text-[11px] font-medium text-ink-soft"
                        >
                          {lga}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ul className="mt-4 space-y-1.5 border-t border-hairline pt-3 text-xs text-ink-soft">
                    {chapter.focusMandates.map((mandate) => (
                      <li key={mandate} className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-mid" />
                        <span>{mandate}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-col gap-2 border-t border-hairline pt-4">
                  <Button asChild className="min-h-11 w-full gap-2 font-bold">
                    <Link to="/membership" search={{ state: chapter.stateKey }}>
                      <span>Join {chapter.displayName} Chapter</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="min-h-11 w-full text-xs font-semibold"
                  >
                    <Link to="/contact">Contact Chapter Liaison</Link>
                  </Button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* 36-State Expansion Banner */}
      <Section tone="muted">
        <Reveal className="rounded-sm border border-hairline bg-background p-6 shadow-2xs sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-brand-red uppercase">
                <MapPin className="size-3.5" />
                <span>National Citizen Expansion</span>
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                Register From Any of Nigeria&apos;s 36 States &amp; FCT Abuja
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                While our primary relief distribution and hospital debt-relief corridors are
                concentrated across Jigawa, Kano, and the 10-state northern belt, our Membership
                &amp; Volunteer Registry supports all 774 LGAs nationwide so local citizens can
                organize verified chapters anywhere in Nigeria.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="min-h-12 gap-2 font-bold">
                <Link to="/membership">
                  <Users className="size-4" />
                  <span>Open 36-State Registration Form</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-h-12">
                <Link to="/impact">Inspect Regional Impact Breakdown</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Chapter Governance Standards */}
      <Section>
        <SectionHeading
          eyebrow="Chapter Governance"
          title="Operational Protocols Across Every State Hub"
          lede="Every local chapter operates under unified transparency, zero-fee, and direct-accountability rules set by the Foundation Secretariat."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CHAPTER_GOVERNANCE_STANDARDS.map((item, idx) => (
            <Reveal
              key={item.title}
              delay={idx * 70}
              className="rounded-sm border border-hairline bg-surface p-6"
            >
              <ShieldCheck className="size-5 text-green-deep" />
              <h3 className="mt-3 font-display text-base font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      <DonateBand />
    </>
  );
}

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
  GraduationCap,
  Sprout,
  ShieldAlert,
} from "lucide-react";

import { AnimatedCounter } from "./AnimatedCounter";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RegionalStateData = {
  id: "all" | "jigawa" | "kano";
  name: string;
  badge: string;
  totalBeneficiaries: string;
  lgasCount: string;
  lgasList: string[];
  summary: string;
  metrics: {
    label: string;
    value: string;
    subtext: string;
    icon: "women" | "youth" | "food" | "health" | "trade";
  }[];
  highlights: string[];
};

const regionalStatisticsData: RegionalStateData[] = [
  {
    id: "all",
    name: "Northern Nigeria Corridor",
    badge: "Regional Summary",
    totalBeneficiaries: "15,400+",
    lgasCount: "14 Local Government Areas",
    lgasList: [
      "Gumel",
      "Dutse",
      "Hadejia",
      "Ringim",
      "Birnin Kudu",
      "Babura",
      "Kano Municipal",
      "Dala",
      "Fagge",
      "Nassarawa",
      "Gwale",
      "Tarauni",
      "Ungogo",
    ],
    summary:
      "A concentrated humanitarian and developmental footprint spanning urban and rural communities from Jigawa State across to Kano State, prioritizing women, youth, indigent patients, and vulnerable households.",
    metrics: [
      {
        label: "Total Lives Impacted",
        value: "15,400+",
        subtext: "Across Jigawa & Kano States",
        icon: "women",
      },
      {
        label: "Food & Relief Disbursed",
        value: "6,800+",
        subtext: "Households & Custodial Facilities",
        icon: "food",
      },
      {
        label: "Youth Mentored & Trained",
        value: "3,800+",
        subtext: "Vocational & Enterprise Programs",
        icon: "youth",
      },
      {
        label: "Girl-Child & Menstrual Support",
        value: "2,150+",
        subtext: "Sanitary Pads & Health Education",
        icon: "health",
      },
    ],
    highlights: [
      "Direct on-the-ground interventions with verified accountability",
      "Dual state operations covering primary rural and dense urban centers",
      "Holistic focus on immediate relief plus long-term capacity building",
    ],
  },
  {
    id: "jigawa",
    name: "Jigawa State",
    badge: "Primary Operations Hub",
    totalBeneficiaries: "8,650+",
    lgasCount: "6 Local Government Areas",
    lgasList: ["Gumel", "Dutse", "Hadejia", "Ringim", "Birnin Kudu", "Babura"],
    summary:
      "Our foundational operating theater, featuring flagship campaigns in menstrual health dignity, clinical hospital debt relief, and custodial centre humanitarian aid.",
    metrics: [
      {
        label: "Pad Up Nigerian Girls",
        value: "1,200+",
        subtext: "Schoolgirls in Gumel & environs",
        icon: "women",
      },
      {
        label: "Hospital Bill Relief",
        value: "480+",
        subtext: "Patients at Gumel General Hospital",
        icon: "health",
      },
      {
        label: "Correctional Centre Aid",
        value: "350+",
        subtext: "Inmates supported with food staples",
        icon: "food",
      },
      {
        label: "Women Petty-Trade Capital",
        value: "920+",
        subtext: "Direct financial livelihood grants",
        icon: "trade",
      },
    ],
    highlights: [
      "Gumel General Hospital medical bill settlement and hygiene intervention",
      "Distribution of 1,000+ sanitary packs under Pad Up Nigerian Girls",
      "Nutritional relief to Nigerian Correctional Service Custodial Centre",
    ],
  },
  {
    id: "kano",
    name: "Kano State",
    badge: "Urban & Skills Hub",
    totalBeneficiaries: "6,750+",
    lgasCount: "8 Local Government Areas",
    lgasList: ["Kano Municipal", "Dala", "Fagge", "Nassarawa", "Gwale", "Tarauni", "Ungogo"],
    summary:
      "Strategic youth vocational pathways, educational support, artisan empowerment, and emergency household food distribution across Kano's bustling metropolitan and peri-urban hubs.",
    metrics: [
      {
        label: "Youth Vocational Training",
        value: "2,400+",
        subtext: "Skills, tailoring & enterprise cohorts",
        icon: "youth",
      },
      {
        label: "Household Food Aid",
        value: "2,600+",
        subtext: "Vulnerable families & widows assisted",
        icon: "food",
      },
      {
        label: "Girl-Child Learning Kits",
        value: "950+",
        subtext: "Educational supplies & dignity packs",
        icon: "women",
      },
      {
        label: "Women Cooperative Funding",
        value: "800+",
        subtext: "Female artisans & micro-businesses",
        icon: "trade",
      },
    ],
    highlights: [
      "Vocational training cohorts tailored for immediately usable livelihood skills",
      "Targeted household food parcels distributed in high-need metropolitan wards",
      "Active mentorship circles fostering civic participation and entrepreneurship",
    ],
  },
];

export function RegionalStatistics({
  className,
  tone = "default",
  id = "impact",
}: {
  className?: string;
  tone?: "default" | "muted";
  id?: string;
}) {
  const [selectedState, setSelectedState] = useState<"all" | "jigawa" | "kano">("all");
  const activeData = regionalStatisticsData.find((d) => d.id === selectedState)!;

  return (
    <section
      id={id}
      className={`scroll-mt-20 py-20 md:py-28 ${tone === "muted" ? "bg-surface" : "bg-background"} ${className || ""}`}
    >
      <div className="shell">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-green-mid">Regional Impact · Northern Nigeria</p>
            <h2 className="display-2 mt-3 text-ink">
              Beneficiaries Across Jigawa &amp; Kano States
            </h2>
            <p className="lede mt-4 max-w-3xl">
              Honest data documenting community reach from rural councils in Jigawa State to
              metropolitan districts in Kano State.
            </p>
          </div>
          <Button asChild variant="default" size="lg" className="shrink-0">
            <Link to="/impact" className="inline-flex items-center gap-2">
              View Verified Impact
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* State Selector Tabs */}
        <div className="mt-10 flex flex-wrap gap-2.5 border-b border-hairline pb-4">
          {regionalStatisticsData.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedState(tab.id)}
              className={cn(
                "group inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-bold transition-all",
                selectedState === tab.id
                  ? "bg-green-deep text-on-dark shadow-sm"
                  : "bg-surface text-ink-soft hover:bg-muted hover:text-ink border border-hairline",
              )}
            >
              <MapPin
                className={cn(
                  "size-4 transition-transform group-hover:scale-110",
                  selectedState === tab.id ? "text-brand-red-bright" : "text-muted-foreground",
                )}
              />
              <span>{tab.name}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  selectedState === tab.id
                    ? "bg-white/20 text-on-dark"
                    : "bg-hairline text-muted-foreground",
                )}
              >
                {tab.totalBeneficiaries}
              </span>
            </button>
          ))}
        </div>

        {/* Active Tab Content Card */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          {/* Metrics Grid */}
          <Reveal className="space-y-6">
            <div className="rounded-sm border border-hairline bg-surface p-6 sm:p-8 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
                <div>
                  <span className="eyebrow text-brand-red">{activeData.badge}</span>
                  <h3 className="display-3 mt-1 text-ink">{activeData.name}</h3>
                </div>
                <div className="text-right">
                  <span className="block font-display text-3xl font-extrabold text-green-deep sm:text-4xl">
                    <AnimatedCounter key={activeData.id} value={activeData.totalBeneficiaries} />
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Beneficiaries
                  </span>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {activeData.summary}
              </p>

              {/* 4 Metric Cards */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {activeData.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex flex-col justify-between rounded-xs border border-hairline bg-background p-4.5 shadow-2xs transition-all hover:border-green-deep"
                  >
                    <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      {metric.label}
                    </span>
                    <div className="mt-3">
                      <span className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
                        <AnimatedCounter
                          key={`${activeData.id}-${metric.label}`}
                          value={metric.value}
                        />
                      </span>
                      <p className="mt-1 text-xs text-green-mid font-medium">{metric.subtext}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Side Details / Covered LGAs & Verified Highlights */}
          <Reveal delay={120} className="flex flex-col gap-6">
            <div className="flex-1 rounded-sm border border-hairline bg-surface p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-green-deep">
                <MapPin className="size-5 text-brand-red" />
                <h4 className="font-display text-lg font-bold text-ink">
                  Coverage: {activeData.lgasCount}
                </h4>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Active community operational hubs &amp; outreach nodes:
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {activeData.lgasList.map((lga) => (
                  <span
                    key={lga}
                    className="inline-flex items-center rounded-xs border border-hairline bg-background px-3 py-1 text-xs font-semibold text-ink shadow-2xs"
                  >
                    <span className="mr-1.5 size-1.5 rounded-full bg-green-mid" />
                    {lga} LGA
                  </span>
                ))}
              </div>

              <div className="mt-8 border-t border-hairline pt-6">
                <h5 className="font-display text-sm font-bold text-ink">
                  Verified Field Highlights
                </h5>
                <ul className="mt-3 space-y-2.5 text-xs text-muted-foreground">
                  {activeData.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-red" />
                      <span className="leading-normal">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Northern Nigeria Footprint Callout */}
            <div className="relative isolate overflow-hidden rounded-sm bg-green-deep p-6 text-on-dark shadow-sm">
              <div aria-hidden="true" className="motif-grid absolute inset-0 opacity-25" />
              <div className="relative z-10">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-brand-red-wash" />
                  <span className="eyebrow text-brand-red-wash">Regional Reach</span>
                </div>
                <h4 className="mt-2 font-display text-base font-bold text-on-dark">
                  Direct Delivery from Jigawa to Kano
                </h4>
                <p className="mt-2 text-xs text-on-dark-muted leading-relaxed">
                  Every food carton, medical bill subsidy, and sanitary pack is documented and
                  distributed directly in collaboration with local community leadership and
                  authorities.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

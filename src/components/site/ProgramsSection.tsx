import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ProgramCard } from "./blocks";
import { Button } from "@/components/ui/button";
import { campaigns, programs, type Program } from "@/data/site";
import { LazyImage } from "./LazyImage";
import { cn } from "@/lib/utils";

const filterCategories = [
  { label: "All Programmes", value: "all" },
  { label: "Women & Girls", value: "women" },
  { label: "Youth Empowerment", value: "youth" },
  { label: "Education & Skills", value: "education" },
  { label: "Food & Humanitarian", value: "food" },
  { label: "Advocacy", value: "advocacy" },
];

export function ProgramsSection({ id = "programs" }: { id?: string }) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const campaign = campaigns[0];

  const filteredPrograms =
    selectedFilter === "all" ? programs : programs.filter((p) => p.icon === selectedFilter);

  return (
    <section id={id} className="scroll-mt-20 py-20 md:py-28 bg-surface border-t border-hairline">
      <div className="shell">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-green-mid">Our Core Interventions</p>
            <h2 className="display-2 mt-3 text-ink">Programmes Built Around Dignity</h2>
            <p className="lede mt-4 max-w-3xl">
              Five thematic areas designed to bridge the opportunity gap and restore dignity across
              Northern Nigerian communities.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="shrink-0">
            <Link to="/programs" className="inline-flex items-center gap-2">
              All Programmes
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="mt-10 flex flex-wrap gap-2">
          {filterCategories.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setSelectedFilter(filter.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition-all",
                selectedFilter === filter.value
                  ? "border-green-deep bg-green-deep text-on-dark shadow-xs"
                  : "border-hairline bg-background text-ink-soft hover:border-green-deep hover:text-green-deep",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Program Cards Grid */}
        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program, index) => (
            <ProgramCard key={program.slug} program={program} index={index} />
          ))}
        </div>

        {/* Featured Campaign Spotlight: Pad Up Nigerian Girls */}
        {campaign && (
          <Reveal
            delay={150}
            className="mt-16 overflow-hidden rounded-sm border border-hairline bg-background shadow-lift"
          >
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="overflow-hidden">
                <LazyImage
                  src={campaign.image}
                  alt={campaign.imageAlt}
                  aspectRatio="aspect-[3/2]"
                  zoomOnHover
                  width={1200}
                  height={800}
                />
              </div>
              <div className="p-8 sm:p-10 lg:pl-0">
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-red-wash px-3 py-1 text-xs font-bold text-brand-red">
                  <Sparkles className="size-3.5" />
                  <span>Flagship Outreach</span>
                </div>
                <h3 className="display-3 mt-4 text-ink">{campaign.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {campaign.summary}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-mid uppercase">
                  <span>Location: {campaign.location}</span>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="default" size="default">
                    <Link to="/campaigns/$slug" params={{ slug: campaign.slug }}>
                      Read campaign report
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="default">
                    <a href="#donate">Support this campaign</a>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Heart, Quote, Shield } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { LazyImage } from "./LazyImage";
import { Button } from "@/components/ui/button";
import { CMS_PLACEHOLDER, founder } from "@/data/site";

export function FounderSection({ id = "founder" }: { id?: string }) {
  return (
    <section id={id} className="scroll-mt-20 py-20 md:py-28 bg-background border-t border-hairline">
      <div className="shell">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-brand-red">Leadership &amp; Vision</p>
            <h2 className="display-2 mt-3 text-ink">Founder&apos;s Desk</h2>
            <p className="lede mt-4 max-w-3xl">
              A message from {founder.name} ({founder.alias}), Founder &amp; Chairman of Abba Roller
              Foundation.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="shrink-0">
            <Link to="/founder" className="inline-flex items-center gap-2">
              Dedicated Founder Page
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.85fr_1.35fr] lg:gap-16 items-start">
          {/* Left Column: Official Portrait & Profile */}
          <Reveal>
            <div className="overflow-hidden border border-hairline bg-surface p-2 shadow-lift rounded-xs">
              <LazyImage
                src={founder.image}
                alt={founder.portraitAlt}
                aspectRatio="aspect-[4/5]"
                imagePosition="object-top"
                width={768}
                height={1024}
                className="rounded-none"
              />
            </div>
            <div className="mt-4 p-4 rounded-xs border border-hairline bg-surface">
              <h3 className="font-display text-base font-bold text-ink">{founder.name}</h3>
              <p className="text-xs font-semibold text-brand-red uppercase tracking-wider mt-0.5">
                Popularly known as {founder.alias}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{founder.role}</p>
            </div>

            {/* Profile Attributes Table */}
            <dl className="mt-6 divide-y divide-hairline border-y border-hairline text-sm">
              {founder.profile.map((row) => (
                <div key={row.label} className="grid grid-cols-[1.1fr_1.4fr] gap-2 py-3">
                  <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    {row.label}
                  </dt>
                  <dd className="font-semibold text-ink text-xs sm:text-sm">
                    {row.value === CMS_PLACEHOLDER ? (
                      <span className="font-normal text-muted-foreground">To be confirmed</span>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Right Column: Founder Message & Priorities */}
          <Reveal delay={120} className="space-y-6">
            <div className="rounded-sm border-l-4 border-green-deep bg-surface p-6 sm:p-8">
              <Quote className="size-8 text-green-mid opacity-40 mb-3" />
              <p className="font-display text-xl font-bold text-ink leading-snug">
                &ldquo;{founder.lede}&rdquo;
              </p>
            </div>

            <div className="space-y-5 text-base leading-relaxed text-muted-foreground pt-2">
              {founder.message.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* 4 Priority Areas */}
            <div className="pt-6">
              <h4 className="eyebrow text-green-mid">Core Priorities &amp; Focus</h4>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {founder.focusAreas.map((area, index) => (
                  <div
                    key={area}
                    className="flex items-center gap-3 rounded-xs border border-hairline bg-surface p-3.5"
                  >
                    <span className="font-display text-lg font-black text-brand-red">
                      0{index + 1}
                    </span>
                    <span className="text-sm font-bold text-ink">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 flex flex-wrap gap-3">
              <Button asChild variant="give" size="lg">
                <a href="#donate">Support the mission</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#media">Explore recent updates</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

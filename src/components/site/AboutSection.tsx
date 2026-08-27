import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Eye,
  Heart,
  Shield,
  Sparkles,
  Target,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { org, values } from "@/data/site";
import { cn } from "@/lib/utils";

export function AboutSection({ id = "about" }: { id?: string }) {
  return (
    <section id={id} className="scroll-mt-20 py-20 md:py-28 bg-surface border-t border-hairline">
      <div className="shell">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-green-mid">About ARF</p>
            <h2 className="display-2 mt-3 text-ink">Built on Dignity, Opportunity &amp; Trust</h2>
            <p className="lede mt-4 max-w-3xl">
              Abba Roller Foundation was established to close the distance between potential and
              opportunity for young people and women across Northern Nigeria.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="shrink-0">
            <Link to="/about" className="inline-flex items-center gap-2">
              Full About Page
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Mission & Vision Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          <Reveal className="flex flex-col justify-between rounded-sm border border-hairline bg-background p-8 shadow-xs relative overflow-hidden group hover:border-green-deep transition-all">
            <div className="absolute top-0 left-0 h-1.5 w-full bg-green-deep" />
            <div>
              <div className="flex size-12 items-center justify-center rounded-xs bg-green-wash text-green-deep mb-6">
                <Target className="size-6" />
              </div>
              <span className="eyebrow text-green-mid">Our Core Mission</span>
              <h3 className="font-display text-2xl font-bold text-ink mt-2">
                Empowering Youth &amp; Women
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                To empower youth and women through education, skills training, and humanitarian
                support — strengthening the communities they belong to with dignity and sustainable
                livelihood pathways.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-hairline flex items-center gap-2 text-xs font-bold text-green-mid uppercase">
              <CheckCircle2 className="size-4 text-brand-red" />
              <span>Community-anchored interventions</span>
            </div>
          </Reveal>

          <Reveal
            delay={100}
            className="flex flex-col justify-between rounded-sm border border-hairline bg-background p-8 shadow-xs relative overflow-hidden group hover:border-brand-red transition-all"
          >
            <div className="absolute top-0 left-0 h-1.5 w-full bg-brand-red" />
            <div>
              <div className="flex size-12 items-center justify-center rounded-xs bg-brand-red-wash text-brand-red mb-6">
                <Eye className="size-6" />
              </div>
              <span className="eyebrow text-brand-red">Our Enduring Vision</span>
              <h3 className="font-display text-2xl font-bold text-ink mt-2">
                A Future of Equal Dignity
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Communities in which no person is left behind because of where they were born, what
                they lack, or their economic background — creating inclusive opportunities for every
                individual to thrive.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-hairline flex items-center gap-2 text-xs font-bold text-brand-red uppercase">
              <CheckCircle2 className="size-4 text-green-mid" />
              <span>Measurable long-term impact</span>
            </div>
          </Reveal>
        </div>

        {/* Narrative & Approach */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <Reveal delay={150} className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Our approach is deliberately unglamorous and hands-on: we work directly with community
              leaders, schools, healthcare facilities, and custodial centres. We remain engaged
              after each programme concludes and report only what has been independently verified.
            </p>
            <p>
              Operating across the{" "}
              <strong className="text-ink">Jigawa State and Kano State corridor</strong>, the
              Foundation is structured to collaborate with institutional partners, development
              organisations, and government agencies as our outreach grows.
            </p>
          </Reveal>

          <Reveal
            delay={200}
            className="rounded-sm bg-green-deep p-8 text-on-dark shadow-lift relative overflow-hidden"
          >
            <div aria-hidden="true" className="motif-grid absolute inset-0 opacity-30" />
            <div className="relative z-10">
              <span className="eyebrow text-brand-red-wash">Our Working Philosophy</span>
              <blockquote className="mt-3 font-display text-xl font-bold text-on-dark leading-snug">
                &ldquo;Dignity is not a luxury. It is the baseline requirement for every human life
                and community.&rdquo;
              </blockquote>
              <p className="mt-4 text-xs text-on-dark-muted">
                Hon. Usman Aminu Usman (Abba Roller) · Founder &amp; Chairman
              </p>
            </div>
          </Reveal>
        </div>

        {/* Values Grid */}
        <div className="mt-16 pt-12 border-t border-hairline">
          <SectionHeading eyebrow="Guiding Principles" title="Core Values Held from Day One" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <Reveal
                key={value.title}
                delay={index * 50}
                className="rounded-xs border border-hairline bg-background p-6 shadow-2xs hover:border-green-deep transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-green-wash font-display text-xs font-bold text-green-deep">
                    0{index + 1}
                  </span>
                  <h4 className="font-display text-lg font-bold text-ink">{value.title}</h4>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

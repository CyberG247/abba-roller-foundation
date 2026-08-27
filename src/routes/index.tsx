import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Heart, Sparkles, Users, Award, ShieldCheck } from "lucide-react";

import heroGirls from "@/assets/hero-girls.jpg";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LazyImage } from "@/components/site/LazyImage";
import { AnimatedCounter } from "@/components/site/AnimatedCounter";
import { FloatingActions } from "@/components/site/FloatingActions";
import { AboutSection } from "@/components/site/AboutSection";
import { FounderSection } from "@/components/site/FounderSection";
import { ProgramsSection } from "@/components/site/ProgramsSection";
import { MediaSection } from "@/components/site/MediaSection";
import { RegionalStatistics } from "@/components/site/RegionalStatistics";
import { PartnersMarquee } from "@/components/site/PartnersMarquee";
import { GetInvolvedSection } from "@/components/site/GetInvolvedSection";
import { DonationSection } from "@/components/site/DonationSection";
import { ContactSection } from "@/components/site/ContactSection";
import { StoryCard, StatList } from "@/components/site/blocks";
import { impactMetrics, org, stories } from "@/data/site";

const title = "Abba Roller Foundation — Empowering youth and women in Nigeria";
const description = org.description;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* -------------------------------------------------- 1. HERO SECTION */}
      <section id="hero" className="relative isolate overflow-hidden bg-green-deep">
        <LazyImage
          src={heroGirls}
          alt="Schoolgirls in Nigeria smiling during a community outreach session"
          aspectRatio="aspect-auto"
          containerClassName="absolute inset-0 size-full"
          className="size-full object-cover opacity-40"
          width={1920}
          height={1080}
        />
        <div aria-hidden className="absolute inset-0 bg-green-deep/75 backdrop-blur-[1px]" />
        <div aria-hidden className="motif-grid absolute inset-0 opacity-40" />

        <div className="shell relative grid gap-10 pt-36 pb-20 md:pt-44 md:pb-24">
          <Reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-brand-red-wash backdrop-blur-md border border-white/10">
              <span className="flex size-2 rounded-full bg-brand-red-bright animate-pulse" />
              <span>
                {org.shortName} · {org.country} · Jigawa &amp; Kano State Operations
              </span>
            </div>

            <h1 className="display-1 mt-5 text-on-dark">{org.tagline}</h1>
            <p className="lede mt-6 max-w-2xl text-on-dark-muted">{org.description}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild variant="give" size="lg" className="shadow-lift font-bold">
                <a href="#donate">Donate now</a>
              </Button>
              <Button asChild variant="onDarkOutline" size="lg" className="font-semibold">
                <a href="#about">Explore our mission</a>
              </Button>
            </div>
          </Reveal>

          {/* Quick Metrics Live Ticker Strip */}
          <Reveal delay={120} className="mt-6 border-t border-white/15 pt-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
              <div className="rounded-xs border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-red-wash">
                  Total Beneficiaries
                </span>
                <p className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-on-dark">
                  <AnimatedCounter value="15,400+" />
                </p>
                <span className="text-[11px] text-on-dark-muted">Jigawa &amp; Kano Corridor</span>
              </div>

              <div className="rounded-xs border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-red-wash">
                  Covered LGAs
                </span>
                <p className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-on-dark">
                  <AnimatedCounter value="14 LGAs" />
                </p>
                <span className="text-[11px] text-on-dark-muted">Community Councils</span>
              </div>

              <div className="rounded-xs border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-red-wash">
                  Sanitary Packs
                </span>
                <p className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-on-dark">
                  <AnimatedCounter value="1,200+" />
                </p>
                <span className="text-[11px] text-on-dark-muted">Pad Up Nigerian Girls</span>
              </div>

              <div className="rounded-xs border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-red-wash">
                  Direct Delivery
                </span>
                <p className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-on-dark">
                  <AnimatedCounter value="100%" />
                </p>
                <span className="text-[11px] text-on-dark-muted">Verified Field Audit</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------- 2. ABOUT SECTION */}
      <AboutSection id="about" />

      {/* -------------------------------------------------- 3. FOUNDER'S DESK SECTION */}
      <FounderSection id="founder" />

      {/* -------------------------------------------------- 4. PROGRAMMES SECTION */}
      <ProgramsSection id="programs" />

      {/* -------------------------------------------------- 5. MEDIA & UPDATES SECTION */}
      <MediaSection id="media" />

      {/* -------------------------------------------------- 6. REGIONAL BENEFICIARIES STATISTICS & IMPACT */}
      <RegionalStatistics id="impact" tone="muted" />

      {/* -------------------------------------------------- 7. OUR PARTNERS (HORIZONTAL SLIDING MARQUEE) */}
      <PartnersMarquee id="partners" tone="white" />

      {/* -------------------------------------------------- 8. STORIES FROM THE FIELD */}
      <section
        id="stories"
        className="scroll-mt-20 py-20 md:py-28 bg-surface border-t border-hairline"
      >
        <div className="shell">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-green-mid">Field Reports &amp; Reflections</p>
              <h2 className="display-2 mt-3 text-ink">Stories from the Field</h2>
              <p className="lede mt-4 max-w-3xl">
                Personal perspectives and on-the-ground narratives from the communities, hospitals,
                schools, and centres we serve.
              </p>
            </div>
            <Button asChild variant="outline" size="lg" className="shrink-0">
              <Link to="/stories" className="inline-flex items-center gap-2">
                All Stories Archive
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story, index) => (
              <StoryCard key={story.slug} story={story} index={index} compact />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- 9. GET INVOLVED */}
      <GetInvolvedSection id="get-involved" />

      {/* -------------------------------------------------- 10. DONATE SECTION */}
      <DonationSection id="donate" />

      {/* -------------------------------------------------- 11. CONTACT SECTION */}
      <ContactSection id="contact" />

      {/* -------------------------------------------------- FLOATING ACTION & SCROLL PROGRESS */}
      <FloatingActions />
    </>
  );
}

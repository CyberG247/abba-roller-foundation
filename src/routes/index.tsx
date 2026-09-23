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
import { FoodDistributionSection } from "@/components/site/FoodDistributionSection";
import { RamadanSupportSection } from "@/components/site/RamadanSupportSection";
import { VisuallyImpairedSchoolSection } from "@/components/site/VisuallyImpairedSchoolSection";
import { FootballTournamentSection } from "@/components/site/FootballTournamentSection";
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

        <div className="shell relative grid gap-8 pt-28 pb-14 sm:gap-10 sm:pt-36 sm:pb-20 md:pt-44 md:pb-24">
          <Reveal className="max-w-3xl">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-brand-red-wash backdrop-blur-md border border-white/10">
              <span className="flex size-2 shrink-0 rounded-full bg-brand-red-bright animate-pulse" />
              <span className="truncate">
                {org.shortName} · {org.country} · Jigawa &amp; Kano State Operations
              </span>
            </div>

            <h1 className="display-1 mt-4 sm:mt-5 text-on-dark">{org.tagline}</h1>
            <p className="lede mt-4 sm:mt-6 max-w-2xl text-on-dark-muted">{org.description}</p>

            <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Button asChild variant="give" size="lg" className="w-full sm:w-auto shadow-lift font-bold gap-2">
                <a href="#donate">
                  <Heart className="size-4.5 fill-white animate-pulse" />
                  <span>Donate now</span>
                </a>
              </Button>
              <Button asChild variant="onDarkOutline" size="lg" className="w-full sm:w-auto font-semibold">
                <a href="#about">Explore our mission</a>
              </Button>
            </div>
          </Reveal>

          {/* Quick Metrics Live Ticker Strip */}
          <Reveal delay={120} className="mt-4 sm:mt-6 border-t border-white/15 pt-6 sm:pt-8">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4 lg:gap-6">
              <div className="rounded-xs border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-sm">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-red-wash block truncate">
                  Total Beneficiaries
                </span>
                <p className="mt-1 font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-dark truncate">
                  <AnimatedCounter value="15,400+" />
                </p>
                <span className="text-[10px] sm:text-[11px] text-on-dark-muted block truncate">Jigawa &amp; Kano Corridor</span>
              </div>

              <div className="rounded-xs border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-sm">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-red-wash block truncate">
                  Weekly Feeding
                </span>
                <p className="mt-1 font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-dark truncate">
                  <AnimatedCounter value="250+" />
                </p>
                <span className="text-[10px] sm:text-[11px] text-on-dark-muted block truncate">Hot Meals Weekly</span>
              </div>

              <div className="rounded-xs border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-sm">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-red-wash block truncate">
                  Covered LGAs
                </span>
                <p className="mt-1 font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-dark truncate">
                  <AnimatedCounter value="14 LGAs" />
                </p>
                <span className="text-[10px] sm:text-[11px] text-on-dark-muted block truncate">Community Councils</span>
              </div>

              <div className="rounded-xs border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-sm">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-red-wash block truncate">
                  Sanitary Packs
                </span>
                <p className="mt-1 font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-dark truncate">
                  <AnimatedCounter value="1,200+" />
                </p>
                <span className="text-[10px] sm:text-[11px] text-on-dark-muted block truncate">Pad Up Nigerian Girls</span>
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

      {/* -------------------------------------------------- 5. WEEKLY FOOD DISTRIBUTION (250 BENEFICIARIES WEEKLY) */}
      <FoodDistributionSection id="food-distribution" />

      {/* -------------------------------------------------- 6. RAMADAN HUMANITARIAN FOOD RELIEF (1,500 PACKAGES ACROSS 10 STATES) */}
      <RamadanSupportSection id="ramadan-support" />

      {/* -------------------------------------------------- 7. VISUALLY IMPAIRED SCHOOL OUTREACH (DUTSE, JIGAWA STATE) */}
      <VisuallyImpairedSchoolSection id="dutse-outreach" />

      {/* -------------------------------------------------- 8. GRASSROOTS FOOTBALL CHAMPIONSHIP */}
      <FootballTournamentSection id="football-tournament" />

      {/* -------------------------------------------------- 9. MEDIA & UPDATES SECTION */}
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

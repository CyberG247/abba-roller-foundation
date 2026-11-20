import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Heart,
  HeartHandshake,
  MapPin,
  Quote,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";

import heroGirls from "@/assets/hero-girls.jpg";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/site/AnimatedCounter";
import { FloatingActions } from "@/components/site/FloatingActions";
import { LazyImage } from "@/components/site/LazyImage";
import { PartnersMarquee } from "@/components/site/PartnersMarquee";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { StoryCard } from "@/components/site/blocks";
import { founder, org, stories } from "@/data/site";

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

const EXECUTIVE_PATHWAYS = [
  {
    id: "relief",
    eyebrow: "01 · Humanitarian Aid",
    title: "Multi-Channel Relief Disbursements",
    description:
      "Weekly hot meals, 10-state Ramadan food packages, indigent hospital debt settlement, school menstrual dignity packs, and Dutse special-education welfare.",
    badges: ["Eligibility Criteria", "Zero Middlemen", "10 States"],
    icon: HeartHandshake,
    primaryLabel: "Explore Relief & Eligibility",
    primaryTo: "/relief" as const,
    secondaryLabel: "View Field Portfolio →",
    secondaryTo: "/work" as const,
  },
  {
    id: "legal-aid",
    eyebrow: "02 · Justice & Advocacy",
    title: "Pro Bono Legal Aid Network",
    description:
      "Bar-verified courtroom defense for indigent pretrial detainees, widows, and vulnerable citizens—connect with active counsel or submit a confidential case referral.",
    badges: ["Lawyer Directory", "Free Defense", "Bar Verified"],
    icon: Scale,
    primaryLabel: "Browse Lawyer Directory",
    primaryTo: "/legal-aid" as const,
    secondaryLabel: "Join Legal Volunteer Corps →",
    secondaryTo: "/legal-aid" as const,
    secondaryHash: "lawyers-volunteer",
  },
  {
    id: "membership",
    eyebrow: "03 · Citizen Mobilization",
    title: "Nationwide Membership & Chapters",
    description:
      "Join ARF across all 36 states and FCT Abuja. Connect with state and LGA chapters and retrieve your Admin-verified Digital ID Card anytime by phone number.",
    badges: ["36 States + FCT", "Admin-Verified ID", "LGA Chapters"],
    icon: Users,
    primaryLabel: "Register as a Member",
    primaryTo: "/membership" as const,
    secondaryLabel: "View Regional Chapters →",
    secondaryTo: "/chapters" as const,
  },
] as const;

const CREDIBILITY_PILLARS = [
  {
    title: "Direct-to-Beneficiary Verification",
    detail:
      "Hospital invoices, school distributions, and ward parcels are handed directly to verified recipients without intermediaries or applicant fees.",
  },
  {
    title: "Published Campaign Accounting",
    detail:
      "Every completed distribution publishes exact locations, headcounts, and unedited field documentation on our public Impact and Stories pages.",
  },
  {
    title: "Audited LGA Chapter Governance",
    detail:
      "Regional hubs reconcile member registrations and field disbursements alongside local civic elders and partner institutions.",
  },
] as const;

function Home() {
  const latestStories = stories.slice(0, 3);

  return (
    <>
      {/* -------------------------------------------------- BAND 1: AUTHORITATIVE MISSION HERO + TRUST STRIP */}
      <section id="hero" className="relative isolate overflow-hidden bg-green-deep">
        <LazyImage
          src={heroGirls}
          alt="Schoolgirls in Nigeria smiling during an Abba Roller Foundation community outreach session"
          aspectRatio="aspect-auto"
          containerClassName="absolute inset-0 size-full"
          className="size-full object-cover opacity-35"
          width={1920}
          height={1080}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-green-deep/85 via-green-deep/80 to-green-deep/95"
        />
        <div aria-hidden className="motif-grid absolute inset-0 opacity-35" />

        <div className="shell relative grid gap-8 pt-28 pb-14 sm:gap-10 sm:pt-36 sm:pb-20 md:pt-42 md:pb-24">
          <Reveal className="max-w-3xl">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold text-brand-red-wash backdrop-blur-md sm:text-xs">
              <span className="flex size-2 shrink-0 animate-pulse rounded-full bg-brand-red-bright" />
              <span className="truncate">{org.name} · Jigawa, Kano &amp; 10-State Corridor</span>
            </div>

            <h1 className="display-1 mt-4 text-on-dark sm:mt-5">{org.tagline}</h1>
            <p className="lede mt-4 max-w-2xl text-on-dark-muted sm:mt-6">{org.description}</p>

            {/* Primary Directional Conversion Buttons */}
            <div className="mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                asChild
                size="lg"
                className="min-h-12 w-full gap-2 border border-amber-300/50 bg-amber-400 font-bold text-slate-950 shadow-lift hover:bg-amber-300 sm:w-auto"
              >
                <Link to="/membership">
                  <Users className="size-4.5" />
                  <span>Become a Member</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="onDarkOutline"
                size="lg"
                className="min-h-12 w-full font-semibold sm:w-auto"
              >
                <Link to="/relief">
                  <HeartHandshake className="mr-1.5 size-4.5" />
                  <span>Explore Relief Programs</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="give"
                size="lg"
                className="min-h-12 w-full gap-2 font-bold shadow-lift sm:w-auto"
              >
                <Link to="/donate">
                  <Heart className="size-4.5 fill-white" />
                  <span>Donate Now</span>
                </Link>
              </Button>
            </div>
          </Reveal>

          {/* Compact Verified Impact Trust Strip */}
          <Reveal delay={100} className="mt-2 border-t border-white/15 pt-6 sm:mt-4 sm:pt-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:gap-6">
              <div className="rounded-xs border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs sm:p-4">
                <span className="block truncate text-[10px] font-bold tracking-wider text-brand-red-wash uppercase sm:text-[11px]">
                  Lives Reached
                </span>
                <p className="mt-1 font-display text-xl font-extrabold text-on-dark sm:text-2xl lg:text-3xl">
                  <AnimatedCounter value="15,400+" />
                </p>
                <span className="block truncate text-[11px] text-on-dark-muted">
                  Jigawa &amp; Kano Corridor
                </span>
              </div>

              <div className="rounded-xs border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs sm:p-4">
                <span className="block truncate text-[10px] font-bold tracking-wider text-brand-red-wash uppercase sm:text-[11px]">
                  Ramadan Relief
                </span>
                <p className="mt-1 font-display text-xl font-extrabold text-on-dark sm:text-2xl lg:text-3xl">
                  <AnimatedCounter value="1,500+" />
                </p>
                <span className="block truncate text-[11px] text-on-dark-muted">
                  Food Packs Across 10 States
                </span>
              </div>

              <div className="rounded-xs border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs sm:p-4">
                <span className="block truncate text-[10px] font-bold tracking-wider text-brand-red-wash uppercase sm:text-[11px]">
                  Weekly Nutrition
                </span>
                <p className="mt-1 font-display text-xl font-extrabold text-on-dark sm:text-2xl lg:text-3xl">
                  <AnimatedCounter value="250+" />
                </p>
                <span className="block truncate text-[11px] text-on-dark-muted">
                  Hot Meals Every Week
                </span>
              </div>

              <div className="rounded-xs border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs sm:p-4">
                <span className="block truncate text-[10px] font-bold tracking-wider text-brand-red-wash uppercase sm:text-[11px]">
                  Citizen Network
                </span>
                <p className="mt-1 font-display text-xl font-extrabold text-amber-300 sm:text-2xl lg:text-3xl">
                  36 States + FCT
                </p>
                <Link
                  to="/impact"
                  className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-white underline decoration-brand-red underline-offset-4 hover:text-amber-300"
                >
                  <span>Inspect Verified Impact →</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------- BAND 2: THREE THEMATIC ENTRY POINTS */}
      <section className="bg-background py-18 md:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="Focused Architecture"
            title="Three Direct Pathways to Community Action"
            lede="Navigate cleanly to our dedicated operational portals for relief eligibility, pro bono legal representation, and nationwide citizen membership."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {EXECUTIVE_PATHWAYS.map((pathway, idx) => {
              const Icon = pathway.icon;
              return (
                <Reveal
                  key={pathway.id}
                  delay={idx * 70}
                  as="article"
                  className="flex flex-col justify-between rounded-sm border border-hairline bg-surface p-6 shadow-2xs transition-all hover:border-green-mid/60 hover:shadow-lift sm:p-8"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-bold tracking-wider text-brand-red uppercase">
                        {pathway.eyebrow}
                      </span>
                      <div className="flex size-10 items-center justify-center rounded-sm bg-green-wash text-green-deep">
                        <Icon className="size-5" />
                      </div>
                    </div>

                    <h2 className="mt-4 font-display text-2xl font-bold text-ink">
                      {pathway.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {pathway.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {pathway.badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-xs border border-hairline bg-background px-2.5 py-1 text-[11px] font-semibold text-ink-soft"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 space-y-2.5 border-t border-hairline pt-5">
                    <Button asChild size="lg" className="min-h-12 w-full justify-between font-bold">
                      <Link to={pathway.primaryTo}>
                        <span>{pathway.primaryLabel}</span>
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>

                    <div className="text-center">
                      {"secondaryHash" in pathway ? (
                        <Link
                          to={pathway.secondaryTo}
                          hash={pathway.secondaryHash}
                          className="inline-flex min-h-10 items-center text-xs font-bold text-green-deep hover:underline"
                        >
                          {pathway.secondaryLabel}
                        </Link>
                      ) : (
                        <Link
                          to={pathway.secondaryTo}
                          className="inline-flex min-h-10 items-center text-xs font-bold text-green-deep hover:underline"
                        >
                          {pathway.secondaryLabel}
                        </Link>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- BAND 3: ACCOUNTABILITY & REGIONAL SNAPSHOT */}
      <section className="border-y border-hairline bg-surface py-18 md:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <Reveal>
            <p className="eyebrow text-green-mid">Institutional Credibility</p>
            <h2 className="display-2 mt-3 text-ink">
              Transparent Reporting &amp; Verified Field Footprint
            </h2>
            <p className="lede mt-4">
              We publish only what our field coordinators confirm on the ground. Inspect full
              state-by-state beneficiary breakdowns, eligibility criteria, and operational protocols
              inside our dedicated accountability portals.
            </p>

            <ul className="mt-7 space-y-4">
              {CREDIBILITY_PILLARS.map((pillar) => (
                <li key={pillar.title} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-deep" />
                  <div>
                    <h3 className="text-sm font-bold text-ink">{pillar.title}</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {pillar.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="min-h-12 gap-2 font-bold">
                <Link to="/impact">
                  <BarChart3 className="size-4" />
                  <span>Verified Impact Report</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-h-12">
                <Link to="/about">Our Values &amp; Governance</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal
            delay={100}
            className="rounded-sm border border-hairline bg-background p-6 shadow-lift sm:p-8"
          >
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-brand-red uppercase">
                  Regional Coordination Hubs
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-ink">
                  Where ARF Chapters Operate
                </h3>
              </div>
              <MapPin className="size-6 text-green-deep" />
            </div>

            <div className="mt-5 space-y-3.5">
              <div className="flex items-center justify-between rounded-xs border border-hairline bg-surface p-4">
                <div>
                  <p className="font-display text-sm font-bold text-ink">Jigawa Operations Hub</p>
                  <p className="text-xs text-muted-foreground">
                    Gumel, Dutse &amp; 6 core LGAs · Hospital, school &amp; pad outreaches
                  </p>
                </div>
                <span className="font-display text-lg font-extrabold text-green-deep">8,650+</span>
              </div>

              <div className="flex items-center justify-between rounded-xs border border-hairline bg-surface p-4">
                <div>
                  <p className="font-display text-sm font-bold text-ink">
                    Kano Urban &amp; Skills Hub
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Kano Municipal &amp; 8 LGAs · Youth vocational &amp; weekly feeding
                  </p>
                </div>
                <span className="font-display text-lg font-extrabold text-green-deep">6,750+</span>
              </div>

              <div className="flex items-center justify-between rounded-xs border border-hairline bg-surface p-4">
                <div>
                  <p className="font-display text-sm font-bold text-ink">
                    10-State Ramadan Relief Corridor
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Northwest &amp; Northeast distribution + FCT Abuja Legal Liaison
                  </p>
                </div>
                <span className="font-display text-lg font-extrabold text-brand-red">1,500+</span>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="mt-6 min-h-12 w-full justify-between font-bold"
            >
              <Link to="/chapters">
                <span>Explore Regional Chapters &amp; Find Yours</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------- BAND 4: LEADERSHIP CREDIBILITY & PARTNERS */}
      <section className="bg-background py-18 md:py-22">
        <div className="shell">
          <Reveal className="grid gap-8 rounded-sm border border-hairline bg-surface p-6 shadow-2xs md:grid-cols-[auto_1fr] md:items-center md:p-10">
            <div className="mx-auto size-28 overflow-hidden rounded-full border-2 border-green-deep/20 bg-white shadow-sm sm:size-36 md:mx-0">
              <img
                src={founder.image}
                alt={founder.portraitAlt}
                width={256}
                height={256}
                className="size-full object-cover object-top"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider text-brand-red uppercase">
                <Quote className="size-4" />
                <span>Founder&apos;s Mandate</span>
              </div>
              <blockquote className="mt-3 font-display text-xl leading-snug font-bold text-ink sm:text-2xl">
                &ldquo;{founder.lede}&rdquo;
              </blockquote>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-ink">
                    {founder.name} ({founder.alias})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {founder.role} · {founder.location}
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="min-h-11 shrink-0 gap-2 font-bold"
                >
                  <Link to="/founder">
                    <span>Read Full Founder Dossier</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <PartnersMarquee tone="surface" />

      {/* -------------------------------------------------- BAND 5: LATEST 3 VERIFIED FIELD DISPATCHES */}
      <section className="bg-background py-18 md:py-24">
        <div className="shell">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-green-mid">Field Dispatches</p>
              <h2 className="display-2 mt-3 text-ink">Latest Verified Stories from the Field</h2>
              <p className="lede mt-4 max-w-2xl">
                Direct reports from our teams across schools, hospitals, community stadiums, and
                relief corridors.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="lg" className="min-h-11 shrink-0">
                <Link to="/stories" className="inline-flex items-center gap-2">
                  <span>All Stories</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-h-11 shrink-0">
                <Link to="/gallery">Photo Gallery</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {latestStories.map((story, index) => (
              <StoryCard key={story.slug} story={story} index={index} compact />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- BAND 6: DUAL-PATHWAY EXECUTIVE CONVERSION BAND */}
      <section className="relative overflow-hidden bg-green-deep py-18 text-on-dark md:py-24">
        <div aria-hidden className="motif-grid absolute inset-0 opacity-40" />
        <div className="shell relative grid gap-6 lg:grid-cols-2">
          {/* Card A: Citizen Membership & Service */}
          <Reveal className="flex flex-col justify-between rounded-sm border border-white/15 bg-white/5 p-7 backdrop-blur-xs sm:p-9">
            <div>
              <span className="eyebrow text-amber-300">Citizen &amp; Professional Onboarding</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                Join the Abba Roller Foundation Across 36 States &amp; FCT
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-on-dark-muted">
                Submit your membership, volunteer, or pro bono advocate application, then retrieve
                your Admin-verified Digital ID Card or Accreditation Slip with your registered phone
                number.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="min-h-12 flex-1 gap-2 bg-amber-400 font-bold text-slate-950 hover:bg-amber-300"
              >
                <Link to="/membership">
                  <Users className="size-4" />
                  <span>Become a Member</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="onDarkOutline"
                size="lg"
                className="min-h-12 flex-1 font-semibold"
              >
                <Link to="/volunteer">Volunteer Intake</Link>
              </Button>
            </div>
          </Reveal>

          {/* Card B: Direct Philanthropic Funding */}
          <Reveal
            delay={90}
            className="flex flex-col justify-between rounded-sm border border-white/15 bg-white/5 p-7 backdrop-blur-xs sm:p-9"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="eyebrow text-brand-red-wash">Direct Humanitarian Funding</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-200">
                  <ShieldCheck className="size-3.5" />
                  <span>Verified Polaris Account</span>
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                Back Verified Relief &amp; Legal Defense Directly
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-on-dark-muted">
                100% of direct giving supports food staples, sanitary packs, hospital bill relief,
                and indigent legal defense. Account:{" "}
                <strong className="font-mono text-white">
                  {org.bankDetails.bankName} · {org.bankDetails.accountNumber}
                </strong>
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="give" size="lg" className="min-h-12 flex-1 gap-2 font-bold">
                <Link to="/donate">
                  <Heart className="size-4 fill-white" />
                  <span>Open Donation Portal</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="onDarkOutline"
                size="lg"
                className="min-h-12 flex-1 font-semibold"
              >
                <Link to="/partners">Partner With ARF</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <FloatingActions />
    </>
  );
}

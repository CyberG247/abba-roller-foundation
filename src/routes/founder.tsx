import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Briefcase,
  Award,
  Globe2,
  CheckCircle2,
  Calendar,
  Building2,
  ShieldCheck,
  Heart,
  Quote,
  ArrowRight,
  Sparkles,
  MapPin,
  ExternalLink,
} from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { DonateBand, Section } from "@/components/site/blocks";
import { CMS_PLACEHOLDER, founder, values } from "@/data/site";

const title = "Founder's Desk — Hon. Usman Aminu Usman (Abba Roller)";
const description =
  "Curriculum Vitae, Academic Credentials and Leadership Profile of Hon. Usman Aminu Usman (Abba Roller), Founder and Chairman of Abba Roller Foundation.";

export const Route = createFileRoute("/founder")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: founder.image },
    ],
  }),
  component: Founder,
});

function Founder() {
  return (
    <>
      <PageHeader
        eyebrow="Leadership &amp; Vision"
        title={founder.name}
        lede={`${founder.role} · Popularly known as ${founder.alias}`}
        crumbs={[{ label: "Leadership", to: "/about" }, { label: "Founder's Desk" }]}
      />

      {/* ======================================================== */}
      {/* 1. HERO BIO & EXECUTIVE PROFILE */}
      {/* ======================================================== */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.35fr] lg:gap-16 items-start">
          {/* Left Column: Portrait & Key Profile Data */}
          <Reveal>
            <div className="relative overflow-hidden border border-hairline bg-surface p-2 shadow-lift rounded-xs">
              <img
                src={founder.image}
                alt={founder.portraitAlt}
                className="aspect-[4/5] w-full object-cover object-top"
                width={768}
                height={1024}
                loading="eager"
              />
              <div className="absolute top-4 left-4 bg-green-deep/90 backdrop-blur-xs text-white px-3 py-1 text-[11px] font-bold rounded-xs flex items-center gap-1.5 shadow-sm border border-white/20">
                <GraduationCap className="size-3.5 text-yellow-300" />
                <span>MSc &amp; BA (Hons) · UK Graduate</span>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xs border border-hairline bg-surface">
              <h3 className="font-display text-lg font-bold text-ink">{founder.name}</h3>
              <p className="text-xs font-semibold text-brand-red uppercase tracking-wider mt-0.5">
                Popularly known as {founder.alias}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{founder.role}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
                <MapPin className="size-3.5 text-green-mid shrink-0" />
                <span>{founder.location}</span>
              </div>
            </div>

            {/* Quick Profile Summary Table */}
            <dl className="mt-6 divide-y divide-hairline border-y border-hairline">
              {founder.profile.map((row) => (
                <div key={row.label} className="grid grid-cols-[1.1fr_1.4fr] gap-2 py-3.5 text-xs">
                  <dt className="font-bold tracking-wider text-muted-foreground uppercase">
                    {row.label}
                  </dt>
                  <dd className="font-semibold text-ink sm:text-xs">
                    {row.value === CMS_PLACEHOLDER ? (
                      <span className="font-normal text-muted-foreground">To be confirmed</span>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Quick Contact & Relocation note */}
            <div className="mt-6 p-4 rounded-xs bg-muted/40 border border-hairline text-xs space-y-1.5 text-muted-foreground">
              <p className="font-bold text-ink">Global Engagement &amp; Mobility:</p>
              <p>
                Authorized to work in the United Kingdom and Nigeria. Driving strategic cross-border
                partnerships across Europe, Asia, and Africa.
              </p>
            </div>
          </Reveal>

          {/* Right Column: Statement, Academic Summary & Humanitarian Drive */}
          <Reveal delay={120} className="space-y-6">
            <div className="rounded-sm border-l-4 border-green-deep bg-surface p-6 sm:p-8">
              <Quote className="size-8 text-green-mid opacity-40 mb-3" />
              <p className="font-display text-xl sm:text-2xl font-bold text-ink leading-snug">
                &ldquo;{founder.lede}&rdquo;
              </p>
            </div>

            {/* Personal Statement */}
            <div className="p-5 rounded-xs bg-surface border border-hairline space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-green-deep uppercase tracking-wider">
                <Sparkles className="size-4 text-brand-red" />
                <span>Executive Leadership Profile</span>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">{founder.profileStatement}</p>
            </div>

            {/* 4 Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xs bg-surface border border-hairline text-center">
                <span className="block font-display text-xl sm:text-2xl font-black text-green-deep">
                  MSc &amp; BA
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground mt-0.5 block">
                  Birmingham City Univ. UK
                </span>
              </div>
              <div className="p-3.5 rounded-xs bg-surface border border-hairline text-center">
                <span className="block font-display text-xl sm:text-2xl font-black text-brand-red">
                  8+ Years
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground mt-0.5 block">
                  Executive Experience
                </span>
              </div>
              <div className="p-3.5 rounded-xs bg-surface border border-hairline text-center">
                <span className="block font-display text-xl sm:text-2xl font-black text-green-deep">
                  10 States
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground mt-0.5 block">
                  Nationwide ARF Relief
                </span>
              </div>
              <div className="p-3.5 rounded-xs bg-surface border border-hairline text-center">
                <span className="block font-display text-xl sm:text-2xl font-black text-brand-red">
                  250+
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground mt-0.5 block">
                  Hot Meals Weekly
                </span>
              </div>
            </div>

            {/* Founder Vision Narrative */}
            <div className="space-y-4 text-base leading-relaxed text-ink-soft pt-2">
              {founder.message.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <Button asChild variant="give" size="lg" className="gap-2">
                <Link to="/donate">
                  <Heart className="size-4 fill-white animate-pulse" />
                  <span>Support ARF Initiatives</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/volunteer">Join as a Volunteer</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ======================================================== */}
      {/* 2. EDUCATIONAL BACKGROUND (PROMINENT HIGHLIGHT) */}
      {/* ======================================================== */}
      <Section tone="muted">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="Academic Excellence"
            title="Educational Background &amp; Qualifications"
            lede="Grounded in premier British business education and international management scholarship from Birmingham City University, United Kingdom."
          />

          <div className="mt-12 space-y-6">
            {founder.education.map((item, index) => (
              <Reveal
                key={item.degree}
                delay={index * 80}
                className="p-6 sm:p-7 rounded-sm bg-background border border-hairline shadow-2xs hover:border-green-deep transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-xs bg-green-wash text-green-deep text-[11px] font-bold uppercase tracking-wider mb-1">
                      <GraduationCap className="size-3.5" />
                      <span>{item.period}</span>
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                      {item.degree}
                    </h3>
                    <p className="text-sm font-semibold text-green-deep">
                      {item.institution} ·{" "}
                      <span className="text-muted-foreground">{item.location}</span>
                    </p>
                  </div>

                  {item.grade && (
                    <div className="self-start sm:self-auto px-3 py-1 rounded-xs bg-brand-red-wash border border-brand-red/20 text-brand-red font-display text-xs font-bold whitespace-nowrap">
                      {item.grade}
                    </div>
                  )}
                </div>

                {item.highlights && (
                  <p className="mt-4 pt-4 border-t border-hairline text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.highlights}
                  </p>
                )}
              </Reveal>
            ))}
          </div>

          {/* Education Context Card */}
          <Reveal
            delay={200}
            className="mt-8 p-5 rounded-xs bg-green-deep text-white shadow-sm flex flex-col sm:flex-row items-center gap-4"
          >
            <div className="size-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Award className="size-6 text-yellow-300" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-display text-sm font-bold">
                Global Strategic Academic Foundation
              </h4>
              <p className="text-xs text-white/80 mt-0.5 leading-relaxed">
                With both a Master&apos;s degree (Merit) and Bachelor&apos;s degree (2:1 Upper) in
                International Business and Management from Birmingham City University, UK, Hon.
                Usman Aminu Usman brings world-class strategic rigor, supply chain governance, and
                executive accountability into humanitarian service.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ======================================================== */}
      {/* 3. PROFESSIONAL EXPERIENCE & TRACK RECORD (8+ YEARS) */}
      {/* ======================================================== */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="Career Journey"
            title="Professional Experience &amp; Leadership Track Record"
            lede="Over 8 years of entrepreneurial, cross-border commercial, technology platform, and non-profit executive leadership."
          />

          <div className="mt-12 space-y-8">
            {founder.experiences.map((exp, index) => (
              <Reveal
                key={exp.role + exp.organization}
                delay={index * 90}
                className="p-6 sm:p-8 rounded-sm bg-surface border border-hairline shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-hairline pb-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-xs bg-muted text-ink-soft text-[10px] font-bold uppercase tracking-wider mb-2">
                      <Briefcase className="size-3 text-green-mid" />
                      <span>{exp.type}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-ink">{exp.role}</h3>
                    <p className="text-sm font-semibold text-green-deep">
                      {exp.organization} ·{" "}
                      <span className="text-muted-foreground">{exp.location}</span>
                    </p>
                  </div>
                  <div className="self-start sm:self-auto px-3 py-1 rounded-xs bg-surface border border-hairline text-xs font-mono font-semibold text-muted-foreground">
                    <Calendar className="size-3 inline-block mr-1.5 text-muted-foreground" />
                    {exp.period}
                  </div>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-ink-soft leading-relaxed">
                  {exp.summary}
                </p>

                <div className="mt-5 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Key Milestones &amp; Responsibilities:
                  </span>
                  <ul className="grid gap-2 sm:grid-cols-2 text-xs text-muted-foreground">
                    {exp.achievements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 text-green-mid shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ======================================================== */}
      {/* 4. EXECUTIVE SKILLS & CORE COMPETENCIES */}
      {/* ======================================================== */}
      <Section tone="muted">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="Competencies"
            title="Executive Skills &amp; Domain Expertise"
            lede="A synthesis of commercial acumen, cross-border logistics, technology innovation, and community development."
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {founder.executiveSkills.map((skill, index) => (
              <Reveal
                key={skill}
                delay={index * 40}
                className="p-4 rounded-xs bg-background border border-hairline shadow-2xs hover:border-green-deep transition-all"
              >
                <div className="size-8 rounded-xs bg-green-wash text-green-deep flex items-center justify-center text-xs font-bold mb-3">
                  0{index + 1}
                </div>
                <h4 className="font-display text-xs font-bold text-ink leading-tight">{skill}</h4>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ======================================================== */}
      {/* 5. AWARDS, CERTIFICATIONS & HONORS */}
      {/* ======================================================== */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="Recognition"
            title="Honors, Certifications &amp; Distinctions"
            lede="Recognized for exceptional leadership, extracurricular commitment, and commercial milestone achievement."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {founder.awards.map((award, index) => (
              <Reveal
                key={award.title}
                delay={index * 70}
                className="p-6 rounded-sm bg-surface border border-hairline shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="size-10 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 flex items-center justify-center mb-4">
                    <Award className="size-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-brand-red uppercase tracking-wider block">
                    {award.year}
                  </span>
                  <h3 className="font-display text-base font-bold text-ink mt-1">{award.title}</h3>
                  <p className="text-xs font-semibold text-green-deep mt-1">{award.issuer}</p>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    {award.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ======================================================== */}
      {/* 6. FOUNDATION FOCUS & VALUES */}
      {/* ======================================================== */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Priorities"
          title="Where the Founder's focus sits"
          lede="The areas the Foundation was created to serve, and where our attention remains."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {founder.focusAreas.map((area, index) => (
            <Reveal key={area} delay={index * 70} as="article">
              <span className="font-display text-3xl font-extrabold text-brand-red">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-ink">{area}</h3>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="What guides the work" title="Values held from the start" />
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 60} as="article">
              <h3 className="font-display text-lg font-bold text-ink">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <DonateBand />
    </>
  );
}

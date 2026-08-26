import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  GraduationCap,
  HeartHandshake,
  Megaphone,
  Sprout,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CMS_PLACEHOLDER, type ImpactMetric, type Program, type Story } from "@/data/site";
import { Reveal } from "./Reveal";

/* ------------------------------------------------------------------ icons */

const programIcons = {
  women: Sprout,
  youth: Users,
  education: GraduationCap,
  food: HeartHandshake,
  advocacy: Megaphone,
} as const;

export function ProgramIcon({
  icon,
  className,
}: {
  icon: Program["icon"];
  className?: string;
}) {
  const Icon = programIcons[icon];
  return <Icon aria-hidden className={cn("size-5", className)} />;
}

/* ------------------------------------------------------------- stat strip */

export function StatList({
  metrics,
  tone = "dark",
}: {
  metrics: ImpactMetric[];
  tone?: "dark" | "light";
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const pending = metric.value === CMS_PLACEHOLDER;
        return (
          <Reveal key={metric.label} delay={index * 70}>
            <dt
              className={cn(
                "text-xs font-semibold tracking-[0.12em] uppercase",
                tone === "light" ? "text-on-dark-muted" : "text-muted-foreground",
              )}
            >
              {metric.label}
            </dt>
            <dd
              className={cn(
                "mt-3 font-display font-extrabold tracking-tight",
                pending ? "text-2xl" : "text-4xl md:text-5xl",
                pending
                  ? tone === "light"
                    ? "text-on-dark-muted/60"
                    : "text-muted-foreground/60"
                  : tone === "light"
                    ? "text-on-dark"
                    : "text-green-deep",
              )}
            >
              {pending ? "Awaiting verified figure" : metric.value}
            </dd>
            {metric.note && (
              <p
                className={cn(
                  "mt-2 text-xs",
                  tone === "light" ? "text-on-dark-muted" : "text-muted-foreground",
                )}
              >
                {metric.note}
              </p>
            )}
          </Reveal>
        );
      })}
    </dl>
  );
}

/* ----------------------------------------------------------- program card */

export function ProgramCard({ program, index = 0 }: { program: Program; index?: number }) {
  return (
    <Reveal delay={index * 80} as="article" className="group flex flex-col">
      <Link
        to="/programs/$slug"
        params={{ slug: program.slug }}
        className="block overflow-hidden bg-muted"
      >
        <img
          src={program.image}
          alt={program.imageAlt}
          loading="lazy"
          width={1200}
          height={912}
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex flex-1 flex-col pt-6">
        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-green-mid uppercase">
          <ProgramIcon icon={program.icon} className="size-4" />
          {program.focus[0]}
        </span>
        <h3 className="mt-3 font-display text-xl font-bold text-ink">
          <Link to="/programs/$slug" params={{ slug: program.slug }}>
            {program.title}
          </Link>
        </h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
          {program.summary}
        </p>
        <Link
          to="/programs/$slug"
          params={{ slug: program.slug }}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-deep"
        >
          Learn more
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------- story card */

export function StoryCard({
  story,
  index = 0,
  compact = false,
}: {
  story: Story;
  index?: number;
  compact?: boolean;
}) {
  return (
    <Reveal delay={index * 80} as="article" className="group flex flex-col">
      <Link
        to="/stories/$slug"
        params={{ slug: story.slug }}
        className="block overflow-hidden bg-muted"
      >
        <img
          src={story.image}
          alt={story.imageAlt}
          loading="lazy"
          width={1200}
          height={800}
          className={cn(
            "w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]",
            compact ? "aspect-[16/10]" : "aspect-[3/2]",
          )}
        />
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground">
          <span className="text-brand-red uppercase tracking-[0.1em]">{story.category}</span>
          <span aria-hidden>·</span>
          <time dateTime={story.date}>{formatDate(story.date)}</time>
          <span aria-hidden>·</span>
          <span>{story.readingTime}</span>
        </div>
        <h3
          className={cn(
            "mt-3 font-display font-bold text-ink",
            compact ? "text-lg" : "text-xl",
          )}
        >
          <Link to="/stories/$slug" params={{ slug: story.slug }}>
            {story.title}
          </Link>
        </h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
          {story.excerpt}
        </p>
      </div>
    </Reveal>
  );
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/* ---------------------------------------------------------------- CTA band */

export function DonateBand({
  title = "Your support can help create opportunities, restore dignity and strengthen communities.",
  body = "Every contribution extends the reach of our programmes — from menstrual health education to skills training and humanitarian support.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-green-deep py-20 md:py-28">
      <div aria-hidden className="motif-grid absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-green-light/25 blur-3xl"
      />
      <div className="shell relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <Reveal>
          <p className="eyebrow text-brand-red-wash">Support our work</p>
          <h2 className="display-2 mt-4 max-w-2xl text-on-dark">{title}</h2>
          <p className="lede mt-6 max-w-xl text-on-dark-muted">{body}</p>
        </Reveal>
        <Reveal delay={120} className="flex flex-wrap gap-3 lg:justify-end">
          <Button asChild variant="give" size="lg">
            <Link to="/donate">Donate now</Link>
          </Button>
          <Button asChild variant="onDarkOutline" size="lg">
            <Link to="/get-involved">Other ways to help</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ misc layout */

export function Section({
  children,
  className,
  tone = "default",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-28",
        tone === "muted" && "bg-muted",
        className,
      )}
    >
      <div className="shell">{children}</div>
    </section>
  );
}

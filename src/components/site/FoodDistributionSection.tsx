import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  HeartHandshake,
  Soup,
  Sparkles,
  Utensils,
  ShieldCheck,
  Calendar,
  Users,
  Eye,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { LazyImage } from "./LazyImage";
import { AnimatedCounter } from "./AnimatedCounter";
import weeklyFoodMeals from "@/assets/weekly-food-distribution-meals.jpg";
import weeklyFoodBeneficiaries from "@/assets/weekly-food-distribution-beneficiaries.jpg";
import { cn } from "@/lib/utils";

const mealHighlights = [
  {
    title: "High-Protein & Balanced Nutrition",
    description:
      "Every meal pack includes wholesome seasoned rice, crisp fresh salad greens, and nutritious whole fish, providing essential protein and micronutrients.",
    icon: Soup,
    badge: "Quality Sustenance",
  },
  {
    title: "Weekly Consistent Cycle",
    description:
      "A dependable weekly outreach reaching at least 250 children, orphans, and vulnerable households every single week — over 1,000 meals each month.",
    icon: Calendar,
    badge: "1,000+ Monthly",
  },
  {
    title: "Direct Street & Ward Outreach",
    description:
      "Delivered directly by Foundation volunteers without intermediaries, reaching the children and families in the most acute circumstances.",
    icon: Users,
    badge: "Grassroots Access",
  },
  {
    title: "Dignity-Centered Handover",
    description:
      "Prepared under rigorous hygiene standards and distributed with warmth, empathy, and absolute respect for each recipient's dignity.",
    icon: ShieldCheck,
    badge: "Human Dignity",
  },
];

const galleryImages = [
  {
    src: weeklyFoodBeneficiaries,
    alt: "Children and youths happily holding fresh takeout meals during ARF weekly food distribution",
    caption: "Joyful community beneficiaries receiving fresh takeaway meal packs",
    tag: "Beneficiaries Outreach",
    aspect: "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]",
  },
  {
    src: weeklyFoodMeals,
    alt: "Freshly prepared nutritious meal containers with whole fish, rice and greens stacked for distribution",
    caption: "Hygienically packaged balanced meals featuring whole fish, seasoned rice, and salad",
    tag: "Nutritional Preparation",
    aspect: "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]",
  },
];

export function FoodDistributionSection({ id = "food-distribution" }: { id?: string }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <section
      id={id}
      className="scroll-mt-20 py-20 md:py-28 bg-gradient-to-b from-background via-surface to-background border-t border-hairline relative overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-green-wash/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-brand-red-wash/40 blur-3xl"
      />

      <div className="shell relative">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-red-wash px-3.5 py-1.5 text-xs font-bold text-brand-red border border-brand-red/15 shadow-2xs">
              <Utensils className="size-3.5" />
              <span>Weekly Grassroots Nutrition · Direct Feeding Initiative</span>
            </div>
            <h2 className="display-2 mt-4 text-ink">
              Food Distribution to <span className="text-green-deep">250 People</span> Weekly
            </h2>
            <p className="lede mt-4">
              Direct, wholesome, and dignified nutritional relief. Every single week, the Abba
              Roller Foundation prepares and distributes over 250 freshly cooked, balanced takeaway
              meal packs to street children, orphans, and vulnerable families across local
              communities.
            </p>
          </Reveal>

          <Reveal delay={100} className="shrink-0 flex flex-wrap gap-3">
            <Button asChild variant="give" size="lg" className="shadow-lift font-bold gap-2">
              <a href="#donate">
                <Heart className="size-4 fill-white animate-pulse" />
                <span>Sponsor a meal</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/stories/$slug" params={{ slug: "weekly-community-food-distribution-250-people" }}>
                Read field story
              </Link>
            </Button>
          </Reveal>
        </div>

        {/* Live Feeding Program Impact Numbers */}
        <Reveal delay={120} className="mt-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
            <div className="rounded-sm border border-hairline bg-surface p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Weekly Outreach
                </span>
                <Soup className="size-4 text-green-mid" />
              </div>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-green-deep">
                <AnimatedCounter value="250+" />
              </p>
              <span className="text-xs text-ink-soft">Hot meals delivered every week</span>
            </div>

            <div className="rounded-sm border border-hairline bg-surface p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Monthly Target
                </span>
                <Calendar className="size-4 text-brand-red" />
              </div>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-ink">
                <AnimatedCounter value="1,000+" />
              </p>
              <span className="text-xs text-ink-soft">Nutritious meals per month</span>
            </div>

            <div className="rounded-sm border border-hairline bg-surface p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Direct Handover
                </span>
                <ShieldCheck className="size-4 text-green-mid" />
              </div>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-green-deep">
                <AnimatedCounter value="100%" />
              </p>
              <span className="text-xs text-ink-soft">Direct grassroots delivery</span>
            </div>

            <div className="rounded-sm border border-hairline bg-surface p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Protein &amp; Veggies
                </span>
                <Utensils className="size-4 text-brand-red" />
              </div>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-ink">
                Fish &amp; Rice
              </p>
              <span className="text-xs text-ink-soft">Fresh salad &amp; whole fish</span>
            </div>
          </div>
        </Reveal>

        {/* Central Showcase Grid: Dual Image Field Story & Operational Breakdown */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Interactive Dual Photo Visual Showcase (7 cols) */}
          <Reveal className="lg:col-span-7 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Photo 1: Beneficiaries */}
              <div
                className={cn(
                  "group relative overflow-hidden rounded-sm border transition-all duration-300 bg-muted cursor-pointer shadow-xs",
                  activeImageIndex === 0 ? "border-green-deep ring-2 ring-green-deep/20" : "border-hairline hover:border-green-mid"
                )}
                onClick={() => setActiveImageIndex(0)}
              >
                <div className="overflow-hidden">
                  <LazyImage
                    src={galleryImages[0].src}
                    alt={galleryImages[0].alt}
                    aspectRatio="aspect-[3/4]"
                    zoomOnHover
                    width={1000}
                    height={1333}
                    imagePosition="object-[center_25%]"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white">
                  <span className="inline-block rounded-full bg-brand-red px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {galleryImages[0].tag}
                  </span>
                  <p className="mt-1 text-xs font-medium leading-snug line-clamp-2 text-white/95">
                    {galleryImages[0].caption}
                  </p>
                </div>
              </div>

              {/* Photo 2: Prepared Meal Packs */}
              <div
                className={cn(
                  "group relative overflow-hidden rounded-sm border transition-all duration-300 bg-muted cursor-pointer shadow-xs",
                  activeImageIndex === 1 ? "border-green-deep ring-2 ring-green-deep/20" : "border-hairline hover:border-green-mid"
                )}
                onClick={() => setActiveImageIndex(1)}
              >
                <div className="overflow-hidden">
                  <LazyImage
                    src={galleryImages[1].src}
                    alt={galleryImages[1].alt}
                    aspectRatio="aspect-[3/4]"
                    zoomOnHover
                    width={1000}
                    height={1333}
                    imagePosition="object-center"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white">
                  <span className="inline-block rounded-full bg-green-mid px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {galleryImages[1].tag}
                  </span>
                  <p className="mt-1 text-xs font-medium leading-snug line-clamp-2 text-white/95">
                    {galleryImages[1].caption}
                  </p>
                </div>
              </div>
            </div>

            {/* Field Note Quote Strip */}
            <div className="rounded-sm border border-hairline bg-surface p-4 text-xs text-ink-soft flex items-start gap-3">
              <Info className="size-4 text-green-mid shrink-0 mt-0.5" />
              <p>
                <strong className="text-ink font-semibold">On-the-ground documentation:</strong>{" "}
                Each package contains seasoned rice, fresh salad greens, and a portion of whole
                fish, packaged in clean takeaway containers ready for distribution to waiting
                children and youth.
              </p>
            </div>
          </Reveal>

          {/* Right Column: Key Pillars & Meal Quality Breakdown (5 cols) */}
          <Reveal delay={150} className="lg:col-span-5 flex flex-col gap-4">
            <div className="space-y-3.5">
              {mealHighlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group rounded-sm border border-hairline bg-background p-4.5 shadow-2xs transition-all hover:border-green-deep hover:bg-surface"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="rounded-xs bg-green-wash p-2.5 text-green-deep group-hover:bg-green-deep group-hover:text-on-dark transition-colors shrink-0">
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display text-sm font-bold text-ink group-hover:text-green-deep transition-colors">
                            {item.title}
                          </h3>
                          <span className="rounded-full bg-surface border border-hairline px-2 py-0.5 text-[10px] font-bold text-green-mid">
                            {item.badge}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Meal Sponsorship Action Callout Card */}
            <div className="mt-2 rounded-sm border border-brand-red/20 bg-gradient-to-br from-brand-red-wash/60 via-surface to-background p-5 shadow-xs">
              <div className="flex items-center gap-2 text-brand-red">
                <HeartHandshake className="size-4.5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Community Partnership
                </span>
              </div>
              <h4 className="mt-2 font-display text-base font-bold text-ink">
                Help Us Keep the 250-Meal Weekly Cycle Running
              </h4>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Your direct contribution funds fresh ingredients, packaging, and seamless delivery
                to the children who need it most.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button asChild variant="give" size="sm" className="font-bold gap-1.5 shadow-2xs">
                  <a href="#donate">
                    <Heart className="size-3.5 fill-white animate-pulse" />
                    <span>Sponsor weekly meals</span>
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="text-xs">
                  <Link to="/campaigns/$slug" params={{ slug: "weekly-community-food-distribution" }}>
                    Campaign details
                    <ArrowRight className="size-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

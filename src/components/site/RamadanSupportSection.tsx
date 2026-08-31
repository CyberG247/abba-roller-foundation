import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  HeartHandshake,
  MapPin,
  Moon,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Utensils,
  Globe2,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { LazyImage } from "./LazyImage";
import { AnimatedCounter } from "./AnimatedCounter";
import ramadanFoodPackages from "@/assets/ramadan-food-packages-10-states.jpg";
import { cn } from "@/lib/utils";

const coveredStates = [
  { name: "Jigawa State", region: "Northwest", hub: "Primary Operations" },
  { name: "Kano State", region: "Northwest", hub: "Metropolitan Hub" },
  { name: "Yobe State", region: "Northeast", hub: "Community Outreach" },
  { name: "Borno State", region: "Northeast", hub: "Humanitarian Node" },
  { name: "Kaduna State", region: "Northwest", hub: "Urban Wards" },
  { name: "Katsina State", region: "Northwest", hub: "Grassroots Councils" },
  { name: "Bauchi State", region: "Northeast", hub: "Community Centers" },
  { name: "Sokoto State", region: "Northwest", hub: "Indigent Relief" },
  { name: "Gombe State", region: "Northeast", hub: "Regional Node" },
  { name: "Zamfara State", region: "Northwest", hub: "Vulnerable Relief" },
];

const ramadanHighlights = [
  {
    title: "10-State Multi-Region Footprint",
    description:
      "A coordinated logistics operation spanning 10 Nigerian states across the Northwest and Northeast, ensuring simultaneous grassroots reach.",
    icon: Globe2,
    badge: "10 States",
  },
  {
    title: "1,500 Complete Package Pieces",
    description:
      "Every package contains bundled sustenance packs with freshly prepared, high-protein cooked takeaway meals formulated for Iftar and Sahur.",
    icon: PackageCheck,
    badge: "1,500 Distributed",
  },
  {
    title: "Nutritious Iftar & Sahur Meals",
    description:
      "Prepared with whole fish, seasoned rice, and crisp fresh salad greens, delivering vital calories and micronutrients to fasting households.",
    icon: Utensils,
    badge: "Balanced Protein",
  },
  {
    title: "Accountable Grassroots Delivery",
    description:
      "Distributed directly in partnership with local community leaders and elders to safeguard absolute transparency and recipient dignity.",
    icon: ShieldCheck,
    badge: "Zero Middlemen",
  },
];

export function RamadanSupportSection({ id = "ramadan-support" }: { id?: string }) {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  return (
    <section
      id={id}
      className="scroll-mt-20 py-20 md:py-28 bg-gradient-to-b from-surface via-background to-surface border-t border-hairline relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 right-0 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-1/4 left-0 h-96 w-96 rounded-full bg-green-light/10 blur-3xl"
      />

      <div className="shell relative">
        {/* Section Heading */}
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-500/20 shadow-2xs">
              <Moon className="size-3.5 fill-amber-500 text-amber-500" />
              <span>Seasonal Humanitarian Outreach · Nationwide Ramadan Relief</span>
            </div>
            <h2 className="display-2 mt-4 text-ink">
              Ramadan Support: <span className="text-green-deep">1,500 Packages</span> Across 10 States
            </h2>
            <p className="lede mt-4">
              Extending compassion and food security during the sacred month. The Abba Roller
              Foundation distributed 1,500 food package pieces across 10 Nigerian states, ensuring
              that fasting orphans, widows, and vulnerable households received wholesome Iftar and
              Sahur sustenance with uncompromised dignity.
            </p>
          </Reveal>

          <Reveal delay={100} className="shrink-0 flex flex-wrap gap-3">
            <Button asChild variant="give" size="lg" className="shadow-lift font-bold gap-2">
              <a href="#donate">
                <Heart className="size-4 fill-white animate-pulse" />
                <span>Support Ramadan relief</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link
                to="/campaigns/$slug"
                params={{ slug: "ramadan-food-support-10-states" }}
              >
                Campaign report
              </Link>
            </Button>
          </Reveal>
        </div>

        {/* 4 Quick Metrics Banner */}
        <Reveal delay={120} className="mt-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
            <div className="rounded-sm border border-hairline bg-background p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Packages Distributed
                </span>
                <PackageCheck className="size-4 text-brand-red" />
              </div>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-brand-red">
                <AnimatedCounter value="1,500+" />
              </p>
              <span className="text-xs text-ink-soft">Pieces delivered nationwide</span>
            </div>

            <div className="rounded-sm border border-hairline bg-background p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  States Reached
                </span>
                <Globe2 className="size-4 text-green-mid" />
              </div>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-green-deep">
                <AnimatedCounter value="10 States" />
              </p>
              <span className="text-xs text-ink-soft">Northwest &amp; Northeast corridor</span>
            </div>

            <div className="rounded-sm border border-hairline bg-background p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Target Timing
                </span>
                <Moon className="size-4 text-amber-600" />
              </div>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-ink">
                Iftar &amp; Sahur
              </p>
              <span className="text-xs text-ink-soft">Critical fasting sustenance</span>
            </div>

            <div className="rounded-sm border border-hairline bg-background p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Field Verification
                </span>
                <ShieldCheck className="size-4 text-green-mid" />
              </div>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-green-deep">
                <AnimatedCounter value="100%" />
              </p>
              <span className="text-xs text-ink-soft">Direct community handover</span>
            </div>
          </div>
        </Reveal>

        {/* Central Dual Grid: Visual Proof & 10-State Interactive Cloud */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Authentic Photo Showcase (7 cols) */}
          <Reveal className="lg:col-span-7 flex flex-col gap-4">
            <div className="group relative overflow-hidden rounded-sm border border-hairline bg-muted shadow-sm transition-all hover:border-green-deep">
              <div className="overflow-hidden">
                <LazyImage
                  src={ramadanFoodPackages}
                  alt="Packed green bags and freshly prepared meal containers with whole fish, rice and salad during ARF Ramadan distribution across 10 states"
                  aspectRatio="aspect-[4/3] sm:aspect-[16/10]"
                  zoomOnHover
                  width={1200}
                  height={800}
                  imagePosition="object-center"
                />
              </div>

              {/* Overlay Badge & Caption */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 text-white">
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-full bg-green-mid px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    10-State Distribution Bundles
                  </span>
                  <span className="inline-block rounded-full bg-brand-red px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    1,500 Packages
                  </span>
                </div>
                <p className="mt-2 text-xs sm:text-sm font-medium leading-snug text-white/95 max-w-2xl">
                  Bundled green relief packages and freshly prepared takeaway meals featuring
                  whole fish, seasoned rice, and fresh vegetables ready for distribution to fasting
                  families.
                </p>
              </div>
            </div>

            {/* Field Verification Strip */}
            <div className="rounded-sm border border-hairline bg-surface p-4 text-xs text-ink-soft flex items-start gap-3">
              <Info className="size-4 text-green-mid shrink-0 mt-0.5" />
              <p>
                <strong className="text-ink font-semibold">Logistical Coordination:</strong>{" "}
                Packages were staged in regional hubs and distributed directly into vulnerable
                wards in Jigawa, Kano, Yobe, Borno, Kaduna, Katsina, Bauchi, Sokoto, Gombe, and
                Zamfara, guaranteeing fast and fresh handover.
              </p>
            </div>
          </Reveal>

          {/* Right Column: 10 Covered States Cloud & Core Pillars (5 cols) */}
          <Reveal delay={150} className="lg:col-span-5 flex flex-col gap-5">
            {/* 10 States Badge Grid */}
            <div className="rounded-sm border border-hairline bg-background p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-deep">
                  <MapPin className="size-4 text-brand-red" />
                  <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wide">
                    10 Covered Nigerian States
                  </h3>
                </div>
                <span className="rounded-full bg-green-wash px-2.5 py-0.5 text-[11px] font-bold text-green-deep">
                  Nationwide Reach
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Relief hubs and distribution nodes established during the Ramadan outreach:
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {coveredStates.map((st) => (
                  <div
                    key={st.name}
                    className="flex items-center gap-2 rounded-xs border border-hairline bg-surface p-2 text-xs transition-all hover:border-green-deep hover:bg-background"
                  >
                    <CheckCircle2 className="size-3.5 text-green-mid shrink-0" />
                    <span className="font-semibold text-ink truncate">{st.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operational Highlights Accordion/Cards */}
            <div className="space-y-3">
              {ramadanHighlights.slice(0, 2).map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group rounded-sm border border-hairline bg-background p-4 shadow-2xs transition-all hover:border-green-deep hover:bg-surface"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xs bg-amber-500/10 p-2 text-amber-700 dark:text-amber-400 group-hover:bg-green-deep group-hover:text-on-dark transition-colors shrink-0">
                        <Icon className="size-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-display text-sm font-bold text-ink group-hover:text-green-deep transition-colors truncate">
                            {item.title}
                          </h4>
                          <span className="rounded-full bg-surface border border-hairline px-2 py-0.5 text-[10px] font-bold text-green-mid shrink-0">
                            {item.badge}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ramadan Food Drive Action CTA */}
            <div className="rounded-sm border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-surface to-background p-5 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <HeartHandshake className="size-4.5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Ramadan Giving &amp; Zakat
                </span>
              </div>
              <h4 className="mt-2 font-display text-base font-bold text-ink">
                Partner with ARF for Seasonal Hunger Relief
              </h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Direct your Ramadan charity, Fidya, or general food donation towards certified
                grassroots feeding across vulnerable communities in Nigeria.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button asChild variant="give" size="sm" className="font-bold gap-1.5 shadow-2xs">
                  <a href="#donate">
                    <Heart className="size-3.5 fill-white animate-pulse" />
                    <span>Donate to food drives</span>
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="text-xs">
                  <Link
                    to="/stories/$slug"
                    params={{ slug: "ramadan-food-packages-10-states-distribution" }}
                  >
                    Read field story
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

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  Users,
  Heart,
  Calendar,
  MapPin,
  Trophy,
  Package,
  Soup,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers,
  Award,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { AnimatedCounter } from "@/components/site/AnimatedCounter";
import { cn } from "@/lib/utils";

// Assets
import visuallyImpairedSchool1 from "@/assets/visually-impaired-school-dutse-1.jpg";
import visuallyImpairedSchoolSupplies from "@/assets/visually-impaired-school-dutse-supplies-display.jpg";
import footballTrophyPresentation from "@/assets/football-tournament-trophy-presentation.jpg";
import footballCashAwards from "@/assets/football-tournament-cash-awards.jpg";
import ramadanDistributionBox from "@/assets/ramadan-food-packages-10-states.jpg";
import weeklyFoodMeals from "@/assets/weekly-food-distribution-meals.jpg";
import weeklyFoodBeneficiaries from "@/assets/weekly-food-distribution-beneficiaries.jpg";

export const Route = createFileRoute("/work")({
  component: OurWorkPage,
});

type WorkCategory = "all" | "volunteering" | "charity";

interface WorkProject {
  id: string;
  category: "volunteering" | "charity";
  subSection: "3a. Volunteering Activities" | "3b. Charity & Outreach";
  title: string;
  location: string;
  date: string;
  image: string;
  badge: string;
  badgeColor: string;
  summary: string;
  impactMetrics: { label: string; value: string }[];
  details: string[];
  ctaLink?: string;
  ctaText?: string;
}

const PROJECTS: WorkProject[] = [
  // 3a. Volunteering Activities
  {
    id: "volunteer-dutse-hostel",
    category: "volunteering",
    subSection: "3a. Volunteering Activities",
    title: "Hostel Care & Dignity Outreach at School for Visually Impaired",
    location: "Dutse, Jigawa State",
    date: "Continuous Welfare Cycle",
    image: visuallyImpairedSchool1,
    badge: "Special Needs Volunteer Corps",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    summary:
      "Foundation volunteers mobilized directly into the residential student hostel dormitories in Dutse to assist visually impaired pupils, sort supplies, and distribute hygiene packs.",
    impactMetrics: [
      { label: "Students Reached", value: "100+ Pupils" },
      { label: "Hostel Rooms", value: "All Dormitories" },
      { label: "Volunteers Active", value: "24 Cadres" },
    ],
    details: [
      "Assisted young pupils with bedding, personal hygiene kits, and dormitory sanitization.",
      "Conducted empathetic mentorship dialogues reinforcing confidence and education.",
      "Supervised cafeteria food serving and nutritional meal allocation.",
    ],
    ctaLink: "/stories/visually-impaired-school-dutse-jigawa",
    ctaText: "Read Field Story",
  },
  {
    id: "volunteer-weekly-feeding",
    category: "volunteering",
    subSection: "3a. Volunteering Activities",
    title: "Weekly Direct Street Feeding Logistics & Distribution Corps",
    location: "Gumel & Municipalities, Jigawa State",
    date: "Every Weekend (Active Ongoing)",
    image: weeklyFoodBeneficiaries,
    badge: "Direct Feeding Corps",
    badgeColor: "bg-brand-red-wash text-brand-red border-brand-red/20",
    summary:
      "A dedicated brigade of grassroots ARF volunteers packaging, loading, and personally handing fresh, hot meals to vulnerable street children, widows, and households.",
    impactMetrics: [
      { label: "Weekly Meals", value: "250+ Packs" },
      { label: "Monthly Output", value: "1,000+ Meals" },
      { label: "Delivery Mode", value: "100% Direct" },
    ],
    details: [
      "Rigorous food hygiene preparation featuring whole fish, chicken, seasoned rice, and fresh salad.",
      "Zero middlemen: handed directly to children and elderly community members.",
      "Building trust and compassion across neighborhood wards.",
    ],
    ctaLink: "/campaigns/weekly-community-food-distribution",
    ctaText: "Explore Feeding Initiative",
  },
  {
    id: "volunteer-football-mentorship",
    category: "volunteering",
    subSection: "3a. Volunteering Activities",
    title: "Grassroots Football League Coordination & Youth Marshals",
    location: "Gumel Stadium, Jigawa State",
    date: "Championship Season",
    image: footballCashAwards,
    badge: "Youth Leadership",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    summary:
      "Youth ambassadors and tournament marshals coordinating matches, managing stadium crowd safety, and facilitating fair play seminars among competing neighborhood teams.",
    impactMetrics: [
      { label: "Clubs Managed", value: "11 Teams" },
      { label: "Youth Marshals", value: "35 Marshals" },
      { label: "Spectators Safely Hosted", value: "2,000+" },
    ],
    details: [
      "Pre-game team inspections alongside Founder Hon. Usman Aminu Usman.",
      "Distribution of tournament merit rewards and player hydration.",
      "Advocacy against youth restiveness and substance abuse through sports.",
    ],
  },

  // 3b. Charity & Outreach
  {
    id: "charity-ramadan-relief",
    category: "charity",
    subSection: "3b. Charity & Outreach",
    title: "National Ramadan Fasting Sustenance & Muslim Ummah Relief",
    location: "10 Northwest & Northeast States",
    date: "Annual Holy Month Outreach",
    image: ramadanDistributionBox,
    badge: "10-State Footprint",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    summary:
      "Major regional charity initiative delivering over 1,500 food carton packages and clean drinking water to fasting families, orphans, and vulnerable households across northern Nigeria.",
    impactMetrics: [
      { label: "Food Cartons", value: "1,500+ Packs" },
      { label: "Regional States", value: "10 States" },
      { label: "Households Fed", value: "10,000+ People" },
    ],
    details: [
      "Covering Kano, Jigawa, Kaduna, Katsina, Sokoto, Kebbi, Zamfara, Bauchi, Borno, and Gombe.",
      "High-nutrition pantry provisions: grains, sugar, dates, cooking oil, and bottled water.",
      "Dedicated focus on disabled persons, widows, and vulnerable orphans.",
    ],
  },
  {
    id: "charity-visually-impaired-dutse",
    category: "charity",
    subSection: "3b. Charity & Outreach",
    title: "Multi-Pillar Welfare Intervention for Special Education Students",
    location: "School for the Visually Impaired, Dutse",
    date: "Major Foundation Grant",
    image: visuallyImpairedSchoolSupplies,
    badge: "4-Pillar Relief",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    summary:
      "Comprehensive charitable donation of bulk cooked meals, cartons of sanitary pads for female pupils, heavy-duty laundry detergents, and individual bathing kits.",
    impactMetrics: [
      { label: "Care Pillars", value: "4 Pillars" },
      { label: "Pads Provided", value: "100+ Packs" },
      { label: "Detergent Supplies", value: "School Linens" },
    ],
    details: [
      "Menstrual hygiene support ensuring young girls attend classes with dignity.",
      "Sanitation detergents protecting hostel dormitories from contamination.",
      "Immediate dietary assistance augmenting the school kitchen.",
    ],
  },
  {
    id: "charity-football-championship",
    category: "charity",
    subSection: "3b. Charity & Outreach",
    title: "ARF Grassroots Football Championship Sponsorship & Team Grants",
    location: "Gumel & Neighboring Communities",
    date: "Annual Tournament",
    image: footballTrophyPresentation,
    badge: "Trophies & Grants",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    summary:
      "Sponsorship of grassroots clubs with complete sets of new team jerseys, the official ARF Golden Championship Cup, and substantial cash prize grants to winning squads.",
    impactMetrics: [
      { label: "Grand Trophy", value: "Golden Cup" },
      { label: "Team Kits", value: "Full Uniforms" },
      { label: "Cash Grants", value: "Direct Prizes" },
    ],
    details: [
      "Equipping grassroots squads who previously lacked uniform attire.",
      "Direct cash bonuses awarded to tournament MVPs and winning team captains.",
      "Fostering civic harmony, sportsmanship, and discipline among young athletes.",
    ],
  },
];

function OurWorkPage() {
  const [activeFilter, setActiveFilter] = useState<WorkCategory>("all");

  const filteredProjects =
    activeFilter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <div className="bg-background text-ink min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-deep via-green-deep to-slate-950 text-white py-16 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-brand-red/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl"
        />

        <div className="shell relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md border border-white/15">
              <Briefcase className="size-3.5" />
              <span>Project Portfolio · Scope of Action</span>
            </div>
            <h1 className="display-1 mt-4 text-white">
              Our <span className="text-amber-400">Civic Work</span> &amp; Community Impact
            </h1>
            <p className="lede mt-4 text-slate-200">
              A comprehensive portfolio of the Abba Roller Foundation&apos;s verified field
              engagements, divided into <strong>Volunteering Activities</strong> and{" "}
              <strong>Charity &amp; Outreach</strong> initiatives across Nigeria.
            </p>

            {/* Quick Metrics Banner */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-sm border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">
                  Volunteers Deployed
                </span>
                <p className="font-display text-2xl font-bold text-amber-300 mt-1">
                  <AnimatedCounter value="250+" />
                </p>
              </div>

              <div className="rounded-sm border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">
                  States Impacted
                </span>
                <p className="font-display text-2xl font-bold text-emerald-400 mt-1">
                  <AnimatedCounter value="10 States" />
                </p>
              </div>

              <div className="rounded-sm border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">
                  Monthly Meals
                </span>
                <p className="font-display text-2xl font-bold text-brand-red-bright mt-1">
                  <AnimatedCounter value="1,000+" />
                </p>
              </div>

              <div className="rounded-sm border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">
                  Grassroots Teams
                </span>
                <p className="font-display text-2xl font-bold text-blue-300 mt-1">
                  <AnimatedCounter value="11 Clubs" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <div className="shell py-12 md:py-20">
        {/* Sub-Section Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-green-deep">
              Portfolio Navigation
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mt-0.5">
              Documented Field Initiatives ({filteredProjects.length})
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-surface p-1 rounded-sm border border-hairline w-fit">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={cn(
                "px-3.5 py-1.5 text-xs font-bold rounded-xs transition-all cursor-pointer",
                activeFilter === "all"
                  ? "bg-green-deep text-white shadow-xs"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              All Portfolio ({PROJECTS.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("volunteering")}
              className={cn(
                "px-3.5 py-1.5 text-xs font-bold rounded-xs transition-all cursor-pointer",
                activeFilter === "volunteering"
                  ? "bg-green-deep text-white shadow-xs"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              3a. Volunteering Activities (3)
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("charity")}
              className={cn(
                "px-3.5 py-1.5 text-xs font-bold rounded-xs transition-all cursor-pointer",
                activeFilter === "charity"
                  ? "bg-green-deep text-white shadow-xs"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              3b. Charity &amp; Outreach (3)
            </button>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between rounded-sm border border-hairline bg-surface overflow-hidden shadow-xs hover:shadow-md transition-all group"
            >
              <div>
                {/* Image Container with Cover Fit */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold border backdrop-blur-xs",
                        project.badgeColor,
                      )}
                    >
                      {project.badge}
                    </span>
                    <span className="rounded-full bg-black/70 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-medium text-white">
                      {project.subSection}
                    </span>
                  </div>

                  {/* Bottom Location & Date Bar */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-200 z-10">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="size-3 text-amber-400" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-slate-300">
                      <Calendar className="size-3 text-slate-400" />
                      {project.date}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <h3 className="font-display text-base font-bold text-ink leading-snug group-hover:text-green-deep transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs text-ink-soft leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>

                  {/* Impact Metric Chips */}
                  <div className="mt-4 pt-3 border-t border-hairline grid grid-cols-3 gap-2 text-center">
                    {project.impactMetrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-background rounded-xs p-1.5 border border-hairline/60"
                      >
                        <span className="block text-[9px] uppercase text-muted-foreground truncate">
                          {metric.label}
                        </span>
                        <span className="font-display text-xs font-extrabold text-ink block truncate">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Key Highlights Bullet points */}
                  <ul className="mt-4 space-y-1.5 text-[11px] text-ink-soft border-t border-hairline pt-3">
                    {project.details.map((d, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="size-3.5 text-green-mid shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-5 pt-0">
                {project.ctaLink ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-bold gap-1.5"
                  >
                    <Link to={project.ctaLink}>
                      <span>{project.ctaText || "Learn More"}</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-bold gap-1.5"
                  >
                    <Link to="/gallery">
                      <span>View Gallery Photos</span>
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16 rounded-md bg-gradient-to-r from-green-deep via-green-deep to-slate-900 text-white p-8 md:p-12 shadow-lg relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-300">
              Get Involved in Our Work
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Ready to Join Our Next Community Mission?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
              Whether you want to contribute as a registered member or deploy directly as an
              on-the-ground volunteer, the Abba Roller Foundation welcomes your service and
              commitment to uplifting humanity.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                variant="default"
                size="lg"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-2"
              >
                <Link to="/membership">
                  <Users className="size-4" />
                  <span>Become a Registered Member</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 gap-2"
              >
                <Link to="/volunteer">
                  <Heart className="size-4" />
                  <span>Apply as Volunteer</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

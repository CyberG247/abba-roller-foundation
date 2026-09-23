import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Trophy,
  Medal,
  Award,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Grid,
  MapPin,
  Mic,
  DollarSign,
  Shirt,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Reveal } from "./Reveal";
import { LazyImage } from "./LazyImage";
import { AnimatedCounter } from "./AnimatedCounter";
import { cn } from "@/lib/utils";

// Football Tournament Assets
import footballTournamentTrophyPresentation from "@/assets/football-tournament-trophy-presentation.jpg";
import footballTournamentTrophyHandoverCrowd from "@/assets/football-tournament-trophy-handover-crowd.jpg";
import footballTournamentFounderSpeech from "@/assets/football-tournament-founder-speech.jpg";
import footballTournamentCeremonialKickoffTable from "@/assets/football-tournament-ceremonial-kickoff-table.jpg";
import footballTournamentPitchInspectionYellow from "@/assets/football-tournament-pitch-inspection-yellow.jpg";
import footballTournamentPitchInspectionRed from "@/assets/football-tournament-pitch-inspection-red.jpg";
import footballTournamentCashAwardsCloseup from "@/assets/football-tournament-cash-awards-closeup.jpg";
import footballTournamentCashAwards from "@/assets/football-tournament-cash-awards.jpg";
import footballTournamentSpectatorStandsGroup from "@/assets/football-tournament-spectator-stands-group.jpg";
import footballTournamentVipSpectatorsFounder from "@/assets/football-tournament-vip-spectators-founder.jpg";
import footballTournamentDelegatesDiscussion from "@/assets/football-tournament-delegates-discussion.jpg";

export interface TournamentPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  caption: string;
  isMainHeadImage?: boolean;
}

/**
 * Authentic tournament gallery collection for the Abba Roller Foundation
 * Grassroots Football Championship.
 */
export const tournamentGallery: TournamentPhoto[] = [
  {
    id: "football-trophy-presentation",
    src: footballTournamentTrophyPresentation,
    alt: "Hon. Usman Aminu Usman presenting the golden championship trophy and brand new team jerseys to team captains",
    title: "Championship Trophy & Kit Presentation",
    category: "Championship & Honors",
    caption:
      "Founder & Chairman Hon. Usman Aminu Usman presenting the coveted Golden Tournament Cup alongside complete sets of new team jerseys to the championship finalists.",
    isMainHeadImage: true,
  },
  {
    id: "football-trophy-handover-crowd",
    src: footballTournamentTrophyHandoverCrowd,
    alt: "Ecstatic grand finale moment with golden championship cup held up high surrounded by team captains, officials, and fans",
    title: "Golden Trophy Raised on the Podium",
    category: "Championship & Honors",
    caption:
      "Ecstatic grand finale moment as the gleaming Golden Championship Trophy is held high amidst cheering fans, players, and foundation officials.",
  },
  {
    id: "football-ceremonial-kickoff-table",
    src: footballTournamentCeremonialKickoffTable,
    alt: "Ceremonial match ball, golden trophy, and team kits on the presentation table with handshake between founder and dignitaries",
    title: "Ceremonial Kickoff & Match Ball Handover",
    category: "Ceremony & Leadership",
    caption:
      "Dignitaries, community elders, and Founder Hon. Usman Aminu Usman gathered around the official match presentation table with the official match ball, trophy, and team kits.",
  },
  {
    id: "football-founder-speech",
    src: footballTournamentFounderSpeech,
    alt: "Hon. Usman Aminu Usman addressing players, officials, and spectators with a microphone",
    title: "Keynote Address by Founder",
    category: "Ceremony & Leadership",
    caption:
      "Hon. Usman Aminu Usman addressing youth, community elders, and spectators, emphasizing unity, discipline, athletic ambition, and peaceful coexistence through football.",
  },
  {
    id: "football-spectator-stands-group",
    src: footballTournamentSpectatorStandsGroup,
    alt: "Celebratory grand group photo on the stadium pavilion featuring Founder Hon. Usman Aminu Usman, women community leaders, youth ambassadors in ARF caps, and enthusiastic young football fans",
    title: "Community & ARF Delegation in the Stands",
    category: "Community & Fans",
    caption:
      "Celebratory group portrait in the stadium pavilion featuring Founder Hon. Usman Aminu Usman, women community leaders, youth ambassadors in ARF caps, and enthusiastic young football fans.",
  },
  {
    id: "football-vip-spectators-founder",
    src: footballTournamentVipSpectatorsFounder,
    alt: "Founder Hon. Usman Aminu Usman seated alongside community elders and distinguished guests, closely observing the match from the main pavilion",
    title: "Matchday Observation from the VIP Pavilion",
    category: "Community & Fans",
    caption:
      "Founder Hon. Usman Aminu Usman seated alongside community elders and distinguished guests, closely observing the high-intensity tournament match from the main pavilion.",
  },
  {
    id: "football-pitch-inspection-yellow",
    src: footballTournamentPitchInspectionYellow,
    alt: "Hon. Usman Aminu Usman shaking hands with players of KAFC Dandidibabs FC Gumel on the football pitch",
    title: "Pre-Match Inspection: KAFC Dandidibabs FC Gumel",
    category: "Pitch Inspection & Teams",
    caption:
      "Founder Hon. Usman Aminu Usman walking the pitch and shaking hands with players of KAFC Dandidibabs FC Gumel before kickoff, encouraging fair play and teamwork.",
  },
  {
    id: "football-pitch-inspection-red",
    src: footballTournamentPitchInspectionRed,
    alt: "Hon. Usman Aminu Usman shaking hands with the red kit squad lined up before kickoff",
    title: "Pre-Match Inspection: Red Warriors",
    category: "Pitch Inspection & Teams",
    caption:
      "Pre-game team inspection on the turf: Hon. Usman Aminu Usman congratulating squad players and urging them to showcase raw talent with sportsmanship.",
  },
  {
    id: "football-cash-awards-closeup",
    src: footballTournamentCashAwardsCloseup,
    alt: "Close-up of Founder Hon. Usman Aminu Usman presenting official sealed Abba Roller Foundation cash prize envelope to standout athlete",
    title: "ARF Cash Prize Envelope Handover",
    category: "Tournament Cash Awards",
    caption:
      "Founder Hon. Usman Aminu Usman directly presenting an official sealed Abba Roller Foundation cash prize envelope to a standout athlete, fueling grassroots athletic development.",
  },
  {
    id: "football-cash-awards",
    src: footballTournamentCashAwards,
    alt: "Hon. Usman Aminu Usman presenting cash prize envelopes and rewards to standout players and winning team captains",
    title: "Tournament Merit & MVP Cash Grants",
    category: "Tournament Cash Awards",
    caption:
      "Direct cash prize envelopes handed over to standout footballers, MVPs, and winning team delegates to celebrate their dedication and support grassroots sports.",
  },
  {
    id: "football-delegates-discussion",
    src: footballTournamentDelegatesDiscussion,
    alt: "Founder Hon. Usman Aminu Usman engaging in consultations with tournament organizers, team managers, and ARF youth coordinators",
    title: "Stakeholder Dialogue & Youth Leadership",
    category: "Ceremony & Leadership",
    caption:
      "Founder Hon. Usman Aminu Usman engaging in active consultations with tournament organizers, team managers, and ARF youth coordinators to plan future youth sports leagues.",
  },
];

// Breakdown of tournament impact pillars
const tournamentPillars = [
  {
    title: "Championship Trophy & Honors",
    icon: Trophy,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    badge: "Golden Cup",
    items: [
      "Official ARF Championship Golden Trophy awarded to the tournament winners",
      "Medals and commendation certificates for top-performing athletes",
      "Dignified podium ceremony witnessed by community leaders and sports enthusiasts",
    ],
  },
  {
    title: "Cash Incentives & Player Grants",
    icon: DollarSign,
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    badge: "Direct Cash Prizes",
    items: [
      "Substantial cash prize envelopes presented directly to champions and runners-up",
      "Performance bonuses for Best Player (MVP), Highest Goal Scorer, and Best Goalkeeper",
      "Financial assistance to help community teams cover logistics, training gear, and refreshments",
    ],
  },
  {
    title: "Complete Team Kits & Jerseys",
    icon: Shirt,
    color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    badge: "Sports Kits Donated",
    items: [
      "Full packaged sets of quality team jerseys and shorts distributed to participating clubs",
      "Equipping grassroots squads who often struggle with uniform match attire",
      "Professional match gear fostering team spirit, identity, and pride on the pitch",
    ],
  },
  {
    title: "Youth Unity & Peace Advocacy",
    icon: Users,
    color: "text-brand-red bg-brand-red-wash border-brand-red/20",
    badge: "Community Harmony",
    items: [
      "Mobilizing hundreds of young people from diverse neighborhoods in positive fellowship",
      "Combating youth restiveness and substance abuse through constructive athletic competition",
      "Platform for regional football scouts to discover hidden grassroots talents",
    ],
  },
];

interface FootballTournamentSectionProps {
  id?: string;
}

export function FootballTournamentSection({
  id = "football-tournament",
}: FootballTournamentSectionProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<TournamentPhoto | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");

  // Track active slide in the main carousel & auto-slide every 2.2 seconds
  useEffect(() => {
    if (!carouselApi) return;

    setCurrentSlide(carouselApi.selectedScrollSnap());
    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);

    // Automatically slide photos every 2.2 seconds
    const autoSlideInterval = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, 2200);

    return () => {
      carouselApi.off("select", onSelect);
      clearInterval(autoSlideInterval);
    };
  }, [carouselApi]);

  const categories = [
    "All",
    ...Array.from(new Set(tournamentGallery.map((item) => item.category))),
  ];

  const filteredPhotos =
    activeCategoryFilter === "All"
      ? tournamentGallery
      : tournamentGallery.filter((item) => item.category === activeCategoryFilter);

  const openLightboxForPhoto = (photo: TournamentPhoto) => {
    setSelectedPhoto(photo);
    setLightboxOpen(true);
  };

  return (
    <section
      id={id}
      aria-label="Abba Roller Foundation Grassroots Football Tournament"
      className="relative scroll-mt-20 overflow-hidden bg-slate-950 text-white py-24 md:py-32"
    >
      {/* Background Ambience */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"
      />

      <div className="shell relative">
        {/* Section Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3.5 py-1.5 text-xs font-bold text-amber-400 border border-amber-500/25 shadow-2xs">
              <Trophy className="size-3.5" />
              <span>Youth Empowerment · Grassroots Football Championship</span>
            </div>
            <h2 className="display-2 mt-4 text-white">
              ARF Grassroots <span className="text-amber-400">Football Championship</span>
            </h2>
            <p className="lede mt-4 text-slate-300">
              Igniting youth potential, fostering communal peace, and championing grassroots sports.
              The Abba Roller Foundation hosted and sponsored a premier football tournament —
              bringing together local community clubs (including KAFC Dandidibabs FC Gumel),
              donating complete jersey kits, awarding direct cash prizes, and presenting the
              prestigious Golden Championship Cup.
            </p>
          </Reveal>

          <Reveal delay={100} className="shrink-0 flex flex-wrap gap-3">
            {/* Main Trigger Button for Dialog */}
            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={() => setDetailsModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold gap-2 shadow-lift cursor-pointer"
            >
              <Grid className="size-4" />
              <span>View All Match Photos ({tournamentGallery.length})</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                const el = document.getElementById("tournament-pillars");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-slate-700 bg-slate-900/60 text-white hover:bg-slate-800"
            >
              Tournament Highlights
            </Button>
          </Reveal>
        </div>

        {/* Tournament Highlights Metric Bar */}
        <Reveal delay={120} className="mt-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
            <div className="rounded-sm border border-slate-800 bg-slate-900/80 p-5 shadow-2xs transition-all hover:border-amber-400/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Location &amp; Teams
                </span>
                <MapPin className="size-4 text-amber-400" />
              </div>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white">
                Gumel &amp; Beyond
              </p>
              <span className="text-xs text-slate-400">KAFC Gumel &amp; Grassroots Clubs</span>
            </div>

            <div className="rounded-sm border border-slate-800 bg-slate-900/80 p-5 shadow-2xs transition-all hover:border-emerald-500/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Grand Trophy
                </span>
                <Trophy className="size-4 text-amber-400" />
              </div>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-amber-400">
                Golden Cup
              </p>
              <span className="text-xs text-slate-400">Official ARF Champion Trophy</span>
            </div>

            <div className="rounded-sm border border-slate-800 bg-slate-900/80 p-5 shadow-2xs transition-all hover:border-amber-400/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Cash Rewards
                </span>
                <DollarSign className="size-4 text-emerald-400" />
              </div>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-emerald-400">
                Cash Prizes
              </p>
              <span className="text-xs text-slate-400">Direct grants to finalists &amp; MVPs</span>
            </div>

            <div className="rounded-sm border border-slate-800 bg-slate-900/80 p-5 shadow-2xs transition-all hover:border-blue-500/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Team Equipment
                </span>
                <Shirt className="size-4 text-blue-400" />
              </div>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-blue-400">
                Full Kits
              </p>
              <span className="text-xs text-slate-400">Brand new match jerseys donated</span>
            </div>
          </div>
        </Reveal>

        {/* Central Showcase: Carousel on Left & Tournament Benefits on Right */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Interactive Carousel with Match Photos */}
          <Reveal className="lg:col-span-6 flex flex-col gap-4">
            <div className="rounded-sm border border-slate-800 bg-slate-900/90 p-3.5 shadow-lg">
              {/* Carousel Container */}
              <Carousel opts={{ loop: true }} setApi={setCarouselApi} className="w-full">
                <CarouselContent>
                  {tournamentGallery.map((photo, index) => (
                    <CarouselItem key={photo.id}>
                      <div className="relative overflow-hidden rounded-xs bg-slate-950 group">
                        <LazyImage
                          src={photo.src}
                          alt={photo.alt}
                          aspectRatio="aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]"
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          width={1000}
                          height={1250}
                        />

                        {/* Top Overlay Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-amber-400 backdrop-blur-md border border-amber-400/30">
                            {photo.isMainHeadImage ? (
                              <>
                                <Trophy className="size-3.5" />
                                <span>Grand Trophy Handover</span>
                              </>
                            ) : (
                              <>
                                <Flame className="size-3.5" />
                                <span>{photo.category}</span>
                              </>
                            )}
                          </span>

                          <span className="rounded-full bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-slate-300 backdrop-blur-md border border-slate-800">
                            {index + 1} / {tournamentGallery.length}
                          </span>
                        </div>

                        {/* Expand Photo Button */}
                        <button
                          type="button"
                          onClick={() => openLightboxForPhoto(photo)}
                          className="absolute bottom-3 right-3 z-10 flex size-10 items-center justify-center rounded-full bg-slate-950/80 text-white backdrop-blur-md transition-all hover:bg-amber-500 hover:text-slate-950 hover:scale-110 shadow-lg cursor-pointer"
                          aria-label={`Enlarge photo: ${photo.title}`}
                        >
                          <Maximize2 className="size-4" />
                        </button>

                        {/* Bottom Gradient with Caption */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 pt-16">
                          <p className="font-display text-base font-bold text-white">
                            {photo.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-300">
                            {photo.caption}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Carousel Controls */}
                <div className="mt-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <CarouselPrevious className="static translate-y-0 size-8 rounded-full border-slate-700 bg-slate-800 text-slate-200 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 cursor-pointer" />
                    <CarouselNext className="static translate-y-0 size-8 rounded-full border-slate-700 bg-slate-800 text-slate-200 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 cursor-pointer" />
                    <span className="text-xs font-medium text-slate-400 ml-1">
                      Swipe or use arrows to view all match moments
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDetailsModalOpen(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 p-0 h-auto font-bold cursor-pointer"
                  >
                    View All ({tournamentGallery.length}) →
                  </Button>
                </div>
              </Carousel>

              {/* Horizontal Thumbnails Strip */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {tournamentGallery.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => carouselApi?.scrollTo(idx)}
                    className={cn(
                      "relative shrink-0 size-14 rounded-xs overflow-hidden border-2 transition-all cursor-pointer",
                      currentSlide === idx
                        ? "border-amber-400 ring-2 ring-amber-400/40 opacity-100 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                    aria-label={`Jump to slide ${idx + 1}: ${item.title}`}
                  >
                    <LazyImage
                      src={item.src}
                      alt={item.title}
                      aspectRatio="aspect-square"
                      className="size-full object-cover"
                      width={100}
                      height={100}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Context Card */}
            <div className="rounded-sm border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300 flex items-start gap-3">
              <Trophy className="size-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-bold text-white">Community Unity &amp; Sportsmanship</p>
                <p className="mt-0.5">
                  Sport is one of the most powerful catalysts for communal harmony and youth
                  empowerment. The Abba Roller Foundation tournament unites hundreds of youth,
                  replaces street idleness with healthy competition, and rewards excellence.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Breakdown of Tournament Pillars & Benefits */}
          <Reveal delay={150} className="lg:col-span-6 flex flex-col gap-6" id="tournament-pillars">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Tournament Impact Framework
              </span>
              <h3 className="font-display text-2xl font-extrabold text-white mt-1">
                How ARF Empowered Local Clubs &amp; Youth
              </h3>
              <p className="text-sm text-slate-300 mt-2">
                Grassroots football clubs in northern Nigeria frequently face an acute shortage of
                match kits, equipment, tournament opportunities, and financial incentives. The Abba
                Roller Foundation intervened holistically:
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {tournamentPillars.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.title}
                    className="flex flex-col justify-between rounded-sm border border-slate-800 bg-slate-900/80 p-5 shadow-xs transition-all hover:border-slate-700 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div
                          className={cn(
                            "flex size-10 items-center justify-center rounded-full border",
                            cat.color
                          )}
                        >
                          <Icon className="size-5" />
                        </div>
                        <span className="inline-flex rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-slate-200">
                          {cat.badge}
                        </span>
                      </div>

                      <h4 className="font-display text-base font-bold text-white">{cat.title}</h4>

                      <ul className="mt-3 space-y-2 text-xs text-slate-300">
                        {cat.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="size-3.5 shrink-0 text-amber-400 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Official Tournament Quote Callout */}
            <div className="rounded-sm border-l-4 border-amber-400 bg-slate-900/90 p-5 shadow-xs">
              <div className="flex items-center gap-2">
                <Mic className="size-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Founder&apos;s Tournament Address
                </span>
              </div>
              <p className="mt-2 text-sm italic text-slate-200">
                &ldquo;Football is far more than ninety minutes on a pitch. It teaches our young
                people endurance, discipline, brotherhood, and collective purpose. When we invest in
                grassroots sports, we keep our youth inspired, active, and united away from crime and
                hopelessness.&rdquo;
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Hon. Usman Aminu Usman (Abba Roller)</p>
                  <p className="text-[11px] text-slate-400">Founder &amp; Chairman, Abba Roller Foundation</p>
                </div>

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => setDetailsModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-1 text-xs cursor-pointer"
                >
                  <Grid className="size-3.5" />
                  <span>Photo Archive</span>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* -------------------------------------------------- 1. DIALOG MODAL: ALL TOURNAMENT PHOTOS & RELIEF REPORT */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 text-white border-slate-800 p-6 sm:p-8">
          <DialogHeader>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Trophy className="size-4" />
              <span>Full Field Documentation &amp; Tournament Archive</span>
            </div>
            <DialogTitle className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Abba Roller Foundation Football Championship
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-300">
              Complete photographic records and detailed inventory of tournament sponsorship, kit
              donations, cash prize rewards, and youth engagement.
            </DialogDescription>
          </DialogHeader>

          {/* Category Filter Pills */}
          <div className="mt-4 flex flex-wrap gap-2 border-b border-slate-800 pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategoryFilter(cat)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer",
                  activeCategoryFilter === cat
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="mt-6">
            <h4 className="font-display text-lg font-bold text-white mb-3">
              Match &amp; Ceremony Photos ({filteredPhotos.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => openLightboxForPhoto(photo)}
                  className="group relative cursor-pointer overflow-hidden rounded-xs border border-slate-800 bg-slate-900 transition-all hover:border-amber-400/80 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                    <LazyImage
                      src={photo.src}
                      alt={photo.alt}
                      aspectRatio="aspect-[4/3]"
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      width={400}
                      height={300}
                    />
                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="size-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                        <Maximize2 className="size-4" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold mb-1">
                      <span>{photo.category}</span>
                      {photo.isMainHeadImage && (
                        <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px]">
                          Grand Trophy
                        </span>
                      )}
                    </div>
                    <p className="font-display text-sm font-bold text-white line-clamp-1">
                      {photo.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{photo.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Tournament Rewards Details */}
          <div className="mt-8 border-t border-slate-800 pt-6">
            <h4 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="size-5 text-amber-400" />
              <span>Itemized Tournament Provisions &amp; Grants</span>
            </h4>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-sm border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                  <Trophy className="size-4" />
                  <span>Grand Trophy &amp; Team Honors</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Presented the prestigious Golden Championship Cup to the tournament winning team,
                  accompanied by individual medals and certificates of recognition.
                </p>
              </div>

              <div className="rounded-sm border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                  <DollarSign className="size-4" />
                  <span>Direct Cash Prizes</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Distributed direct cash awards in envelopes to the champions, runners-up, highest
                  goal scorer, most valuable player (MVP), and tournament officials.
                </p>
              </div>

              <div className="rounded-sm border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-2">
                  <Shirt className="size-4" />
                  <span>Jersey Sets &amp; Equipment</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Equipped competing grassroots squads (such as KAFC Dandidibabs FC Gumel) with
                  complete, factory-fresh uniform football jerseys and kits.
                </p>
              </div>

              <div className="rounded-sm border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2 text-brand-red font-bold text-sm mb-2">
                  <ShieldCheck className="size-4" />
                  <span>Grassroots Mentorship</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Engaged with hundreds of attending youth, counseling against delinquency and
                  encouraging academic pursuit combined with athletic discipline.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------- 2. LIGHTBOX MODAL: FULL RESOLUTION IMAGE VIEWER */}
      {selectedPhoto && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-3xl bg-slate-950/95 border-slate-800 text-white p-4 sm:p-6 backdrop-blur-xl">
            <div className="relative overflow-hidden rounded-xs bg-black flex items-center justify-center max-h-[75vh]">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                <span>{selectedPhoto.category}</span>
                {selectedPhoto.isMainHeadImage && (
                  <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                    Golden Trophy Presentation
                  </span>
                )}
              </div>
              <h3 className="font-display text-xl font-bold text-white mt-1">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">{selectedPhoto.caption}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}

import { useState, useEffect } from "react";
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
  Maximize2,
  Grid,
  Droplets,
  ChevronLeft,
  ChevronRight,
  Sparkle,
  Play,
  Pause,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

// Ramadan Assets
import ramadanFoodPackages from "@/assets/ramadan-food-packages-10-states.jpg";
import ramadanReliefPackagesBoxesWater from "@/assets/ramadan-relief-packages-boxes-water.jpg";
import ramadanReliefPackageBoxCloseup from "@/assets/ramadan-relief-package-box-closeup.jpg";
import ramadanReliefGridBottledWater from "@/assets/ramadan-relief-grid-bottled-water.jpg";
import ramadanReliefCourtyardDisplay from "@/assets/ramadan-relief-courtyard-display.jpg";
import ramadanReliefCartonsAssembly from "@/assets/ramadan-relief-cartons-assembly.jpg";

export interface RamadanPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  caption: string;
  isMainHeadImage?: boolean;
}

export const ramadanGallery: RamadanPhoto[] = [
  {
    id: "ramadan-relief-boxes-water-courtyard",
    src: ramadanReliefPackagesBoxesWater,
    alt: "Rows of white branded Ramadan Package cartons with packs of bottled table water donated by Abba Roller Foundation and Seyi Tinubu",
    title: "Ramadan Food & Water Packages for Muslim Ummah",
    category: "Food & Water Cartons",
    caption:
      "Extensive rows of white branded cartons featuring food provisions topped with packs of clean bottled drinking water, organized for the Muslim Ummah across Northern Nigeria.",
    isMainHeadImage: true,
  },
  {
    id: "ramadan-relief-box-closeup",
    src: ramadanReliefPackageBoxCloseup,
    alt: "Close-up of official white Ramadan Package carton donated by Abba Roller Foundation (ARF) and Seyi Tinubu with bottled water",
    title: "ARF & Seyi Tinubu Ramadan Relief Package",
    category: "Branded Provisions",
    caption:
      "Official Ramadan Package cartons specially branded with Abba Roller Foundation (ARF) and Seyi Tinubu, dedicated to supporting Muslim families and the Ummah during the sacred month of Ramadan.",
  },
  {
    id: "ramadan-food-packages-cooked-meals",
    src: ramadanFoodPackages,
    alt: "1,500 food package pieces and freshly cooked hot meal packs with whole fish, rice, and fresh vegetables across 10 states",
    title: "1,500 Cooked Food Packages & Bundles",
    category: "Iftar & Sahur Meals",
    caption:
      "Freshly prepared hot takeaway meals featuring seasoned rice, whole fish, and salad greens packaged alongside bundled food parcels for multi-state Ramadan relief.",
  },
  {
    id: "ramadan-relief-grid-bottled-water",
    src: ramadanReliefGridBottledWater,
    alt: "High-angle perspective of columns of Ramadan packages with packs of drinking water",
    title: "Nationwide Staging & Water Logistics",
    category: "Food & Water Cartons",
    caption:
      "Vast grid of food packages and table water packs staged in regional hubs ready for immediate delivery into high-need Muslim communities.",
  },
  {
    id: "ramadan-relief-courtyard-display",
    src: ramadanReliefCourtyardDisplay,
    alt: "Courtyard display showing rows of stacked food boxes and water bottles for Ramadan relief",
    title: "Courtyard Assembly for Fasting Households",
    category: "Grassroots Distribution",
    caption:
      "Organized distribution lines ensuring orderly, dignified, and direct handover of food boxes and table water to fasting individuals and families.",
  },
  {
    id: "ramadan-relief-cartons-assembly",
    src: ramadanReliefCartonsAssembly,
    alt: "Extensive rows of Ramadan food packages and bottled water cartons ready for distribution",
    title: "Comprehensive Relief Consignment",
    category: "Grassroots Distribution",
    caption:
      "Hundreds of boxed food provisions and water bottles prepared to bring relief, hydration, and nutritional sustenance to the Muslim Ummah.",
  },
];

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
    title: "Food Cartons & Clean Water Packs",
    description:
      "Cartons of staple food provisions paired with packs of clean bottled drinking water, ensuring hydration and nourishment during Iftar and Sahur.",
    icon: Droplets,
    badge: "Food & Hydration",
  },
  {
    title: "1,500 Complete Package Pieces",
    description:
      "Every package contains bundled sustenance packs and freshly prepared, high-protein cooked takeaway meals formulated for fasting households.",
    icon: PackageCheck,
    badge: "1,500+ Distributed",
  },
  {
    title: "10-State Nationwide Footprint",
    description:
      "A coordinated logistics operation spanning 10 Nigerian states across the Northwest and Northeast, ensuring simultaneous grassroots reach for the Muslim Ummah.",
    icon: Globe2,
    badge: "10 States",
  },
  {
    title: "Accountable Grassroots Delivery",
    description:
      "Distributed directly in partnership with local community leaders, elders, and Mosques to safeguard absolute transparency and recipient dignity.",
    icon: ShieldCheck,
    badge: "Zero Middlemen",
  },
];

export function RamadanSupportSection({ id = "ramadan-support" }: { id?: string }) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<RamadanPhoto | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Preload all photos so none are delayed or blank
  useEffect(() => {
    ramadanGallery.forEach((photo) => {
      const img = new Image();
      img.src = photo.src;
    });
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    setCurrentSlide(carouselApi.selectedScrollSnap());

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    carouselApi.on("select", onSelect);

    // Automatically slide photos every 5.5 seconds unless paused or hovered
    const autoSlideInterval = setInterval(() => {
      if (isPaused || isHovered || lightboxOpen || detailsModalOpen) return;

      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, 5500);

    return () => {
      carouselApi.off("select", onSelect);
      clearInterval(autoSlideInterval);
    };
  }, [carouselApi, isPaused, isHovered, lightboxOpen, detailsModalOpen]);

  const categories = ["All", ...Array.from(new Set(ramadanGallery.map((item) => item.category)))];

  const filteredPhotos =
    activeCategoryFilter === "All"
      ? ramadanGallery
      : ramadanGallery.filter((item) => item.category === activeCategoryFilter);

  const openLightboxForPhoto = (photo: RamadanPhoto) => {
    setSelectedPhoto(photo);
    setLightboxOpen(true);
  };

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
              <span>
                Seasonal Humanitarian Outreach · Nationwide Ramadan Relief for the Muslim Ummah
              </span>
            </div>
            <h2 className="display-2 mt-4 text-ink">
              Ramadan Support: <span className="text-green-deep">Food &amp; Water Packages</span>{" "}
              Across 10 States
            </h2>
            <p className="lede mt-4">
              Extending compassion, nourishment, and clean hydration during the sacred month. In
              collaboration with Seyi Tinubu, the Abba Roller Foundation mobilized and distributed
              1,500+ specialized Ramadan food cartons alongside packs of clean bottled drinking
              water to the Muslim Ummah across 10 Nigerian states — supporting fasting families,
              orphans, and vulnerable households with uncompromised dignity.
            </p>
          </Reveal>

          <Reveal delay={100} className="shrink-0 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={() => setDetailsModalOpen(true)}
              className="bg-green-deep hover:bg-green-mid text-white font-extrabold gap-2 shadow-lift cursor-pointer"
            >
              <Grid className="size-4" />
              <span>View All Ramadan Photos ({ramadanGallery.length})</span>
            </Button>
            <Button asChild variant="give" size="lg" className="shadow-lift font-bold gap-2">
              <a href="#donate">
                <Heart className="size-4 fill-white animate-pulse" />
                <span>Support Ramadan relief</span>
              </a>
            </Button>
          </Reveal>
        </div>

        {/* 4 Quick Metrics Banner */}
        <Reveal delay={120} className="mt-8 sm:mt-12">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4 lg:gap-6">
            <div className="rounded-sm border border-hairline bg-background p-3.5 sm:p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                  Packages Distributed
                </span>
                <PackageCheck className="size-3.5 sm:size-4 text-brand-red shrink-0" />
              </div>
              <p className="mt-1.5 sm:mt-2 font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-red truncate">
                <AnimatedCounter value="1,500+" />
              </p>
              <span className="text-[10px] sm:text-xs text-ink-soft block truncate">
                Food cartons &amp; water packs
              </span>
            </div>

            <div className="rounded-sm border border-hairline bg-background p-3.5 sm:p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                  States Reached
                </span>
                <Globe2 className="size-3.5 sm:size-4 text-green-mid shrink-0" />
              </div>
              <p className="mt-1.5 sm:mt-2 font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-green-deep truncate">
                <AnimatedCounter value="10 States" />
              </p>
              <span className="text-[10px] sm:text-xs text-ink-soft block truncate">
                Northwest &amp; Northeast
              </span>
            </div>

            <div className="rounded-sm border border-hairline bg-background p-3.5 sm:p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                  Target Beneficiaries
                </span>
                <Moon className="size-3.5 sm:size-4 text-amber-600 shrink-0" />
              </div>
              <p className="mt-1.5 sm:mt-2 font-display text-lg sm:text-2xl lg:text-3xl font-extrabold text-ink truncate">
                Muslim Ummah
              </p>
              <span className="text-[10px] sm:text-xs text-ink-soft block truncate">
                Fasting households &amp; orphans
              </span>
            </div>

            <div className="rounded-sm border border-hairline bg-background p-3.5 sm:p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                  Provisions
                </span>
                <Droplets className="size-3.5 sm:size-4 text-blue-500 shrink-0" />
              </div>
              <p className="mt-1.5 sm:mt-2 font-display text-lg sm:text-2xl lg:text-3xl font-extrabold text-blue-600 truncate">
                Food &amp; Water
              </p>
              <span className="text-[10px] sm:text-xs text-ink-soft block truncate">
                Carton boxes + table water
              </span>
            </div>
          </div>
        </Reveal>

        {/* Central Dual Grid: Interactive Carousel (Left) & 10-State Footprint (Right) */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Interactive Carousel with Field Photos (7 cols) */}
          <Reveal className="lg:col-span-7 flex flex-col gap-4">
            <div
              className="rounded-sm border border-hairline bg-surface p-3.5 shadow-xs"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
              onTouchEnd={() => setIsHovered(false)}
            >
              <Carousel opts={{ loop: true }} setApi={setCarouselApi} className="w-full">
                <CarouselContent>
                  {ramadanGallery.map((photo, index) => (
                    <CarouselItem key={photo.id}>
                      <div className="flex flex-col overflow-hidden rounded-xs border border-hairline bg-surface shadow-xs transition-all">
                        {/* Pure Crisp Photo - ZERO SHADOW, NO OVERLAY GRADIENT */}
                        <div
                          onClick={() => openLightboxForPhoto(photo)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openLightboxForPhoto(photo);
                            }
                          }}
                          className="relative overflow-hidden h-[300px] xs:h-[350px] sm:h-[400px] md:h-[460px] w-full group cursor-pointer select-none bg-slate-950 flex items-center justify-center"
                          aria-label={`Open photo: ${photo.title}`}
                        >
                          {/* Ambient blurred backdrop so the frame is completely filled edge-to-edge */}
                          <img
                            src={photo.src}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 size-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none select-none"
                          />

                          {/* Main picture - 100% fully fitted without cropping or excessive zooming */}
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.02] select-none"
                            loading="eager"
                            decoding="async"
                          />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/85 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-amber-400 backdrop-blur-md border border-amber-400/30">
                              {photo.isMainHeadImage ? (
                                <>
                                  <Moon className="size-3 sm:size-3.5 fill-amber-400 text-amber-400" />
                                  <span>Muslim Ummah Relief</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="size-3 sm:size-3.5" />
                                  <span>{photo.category}</span>
                                </>
                              )}
                            </span>

                            <span className="rounded-full bg-slate-950/85 px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-slate-200 backdrop-blur-md border border-white/10">
                              {index + 1} / {ramadanGallery.length}
                            </span>
                          </div>
                        </div>

                        {/* Caption Below Photo - Zero shadow covering the image */}
                        <div
                          onClick={() => openLightboxForPhoto(photo)}
                          className="p-3.5 sm:p-4 bg-surface border-t border-hairline cursor-pointer hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-display text-xs sm:text-sm font-bold text-ink leading-tight">
                              {photo.title}
                            </p>
                            <span className="text-[11px] text-green-deep font-bold shrink-0 hidden sm:inline-block">
                              Click to Open ↗
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-ink-soft leading-snug line-clamp-2">
                            {photo.caption}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Carousel Controls */}
                <div className="mt-3 flex flex-wrap items-center justify-between px-1 gap-2">
                  <div className="flex items-center gap-2">
                    <CarouselPrevious className="static translate-y-0 size-8 rounded-full border-hairline bg-background text-ink hover:bg-green-deep hover:text-white hover:border-green-deep cursor-pointer" />
                    <CarouselNext className="static translate-y-0 size-8 rounded-full border-hairline bg-background text-ink hover:bg-green-deep hover:text-white hover:border-green-deep cursor-pointer" />

                    {/* Play/Pause Button */}
                    <button
                      type="button"
                      onClick={() => setIsPaused((prev) => !prev)}
                      className="size-8 rounded-full border border-hairline bg-background text-ink hover:bg-green-deep hover:text-white hover:border-green-deep flex items-center justify-center cursor-pointer transition-colors ml-1"
                      aria-label={isPaused ? "Resume auto-slide" : "Pause auto-slide"}
                      title={isPaused ? "Resume auto-slide" : "Pause auto-slide"}
                    >
                      {isPaused ? (
                        <Play className="size-3.5 ml-0.5" />
                      ) : (
                        <Pause className="size-3.5" />
                      )}
                    </button>

                    <span className="text-[11px] sm:text-xs font-semibold text-ink-soft ml-1">
                      {currentSlide + 1} / {ramadanGallery.length}
                      {isPaused && (
                        <span className="ml-1.5 text-[10px] text-amber-600 font-mono">
                          (Paused)
                        </span>
                      )}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDetailsModalOpen(true)}
                    className="text-xs text-green-deep hover:text-green-mid hover:bg-green-wash p-0 h-auto font-bold cursor-pointer"
                  >
                    View All ({ramadanGallery.length}) →
                  </Button>
                </div>
              </Carousel>

              {/* Horizontal Thumbnails Strip */}
              <div className="mt-3 pt-3 border-t border-hairline flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {ramadanGallery.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      carouselApi?.scrollTo(idx);
                      setCurrentSlide(idx);
                    }}
                    className={cn(
                      "relative shrink-0 size-14 rounded-xs overflow-hidden border-2 transition-all cursor-pointer bg-slate-950",
                      currentSlide === idx
                        ? "border-green-deep ring-2 ring-green-mid/40 opacity-100 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100",
                    )}
                    aria-label={`Jump to slide ${idx + 1}: ${item.title}`}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="eager"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Field Verification Strip */}
            <div className="rounded-sm border border-hairline bg-surface p-4 text-xs text-ink-soft flex items-start gap-3">
              <Info className="size-4 text-green-mid shrink-0 mt-0.5" />
              <p>
                <strong className="text-ink font-semibold">
                  Special Ramadan Ummah Initiative:
                </strong>{" "}
                Boxes are packed with staple foodstuffs and distributed alongside full packs of pure
                drinking table water. Donated in compassionate solidarity with Seyi Tinubu and local
                community leadership across Northern Nigeria.
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

            {/* Operational Highlights Cards */}
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
                Direct your Ramadan charity, Fidya, Zakat, or general food donation towards
                certified grassroots feeding across vulnerable communities in Nigeria.
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

      {/* -------------------------------------------------- 1. DIALOG MODAL: ALL RAMADAN PHOTOS */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-hairline p-4 sm:p-6 md:p-8 rounded-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
              <Moon className="size-4 fill-amber-500 text-amber-500" />
              <span>Full Field Documentation · Ramadan Relief for the Muslim Ummah</span>
            </div>
            <DialogTitle className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-ink mt-1">
              Ramadan Food &amp; Water Distribution Archive
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-ink-soft mt-1">
              Photographic records of the 1,500+ food cartons, bottled table water packs, and hot
              meals distributed across 10 states in partnership with Seyi Tinubu.
            </DialogDescription>
          </DialogHeader>

          {/* Category Filter Pills */}
          <div className="mt-4 flex flex-wrap gap-2 border-b border-hairline pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategoryFilter(cat)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer",
                  activeCategoryFilter === cat
                    ? "bg-green-deep text-white shadow-xs"
                    : "bg-surface text-ink-soft hover:bg-surface-muted hover:text-ink",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="mt-6">
            <h4 className="font-display text-lg font-bold text-ink mb-3">
              Distribution Photos ({filteredPhotos.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => openLightboxForPhoto(photo)}
                  className="group relative cursor-pointer overflow-hidden rounded-xs border border-hairline bg-surface transition-all hover:border-green-deep hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                    <LazyImage
                      src={photo.src}
                      alt={photo.alt}
                      aspectRatio="aspect-[4/3]"
                      fitMode="ambient"
                      className="size-full transition-transform duration-300 group-hover:scale-105"
                      width={400}
                      height={300}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="size-9 rounded-full bg-green-deep text-white flex items-center justify-center shadow-md">
                        <Maximize2 className="size-4" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <span className="text-[11px] text-green-deep font-bold mb-1 block">
                      {photo.category}
                    </span>
                    <p className="font-display text-sm font-bold text-ink line-clamp-1">
                      {photo.title}
                    </p>
                    <p className="text-xs text-ink-soft mt-1 line-clamp-2">{photo.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------- 2. LIGHTBOX MODAL */}
      {selectedPhoto && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-background/95 border-hairline p-3.5 sm:p-6 backdrop-blur-xl rounded-md">
            <div className="relative overflow-hidden rounded-xs bg-black flex items-center justify-center max-h-[75vh]">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                className="max-h-[60vh] sm:max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="mt-4">
              <span className="text-xs text-green-deep font-bold block">
                {selectedPhoto.category}
              </span>
              <h3 className="font-display text-xl font-bold text-ink mt-1">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-ink-soft mt-2">{selectedPhoto.caption}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}

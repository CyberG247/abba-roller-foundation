import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
  Sparkle,
  Bath,
  UtensilsCrossed,
  Sparkles as SparklesIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Info,
  Building2,
  MapPin,
  HeartHandshake,
  Grid,
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
import { dutseSchoolGallery, type GalleryPhoto } from "@/data/galleries";

// Detailed breakdown of provisions benefited by the school
const benefitedCategories = [
  {
    title: "Nutritious Food & Sustenance",
    icon: UtensilsCrossed,
    color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    badge: "Food Relief",
    items: [
      "Nutritious cooked meals and hot dishes for students",
      "Essential pantry staples and grains to augment the hostel kitchen",
      "Special dietary support for vulnerable and indigent pupils",
    ],
    description:
      "Ensuring that visually impaired children in the residential hostel have access to dependable, nutritious, and balanced daily nourishment.",
  },
  {
    title: "Laundry Detergents & Sanitization",
    icon: SparklesIcon,
    color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    badge: "Hostel Sanitation",
    items: [
      "Heavy-duty laundry detergent powders for school linens & uniforms",
      "Antiseptic liquids and surface cleaning disinfectants",
      "Multi-purpose washing bars and sanitation soaps",
    ],
    description:
      "Providing ample cleaning and washing detergents so dormitories, bedding, and school clothes are kept consistently sanitary.",
  },
  {
    title: "Sanitary Pads & Menstrual Health",
    icon: Sparkle,
    color: "text-brand-red bg-brand-red-wash border-brand-red/20",
    badge: "Pad Up Care",
    items: [
      "High-absorbency sanitary pad packs distributed to female pupils",
      "Menstrual health education tailored for visually impaired girls",
      "Discreet personal hygiene cases and sanitary disposal supplies",
    ],
    description:
      "Empowering young visually impaired schoolgirls to navigate their menstrual cycles with total confidence, comfort, and uncompromised dignity.",
  },
  {
    title: "Bathing Materials & Toiletries",
    icon: Bath,
    color: "text-green-deep bg-green-wash border-green-deep/20",
    badge: "Personal Care",
    items: [
      "Antibacterial bathing soaps and fragrant toilet bars",
      "Personal body sponges and hygienic washcloths",
      "Dental care kits including toothbrushes and toothpastes",
    ],
    description:
      "Supplying individual personal grooming and bathing packs to reinforce positive daily hygiene habits for every student.",
  },
];

export function VisuallyImpairedSchoolSection({ id = "dutse-outreach" }: { id?: string }) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(dutseSchoolGallery.length);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [activeGalleryModalImage, setActiveGalleryModalImage] = useState<GalleryPhoto | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Preload all photos into memory
  useEffect(() => {
    dutseSchoolGallery.forEach((photo) => {
      const img = new Image();
      img.src = photo.src;
    });
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    setTotalSlides(carouselApi.scrollSnapList().length);
    setCurrentSlide(carouselApi.selectedScrollSnap());

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    carouselApi.on("select", onSelect);

    // Calm auto-slide every 5.5 seconds, paused when hovering or inspecting
    const autoSlideInterval = setInterval(() => {
      if (isPaused || isHovered || detailsModalOpen || lightboxOpen) return;

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
  }, [carouselApi, isPaused, isHovered, detailsModalOpen, lightboxOpen]);

  const openLightboxForPhoto = (photo: GalleryPhoto, index?: number) => {
    const idx = index ?? dutseSchoolGallery.findIndex((p) => p.id === photo.id);
    setSelectedPhotoIndex(idx >= 0 ? idx : 0);
    setActiveGalleryModalImage(photo);
    setLightboxOpen(true);
  };

  const goToPrevPhoto = () => {
    setSelectedPhotoIndex((prev) => {
      const newIdx = (prev - 1 + dutseSchoolGallery.length) % dutseSchoolGallery.length;
      const photo = dutseSchoolGallery[newIdx];
      if (photo) setActiveGalleryModalImage(photo);
      return newIdx;
    });
  };

  const goToNextPhoto = () => {
    setSelectedPhotoIndex((prev) => {
      const newIdx = (prev + 1) % dutseSchoolGallery.length;
      const photo = dutseSchoolGallery[newIdx];
      if (photo) setActiveGalleryModalImage(photo);
      return newIdx;
    });
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelectedPhotoIndex((prev) => {
          const newIdx = (prev - 1 + dutseSchoolGallery.length) % dutseSchoolGallery.length;
          const photo = dutseSchoolGallery[newIdx];
          if (photo) setActiveGalleryModalImage(photo);
          return newIdx;
        });
      }
      if (e.key === "ArrowRight") {
        setSelectedPhotoIndex((prev) => {
          const newIdx = (prev + 1) % dutseSchoolGallery.length;
          const photo = dutseSchoolGallery[newIdx];
          if (photo) setActiveGalleryModalImage(photo);
          return newIdx;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  return (
    <section
      id={id}
      className="scroll-mt-20 py-20 md:py-28 bg-gradient-to-b from-surface via-background to-surface border-t border-hairline relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-10 h-96 w-96 rounded-full bg-green-wash/80 blur-3xl"
      />

      <div className="shell relative">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-red-wash px-3.5 py-1.5 text-xs font-bold text-brand-red border border-brand-red/15 shadow-2xs">
              <Building2 className="size-3.5" />
              <span>Special Education Intervention · Dutse, Jigawa State</span>
            </div>
            <h2 className="display-2 mt-4 text-ink">
              Visually Impaired School <span className="text-green-deep">Dutse Outreach</span>
            </h2>
            <p className="lede mt-4">
              Restoring comfort, health, and dignity for special needs students. The Abba Roller
              Foundation mobilized comprehensive humanitarian relief to the Visually Impaired School
              in Dutse, Jigawa State — delivering nutritious food, laundry detergents, sanitary
              pads, and personal bathing materials directly to students in their residential hostel.
            </p>
          </Reveal>

          <Reveal delay={100} className="shrink-0 flex flex-wrap gap-3">
            {/* Main Trigger Button for Dialog */}
            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={() => setDetailsModalOpen(true)}
              className="bg-green-deep hover:bg-green-mid text-white font-bold gap-2 shadow-lift cursor-pointer"
            >
              <Grid className="size-4" />
              <span>View All Photos &amp; Relief Details</span>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link to="/stories/$slug" params={{ slug: "visually-impaired-school-dutse-jigawa" }}>
                Read Field Story
              </Link>
            </Button>
          </Reveal>
        </div>

        {/* Impact Numbers Bar for the Dutse Intervention */}
        <Reveal delay={120} className="mt-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
            <div className="rounded-sm border border-hairline bg-surface p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Location
                </span>
                <MapPin className="size-4 text-brand-red" />
              </div>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-ink">
                Dutse, Jigawa
              </p>
              <span className="text-xs text-ink-soft">Special Needs School</span>
            </div>

            <div className="rounded-sm border border-hairline bg-surface p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Direct Delivery
                </span>
                <ShieldCheck className="size-4 text-green-mid" />
              </div>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-green-deep">
                <AnimatedCounter value="100%" />
              </p>
              <span className="text-xs text-ink-soft">Zero middlemen handover</span>
            </div>

            <div className="rounded-sm border border-hairline bg-surface p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Care Provisions
                </span>
                <Package className="size-4 text-brand-red" />
              </div>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-ink">
                4+ Pillars
              </p>
              <span className="text-xs text-ink-soft">Food, Pads, Detergents &amp; Bath</span>
            </div>

            <div className="rounded-sm border border-hairline bg-surface p-5 shadow-2xs transition-all hover:border-green-deep">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Welfare Focus
                </span>
                <HeartHandshake className="size-4 text-green-mid" />
              </div>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-green-deep">
                Hostel Life
              </p>
              <span className="text-xs text-ink-soft">Boarding student support</span>
            </div>
          </div>
        </Reveal>

        {/* Central Showcase: Main Head Image Carousel (Left) & Benefited Details (Right) */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Sliding Carousel with Main Head Image */}
          <Reveal className="lg:col-span-6 flex flex-col gap-4">
            <div
              className="rounded-sm border border-hairline bg-surface p-3.5 shadow-xs"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
              onTouchEnd={() => setIsHovered(false)}
            >
              {/* Carousel Container */}
              <Carousel opts={{ loop: true }} setApi={setCarouselApi} className="w-full">
                <CarouselContent>
                  {dutseSchoolGallery.map((photo, index) => (
                    <CarouselItem key={photo.id}>
                      <div className="flex flex-col overflow-hidden rounded-xs border border-hairline bg-surface shadow-xs transition-all">
                        {/* 100% Crisp Photo - ZERO SHADOW, NO DARK GRADIENT OVERLAY */}
                        <div
                          onClick={() => openLightboxForPhoto(photo, index)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openLightboxForPhoto(photo, index);
                            }
                          }}
                          className="relative overflow-hidden h-[300px] xs:h-[350px] sm:h-[400px] md:h-[460px] w-full group cursor-pointer select-none bg-slate-950 flex items-center justify-center"
                          aria-label={`Open photo: ${photo.title}`}
                        >
                          {/* Ambient blurred backdrop so the frame is completely filled edge-to-edge with the photo colors */}
                          <img
                            src={photo.src}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 size-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none select-none"
                          />

                          {/* Main crisp picture: 100% fully fitted without being zoomed or cropped */}
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.02] select-none"
                            loading="eager"
                            decoding="async"
                          />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  "rounded-full px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-sm",
                                  photo.isMainHeadImage
                                    ? "bg-brand-red text-white"
                                    : "bg-slate-950/80 text-white backdrop-blur-xs",
                                )}
                              >
                                {photo.isMainHeadImage ? "Main Head Image" : photo.category}
                              </span>
                              <span className="rounded-full bg-slate-950/80 backdrop-blur-xs px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-white">
                                {index + 1} / {dutseSchoolGallery.length}
                              </span>
                            </div>

                            <div className="inline-flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs border border-white/20">
                              <Maximize2 className="size-3" />
                              <span>Enlarge</span>
                            </div>
                          </div>
                        </div>

                        {/* Caption Below Photo - Zero shadow covering the image */}
                        <div
                          onClick={() => openLightboxForPhoto(photo, index)}
                          className="p-3.5 sm:p-4 bg-surface border-t border-hairline cursor-pointer hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-display text-xs sm:text-sm font-bold text-ink leading-tight">
                              {photo.title}
                            </h4>
                            <span className="text-[11px] text-green-deep font-bold shrink-0 hidden sm:inline-block">
                              Click to Enlarge ↗
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

                {/* Carousel Navigation Controls */}
                <div className="mt-3 flex items-center justify-between px-1 gap-2">
                  <div className="flex items-center gap-2">
                    <CarouselPrevious
                      variant="outline"
                      size="sm"
                      className="static size-8 translate-y-0 text-ink hover:text-green-deep cursor-pointer"
                    />
                    <CarouselNext
                      variant="outline"
                      size="sm"
                      className="static size-8 translate-y-0 text-ink hover:text-green-deep cursor-pointer"
                    />

                    {/* Play/Pause Button */}
                    <button
                      type="button"
                      onClick={() => setIsPaused((prev) => !prev)}
                      className="size-8 rounded-full border border-hairline bg-surface text-ink hover:text-green-deep flex items-center justify-center cursor-pointer transition-colors"
                      aria-label={isPaused ? "Resume auto-slide" : "Pause auto-slide"}
                      title={isPaused ? "Resume auto-slide" : "Pause auto-slide"}
                    >
                      {isPaused ? (
                        <Play className="size-3.5 ml-0.5" />
                      ) : (
                        <Pause className="size-3.5" />
                      )}
                    </button>

                    <span className="text-xs font-semibold text-ink-soft ml-1">
                      {currentSlide + 1} / {totalSlides}
                      {isPaused && (
                        <span className="ml-1 text-[10px] text-green-deep font-mono">(Paused)</span>
                      )}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDetailsModalOpen(true)}
                    className="font-bold text-xs text-green-deep hover:text-brand-red inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye className="size-3.5" />
                    <span>View all ({totalSlides}) →</span>
                  </button>
                </div>

                {/* Horizontal Sliding Thumbnail Strip */}
                <div className="mt-3.5 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {dutseSchoolGallery.map((photo, idx) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => {
                        carouselApi?.scrollTo(idx);
                        setCurrentSlide(idx);
                      }}
                      className={cn(
                        "relative shrink-0 size-13 sm:size-15 rounded-xs overflow-hidden border-2 transition-all cursor-pointer bg-muted",
                        currentSlide === idx
                          ? "border-green-deep ring-2 ring-green-deep/30 opacity-100 scale-105"
                          : "border-hairline opacity-65 hover:opacity-100",
                      )}
                      aria-label={`Jump to slide ${idx + 1}: ${photo.title}`}
                    >
                      <img src={photo.src} alt={photo.alt} className="size-full object-cover" />
                      {photo.isMainHeadImage && (
                        <span className="absolute bottom-0 inset-x-0 bg-brand-red text-white text-[8px] font-bold text-center leading-tight py-0.5">
                          Head
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </Carousel>

              {/* Action Button Below Carousel */}
              <div className="mt-3 border-t border-hairline pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-ink-soft flex items-center gap-1.5">
                  <Info className="size-3.5 text-green-mid" />
                  Slide {currentSlide + 1} of {totalSlides}:{" "}
                  <strong className="text-ink">{dutseSchoolGallery[currentSlide]?.title}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setDetailsModalOpen(true)}
                  className="font-bold text-green-deep hover:text-brand-red inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Eye className="size-3.5" />
                  View all details &amp; gallery ({totalSlides})
                </button>
              </div>
            </div>

            {/* Field Note Strip */}
            <div className="rounded-sm border border-hairline bg-background p-4 text-xs text-ink-soft flex items-start gap-3 shadow-2xs">
              <Info className="size-4 text-green-mid shrink-0 mt-0.5" />
              <p>
                <strong className="text-ink font-semibold">Special Education Outreach:</strong>{" "}
                Students at the Visually Impaired School in Dutse reside primarily on-campus. ARF's
                intervention directly delivered personal hygiene supplies, clothing care products,
                sanitary materials, and wholesome meals to safeguard their everyday welfare.
              </p>
            </div>
          </Reveal>

          {/* Right Column: Detailed Breakdown of What They Benefited */}
          <Reveal delay={140} className="lg:col-span-6 flex flex-col gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-green-deep">
                Comprehensive Care Package
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-ink mt-1">
                What the Students Benefited
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5">
                Every pupil and residential hostel unit received tangible, high-grade essentials to
                support daily living, health, and personal development:
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {benefitedCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.title}
                    className="group rounded-sm border border-hairline bg-surface p-4 shadow-2xs transition-all hover:border-green-deep hover:bg-background"
                  >
                    <div className="flex items-center justify-between">
                      <div className={cn("p-2 rounded-xs border", cat.color)}>
                        <Icon className="size-4.5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface border border-hairline text-ink-soft">
                        {cat.badge}
                      </span>
                    </div>

                    <h4 className="mt-3 font-display text-sm font-bold text-ink group-hover:text-green-deep transition-colors">
                      {cat.title}
                    </h4>

                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {cat.description}
                    </p>

                    <ul className="mt-3 space-y-1.5 border-t border-hairline/80 pt-2.5">
                      {cat.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-ink-soft">
                          <CheckCircle2 className="size-3 text-green-mid shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Modal Open Card Callout */}
            <div className="rounded-sm border border-green-deep/20 bg-gradient-to-br from-green-wash/80 via-surface to-background p-4.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-green-deep text-xs font-bold">
                  <Sparkles className="size-3.5" />
                  <span>Full Field Documentation &amp; Image Archive</span>
                </div>
                <h5 className="font-display text-sm font-bold text-ink mt-0.5">
                  Explore complete outreach inventory &amp; image gallery
                </h5>
                <p className="text-xs text-muted-foreground mt-0.5">
                  See all items distributed, hostel handover photos, and field report details.
                </p>
              </div>

              <Button
                type="button"
                variant="give"
                size="sm"
                onClick={() => setDetailsModalOpen(true)}
                className="shrink-0 font-bold gap-1.5 cursor-pointer"
              >
                <Eye className="size-3.5" />
                <span>Open full details</span>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL OUTREACH DETAILS & ALL IMAGES MODAL DIALOG                           */}
      {/* ========================================================================= */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8 bg-surface rounded-md">
          <DialogHeader>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-red-wash px-3 py-1 text-xs font-bold text-brand-red border border-brand-red/15 w-fit">
              <Building2 className="size-3.5" />
              <span>Dutse Special Needs Relief Archive</span>
            </div>
            <DialogTitle className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-ink mt-2">
              Visually Impaired School In Dutse, Jigawa State
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
              Complete photographic documentation and comprehensive itemized breakdown of the
              welfare relief intervention conducted by the Abba Roller Foundation.
            </DialogDescription>
          </DialogHeader>

          {/* Photo Gallery Grid */}
          <div className="mt-5 sm:mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
              <h4 className="font-display text-sm sm:text-base font-bold text-ink flex items-center gap-2">
                <Grid className="size-4 text-green-mid" />
                <span>Outreach Photo Archive ({dutseSchoolGallery.length} Photos)</span>
              </h4>
              <span className="text-[11px] sm:text-xs text-muted-foreground">
                Click any image to view enlarged caption
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {dutseSchoolGallery.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setActiveGalleryModalImage(photo)}
                  className={cn(
                    "group relative overflow-hidden rounded-sm border cursor-pointer bg-background transition-all hover:shadow-md",
                    activeGalleryModalImage?.id === photo.id
                      ? "border-green-deep ring-2 ring-green-deep/30"
                      : "border-hairline hover:border-green-mid",
                  )}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-950 relative flex items-center justify-center">
                    <img
                      src={photo.src}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 size-full object-cover blur-xl opacity-35 scale-110 pointer-events-none select-none"
                    />
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 select-none"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-mid">
                        {photo.category}
                      </span>
                      {photo.isMainHeadImage && (
                        <span className="rounded-full bg-brand-red text-white text-[9px] font-bold px-1.5 py-0.5">
                          Head Image
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-semibold text-xs text-ink line-clamp-1">
                      {photo.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Enlarge Display Box */}
            {activeGalleryModalImage && (
              <div className="mt-4 rounded-sm border border-green-deep/20 bg-background p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                <div className="w-full sm:w-48 shrink-0 aspect-[4/3] rounded-xs overflow-hidden bg-slate-950 relative flex items-center justify-center">
                  <img
                    src={activeGalleryModalImage.src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 size-full object-cover blur-xl opacity-35 scale-110 pointer-events-none select-none"
                  />
                  <img
                    src={activeGalleryModalImage.src}
                    alt={activeGalleryModalImage.alt}
                    className="relative z-10 max-h-full max-w-full object-contain select-none"
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-green-wash text-green-deep text-[11px] sm:text-xs font-bold px-2.5 py-0.5">
                      {activeGalleryModalImage.category}
                    </span>
                    {activeGalleryModalImage.isMainHeadImage && (
                      <span className="rounded-full bg-brand-red text-white text-[10px] sm:text-xs font-bold px-2 py-0.5">
                        Main Head Image
                      </span>
                    )}
                  </div>
                  <h5 className="font-display text-sm sm:text-base font-bold text-ink mt-1.5 break-words">
                    {activeGalleryModalImage.title}
                  </h5>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {activeGalleryModalImage.caption}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Itemized Benefit Inventory Breakdown */}
          <div className="mt-8 border-t border-hairline pt-6">
            <h4 className="font-display text-base font-bold text-ink mb-3 flex items-center gap-2">
              <Package className="size-4 text-brand-red" />
              <span>Comprehensive Relief &amp; Provisions Inventory</span>
            </h4>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-sm border border-hairline bg-background p-4">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-600">
                  <UtensilsCrossed className="size-4" />
                  <span>1. Food &amp; Nutritional Supplies</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Cooked meal packs, seasoned rice, protein provisions, and essential kitchen
                  supplies delivered to bolster the residential school kitchen and guarantee daily
                  hot meals for pupils.
                </p>
              </div>

              <div className="rounded-sm border border-hairline bg-background p-4">
                <div className="flex items-center gap-2 font-bold text-xs text-blue-600">
                  <SparklesIcon className="size-4" />
                  <span>2. Laundry Detergents &amp; Cleaners</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Cartons of laundry detergent powders, antibacterial soaps, washing bars, and floor
                  disinfectants to support school administrators and students in upholding sanitary
                  hostel living standards.
                </p>
              </div>

              <div className="rounded-sm border border-hairline bg-background p-4">
                <div className="flex items-center gap-2 font-bold text-xs text-brand-red">
                  <Sparkle className="size-4" />
                  <span>3. Sanitary Pads &amp; Menstrual Health</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Cartons of sterile, high-quality sanitary pads provided for visually impaired
                  female students, removing the burden of period poverty and ensuring young girls
                  experience dignity and peace of mind during schooling.
                </p>
              </div>

              <div className="rounded-sm border border-hairline bg-background p-4">
                <div className="flex items-center gap-2 font-bold text-xs text-green-deep">
                  <Bath className="size-4" />
                  <span>4. Bathing Materials &amp; Toiletries</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Toilet bars, antibacterial bath soaps, body sponges, toothbrushes, toothpaste, and
                  personal grooming care kits distributed individually to students.
                </p>
              </div>
            </div>
          </div>

          {/* Foundation Mission Note */}
          <div className="mt-6 rounded-sm border border-hairline bg-surface p-4 text-xs text-ink-soft flex items-start gap-3">
            <Heart className="size-4.5 text-brand-red shrink-0 mt-0.5 fill-brand-red/20" />
            <p className="leading-relaxed">
              <strong className="text-ink font-semibold">
                Hon. Usman Aminu Usman (Founder &amp; Chairman):
              </strong>{" "}
              &ldquo;Special needs children require proactive empathy, dignity, and consistent
              support. Our visit to the Visually Impaired School in Dutse is part of our unwavering
              resolve to ensure that no child is forgotten or left behind, regardless of physical
              challenges.&rdquo;
            </p>
          </div>

          {/* Modal Footer Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-hairline pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDetailsModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Close Archive
            </Button>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                <Link
                  to="/stories/$slug"
                  params={{ slug: "visually-impaired-school-dutse-jigawa" }}
                  onClick={() => setDetailsModalOpen(false)}
                >
                  <span>Read Field Story</span>
                  <ExternalLink className="size-3.5 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="give" size="sm" className="w-full sm:w-auto font-bold">
                <a href="#donate" onClick={() => setDetailsModalOpen(false)}>
                  <Heart className="size-3.5 fill-white animate-pulse" />
                  <span>Support Special Needs Relief</span>
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* LIGHTBOX MODAL: FULL RESOLUTION IMAGE VIEWER */}
      {activeGalleryModalImage && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-4xl max-h-[95vh] overflow-y-auto bg-slate-950/98 border-slate-800 text-white p-3.5 sm:p-6 backdrop-blur-xl rounded-md">
            {/* Image Container with Prev/Next Navigation */}
            <div className="relative overflow-hidden rounded-xs bg-black flex items-center justify-center min-h-[300px] max-h-[75vh]">
              <img
                src={activeGalleryModalImage.src}
                alt={activeGalleryModalImage.alt}
                loading="eager"
                decoding="async"
                className="max-h-[60vh] sm:max-h-[72vh] w-auto max-w-full object-contain select-none"
              />

              {/* Prev / Next Overlay Buttons */}
              <button
                type="button"
                onClick={goToPrevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-slate-950/80 text-white border border-slate-700 hover:bg-green-600 hover:border-green-600 flex items-center justify-center cursor-pointer transition-all shadow-xl"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={goToNextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-slate-950/80 text-white border border-slate-700 hover:bg-green-600 hover:border-green-600 flex items-center justify-center cursor-pointer transition-all shadow-xl"
                aria-label="Next photo"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs text-green-400 font-bold">
                <span>{activeGalleryModalImage.category}</span>
                {activeGalleryModalImage.isMainHeadImage && (
                  <span className="bg-brand-red text-white px-2 py-0.5 rounded">
                    Main Head Image
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-slate-400">
                Photo {selectedPhotoIndex + 1} of {dutseSchoolGallery.length} (Use ← → arrows)
              </span>
            </div>

            <div className="mt-2">
              <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                {activeGalleryModalImage.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {activeGalleryModalImage.caption}
              </p>
            </div>

            {/* Thumbnail Strip inside Lightbox */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {dutseSchoolGallery.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveGalleryModalImage(item);
                    setSelectedPhotoIndex(idx);
                  }}
                  className={cn(
                    "relative shrink-0 size-12 rounded-xs overflow-hidden border-2 transition-all cursor-pointer bg-slate-950",
                    selectedPhotoIndex === idx
                      ? "border-green-500 ring-2 ring-green-500/40 opacity-100 scale-105"
                      : "border-slate-800 opacity-50 hover:opacity-100",
                  )}
                  aria-label={`Jump to photo ${idx + 1}`}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="eager"
                    className="size-full object-cover"
                  />
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}

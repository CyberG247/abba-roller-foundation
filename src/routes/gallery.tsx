import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Image,
  Filter,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  MapPin,
  Sparkles,
  Trophy,
  Heart,
  Package,
  Soup,
  Eye,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Tournaments
import { tournamentGallery } from "@/components/site/FootballTournamentSection";
// Dutse
import { dutseSchoolGallery } from "@/components/site/VisuallyImpairedSchoolSection";
// Ramadan
import { ramadanGallery } from "@/components/site/RamadanSupportSection";
// Weekly feeding
import weeklyFoodMeals from "@/assets/weekly-food-distribution-meals.jpg";
import weeklyFoodBeneficiaries from "@/assets/weekly-food-distribution-beneficiaries.jpg";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
});

interface UnifiedPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  category:
    "Special Needs Education" | "Grassroots Football" | "Ramadan Relief" | "Weekly Nutrition";
  location: string;
  caption: string;
  date: string;
}

const ALL_PHOTOS: UnifiedPhoto[] = [
  // Dutse Photos
  ...dutseSchoolGallery.map((p) => ({
    id: `dutse-${p.id}`,
    src: p.src,
    alt: p.alt,
    title: p.title,
    category: "Special Needs Education" as const,
    location: "Dutse, Jigawa State",
    caption: p.caption,
    date: "Welfare Outreach",
  })),

  // Football Tournament Photos
  ...tournamentGallery.map((p) => ({
    id: `football-${p.id}`,
    src: p.src,
    alt: p.alt,
    title: p.title,
    category: "Grassroots Football" as const,
    location: "Gumel, Jigawa State",
    caption: p.caption,
    date: "Championship Season",
  })),

  // Ramadan Relief Photos
  ...ramadanGallery.map((p) => ({
    id: `ramadan-${p.id}`,
    src: p.src,
    alt: p.alt,
    title: p.title,
    category: "Ramadan Relief" as const,
    location: "10 Northern States",
    caption: p.caption,
    date: "Ramadan Outreach",
  })),

  // Weekly Nutrition
  {
    id: "weekly-nutrition-1",
    src: weeklyFoodBeneficiaries,
    alt: "Children and youths happily holding fresh takeout meals during ARF weekly food distribution",
    title: "Beneficiaries Receiving Takeout Meals",
    category: "Weekly Nutrition",
    location: "Gumel & Municipalities",
    caption:
      "Joyful community children and families holding fresh, packaged hot meal packs during the ARF weekend street feeding outreach.",
    date: "Weekly Outreach",
  },
  {
    id: "weekly-nutrition-2",
    src: weeklyFoodMeals,
    alt: "Freshly prepared nutritious meal containers with whole fish, chicken, fried and jollof rice, and salad stacked for distribution",
    title: "Nutritious Hot Meal Packs with Whole Fish & Salad",
    category: "Weekly Nutrition",
    location: "Jigawa State",
    caption:
      "Balanced, hygienically prepared nutrition packs featuring whole fish, fried/jollof rice, fresh salad greens, and seasoned chicken.",
    date: "Weekly Outreach",
  },
];

const CATEGORIES = [
  "All",
  "Special Needs Education",
  "Grassroots Football",
  "Ramadan Relief",
  "Weekly Nutrition",
] as const;

function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activePhoto, setActivePhoto] = useState<UnifiedPhoto | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredPhotos =
    selectedCategory === "All"
      ? ALL_PHOTOS
      : ALL_PHOTOS.filter((p) => p.category === selectedCategory);

  const openLightbox = (photo: UnifiedPhoto, index: number) => {
    setActivePhoto(photo);
    setActiveIndex(index);
  };

  const nextPhoto = () => {
    const nextIdx = (activeIndex + 1) % filteredPhotos.length;
    setActiveIndex(nextIdx);
    setActivePhoto(filteredPhotos[nextIdx]);
  };

  const prevPhoto = () => {
    const prevIdx = (activeIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setActiveIndex(prevIdx);
    setActivePhoto(filteredPhotos[prevIdx]);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!activePhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "Escape") setActivePhoto(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, activeIndex, filteredPhotos]);

  return (
    <div className="bg-background text-ink min-h-screen">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-deep via-green-deep to-slate-950 text-white py-16 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl"
        />

        <div className="shell relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md border border-white/15">
              <Image className="size-3.5" />
              <span>Media Archive · Photographic Records</span>
            </div>
            <h1 className="display-1 mt-4 text-white">
              Official Photographic <span className="text-amber-400">Field Gallery</span>
            </h1>
            <p className="lede mt-4 text-slate-200">
              Explore authentic high-resolution records of the Abba Roller Foundation&apos;s
              humanitarian missions, special needs interventions, youth athletic tournaments, and
              community sustenance programs across Nigeria.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-400" />
                {ALL_PHOTOS.length} Verified Field Photographs
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400" />4 Key Program Categories
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-400" />
                Dutse, Gumel &amp; 10 Northern States
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="shell py-12 md:py-20">
        {/* Category Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer",
                  selectedCategory === cat
                    ? "bg-green-deep text-white shadow-xs"
                    : "bg-surface text-ink-soft hover:bg-muted border border-hairline",
                )}
              >
                {cat}
                {cat === "All"
                  ? ` (${ALL_PHOTOS.length})`
                  : ` (${ALL_PHOTOS.filter((p) => p.category === cat).length})`}
              </button>
            ))}
          </div>

          <span className="text-xs text-ink-soft">
            Showing <strong>{filteredPhotos.length}</strong> photos
          </span>
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(photo, idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightbox(photo, idx);
                }
              }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-hairline bg-surface cursor-pointer shadow-xs hover:shadow-lg transition-all hover:border-green-deep select-none"
            >
              {/* Photo Frame - Fits & Fills completely edge-to-edge */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="size-10 rounded-full bg-green-deep text-white flex items-center justify-center shadow-lg">
                    <Maximize2 className="size-4" />
                  </div>
                </div>

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10 pointer-events-none">
                  <span className="rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 backdrop-blur-xs border border-white/10">
                    {photo.category}
                  </span>
                  <span className="rounded-full bg-slate-950/70 px-2 py-0.5 text-[9px] font-mono text-slate-300 backdrop-blur-xs">
                    {idx + 1} / {filteredPhotos.length}
                  </span>
                </div>
              </div>

              {/* Caption Card */}
              <div className="p-4">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="size-3 text-brand-red" />
                    {photo.location}
                  </span>
                  <span className="font-mono text-[10px]">{photo.date}</span>
                </div>

                <h3 className="font-display text-sm font-bold text-ink leading-snug group-hover:text-green-deep transition-colors line-clamp-1">
                  {photo.title}
                </h3>
                <p className="mt-1 text-xs text-ink-soft leading-relaxed line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LIGHTBOX DIALOG                                                           */}
      {/* ========================================================================= */}
      {activePhoto && (
        <Dialog open={!!activePhoto} onOpenChange={(open) => !open && setActivePhoto(null)}>
          <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-4xl max-h-[95vh] overflow-y-auto bg-slate-950/98 border-slate-800 text-white p-4 sm:p-6 backdrop-blur-xl rounded-md">
            {/* Image Container with Prev/Next Navigation */}
            <div className="relative overflow-hidden rounded-xs bg-black flex items-center justify-center min-h-[320px] max-h-[70vh]">
              <img
                src={activePhoto.src}
                alt={activePhoto.alt}
                loading="eager"
                decoding="async"
                className="max-h-[60vh] sm:max-h-[68vh] w-auto max-w-full object-contain select-none"
              />

              {/* Prev / Next Buttons */}
              <button
                type="button"
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-slate-950/80 text-white border border-slate-700 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 flex items-center justify-center cursor-pointer transition-all shadow-xl"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-slate-950/80 text-white border border-slate-700 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 flex items-center justify-center cursor-pointer transition-all shadow-xl"
                aria-label="Next photo"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* Info Strip */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 border border-amber-400/30">
                  {activePhoto.category}
                </span>
                <span className="text-slate-400 flex items-center gap-1 font-medium">
                  <MapPin className="size-3 text-brand-red" />
                  {activePhoto.location}
                </span>
              </div>

              <span className="font-mono text-slate-400">
                Photo {activeIndex + 1} of {filteredPhotos.length} (Use ← → arrows)
              </span>
            </div>

            <div className="mt-3">
              <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                {activePhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {activePhoto.caption}
              </p>
            </div>

            {/* Thumbnail Strip inside Lightbox */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {filteredPhotos.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActivePhoto(item);
                    setActiveIndex(idx);
                  }}
                  className={cn(
                    "relative shrink-0 size-12 rounded-xs overflow-hidden border-2 transition-all cursor-pointer bg-slate-950",
                    activeIndex === idx
                      ? "border-amber-400 ring-2 ring-amber-400/40 opacity-100 scale-105"
                      : "border-slate-800 opacity-50 hover:opacity-100",
                  )}
                  aria-label={`Jump to photo ${idx + 1}`}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

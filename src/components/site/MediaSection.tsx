import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MapPin, Tag } from "lucide-react";
import { Reveal } from "./Reveal";
import { LazyImage } from "./LazyImage";
import { Button } from "@/components/ui/button";
import { formatDate } from "./blocks";
import { CMS_PLACEHOLDER, updateCategories, updates } from "@/data/site";
import { cn } from "@/lib/utils";

export function MediaSection({ id = "media" }: { id?: string }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredUpdates =
    activeCategory === "All" ? updates : updates.filter((item) => item.category === activeCategory);

  return (
    <section id={id} className="scroll-mt-20 py-20 md:py-28 bg-background border-t border-hairline">
      <div className="shell">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-brand-red">Verified Field Activities</p>
            <h2 className="display-2 mt-3 text-ink">Media &amp; Field Updates</h2>
            <p className="lede mt-4 max-w-3xl">
              A transparent, documented record of our direct interventions — hospital debt relief,
              custodial centre food provisions, and community pad disbursements.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="shrink-0">
            <Link to="/media" className="inline-flex items-center gap-2">
              Full Media Archive
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap gap-2">
          {["All", ...updateCategories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition-all",
                activeCategory === category
                  ? "border-green-deep bg-green-deep text-on-dark shadow-xs"
                  : "border-hairline bg-surface text-ink-soft hover:border-green-deep hover:text-green-deep",
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Updates Grid */}
        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {filteredUpdates.map((update, index) => (
            <Reveal key={update.id} delay={index * 60} as="article" className="flex flex-col group">
              <div className="overflow-hidden bg-muted rounded-xs border border-hairline shadow-2xs">
                <LazyImage
                  src={update.image}
                  alt={update.imageAlt}
                  aspectRatio="aspect-[16/10]"
                  imagePosition={update.imagePosition || "object-center"}
                  zoomOnHover
                  width={1200}
                  height={800}
                />
              </div>

              <div className="flex flex-1 flex-col pt-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground">
                  <span className="tracking-[0.1em] text-brand-red uppercase font-bold">
                    {update.category}
                  </span>
                  <span aria-hidden>·</span>
                  {update.date === CMS_PLACEHOLDER ? (
                    <span>Date to be confirmed</span>
                  ) : (
                    <time dateTime={update.date}>{formatDate(update.date)}</time>
                  )}
                </div>

                <h3 className="mt-3 font-display text-lg font-bold text-ink group-hover:text-green-deep transition-colors">
                  {update.title}
                </h3>

                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-brand-red shrink-0" />
                  <span>{update.location}</span>
                </p>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {update.summary}
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-hairline pt-4 text-xs text-ink-soft">
                  {update.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2">
                      <span aria-hidden className="mt-1.5 size-1.5 shrink-0 bg-brand-red" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

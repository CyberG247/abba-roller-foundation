import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Download, FileText, PlayCircle, Sparkles } from "lucide-react";

import type { CmsBlock } from "@/data/admin/cmsStore";
import { cn } from "@/lib/utils";

function resolveVideoEmbed(
  url: string,
): { kind: "iframe"; src: string } | { kind: "video"; src: string } | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${videoId}` };
      }
      if (parsed.pathname.startsWith("/embed/")) {
        return { kind: "iframe", src: trimmed };
      }
    }

    if (host === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "");
      if (id) {
        return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}` };
      }
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      if (id) {
        return { kind: "iframe", src: `https://player.vimeo.com/video/${id}` };
      }
    }
  } catch {
    // Allow relative or non-URL video paths to fall back to native video tag
  }

  return { kind: "video", src: trimmed };
}

function SmartActionLink({
  href,
  label,
  className,
  showArrow = true,
}: {
  href: string;
  label: string;
  className: string;
  showArrow?: boolean;
}) {
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
        <span>{label}</span>
        {showArrow && <ArrowRight className="size-4" />}
      </a>
    );
  }

  return (
    <Link to={href as "/"} className={className}>
      <span>{label}</span>
      {showArrow && <ArrowRight className="size-4" />}
    </Link>
  );
}

export function CmsBlockRenderer({
  blocks,
  compactPreview = false,
}: {
  blocks: readonly CmsBlock[];
  compactPreview?: boolean;
}) {
  if (blocks.length === 0) {
    return (
      <div className="border border-dashed border-hairline bg-surface px-6 py-16 text-center text-sm text-muted-foreground">
        No content blocks have been added to this page yet. Add a Hero, Rich-Text Split, Media, or
        CTA block above to begin.
      </div>
    );
  }

  return (
    <div className="divide-y divide-hairline">
      {blocks.map((block) => {
        switch (block.type) {
          case "hero":
            return (
              <section
                key={block.id}
                className={cn(
                  "relative isolate overflow-hidden bg-green-deep text-on-dark",
                  compactPreview ? "px-6 py-12" : "pt-28 pb-16 md:pt-36 md:pb-24",
                )}
              >
                {block.backgroundImageUrl && (
                  <img
                    src={block.backgroundImageUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 size-full object-cover opacity-25"
                  />
                )}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-b from-green-deep/85 via-green-deep/80 to-slate-950/90"
                />
                <div aria-hidden className="motif-grid absolute inset-0 opacity-35" />

                <div className={cn("relative", compactPreview ? "max-w-3xl" : "shell max-w-4xl")}>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-bold text-amber-300">
                    <Sparkles className="size-3.5" />
                    <span>{block.eyebrow}</span>
                  </div>
                  <h1 className="display-1 mt-4 text-white">{block.heading}</h1>
                  <p className="lede mt-4 max-w-2xl text-slate-200">{block.subheading}</p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    {block.primaryCtaLabel && block.primaryCtaHref && (
                      <SmartActionLink
                        href={block.primaryCtaHref}
                        label={block.primaryCtaLabel}
                        className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-amber-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lift transition-colors hover:bg-amber-300"
                      />
                    )}
                    {block.secondaryCtaLabel && block.secondaryCtaHref && (
                      <SmartActionLink
                        href={block.secondaryCtaHref}
                        label={block.secondaryCtaLabel}
                        showArrow={false}
                        className="inline-flex min-h-12 items-center gap-2 rounded-sm border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                      />
                    )}
                  </div>
                </div>
              </section>
            );

          case "rich_split":
            return (
              <section
                key={block.id}
                className={cn("bg-background", compactPreview ? "px-6 py-10" : "py-16 md:py-22")}
              >
                <div
                  className={cn(
                    "grid gap-8 lg:grid-cols-2 lg:items-center",
                    !compactPreview && "shell",
                  )}
                >
                  <div className={cn(block.imagePosition === "left" && "lg:order-2")}>
                    <p className="eyebrow text-brand-red">{block.eyebrow}</p>
                    <h2 className="display-2 mt-2 text-ink">{block.heading}</h2>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {block.body}
                    </p>
                    {block.bulletPoints.length > 0 && (
                      <ul className="mt-6 space-y-2.5">
                        {block.bulletPoints.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-ink-soft">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-deep" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div
                    className={cn(
                      "overflow-hidden rounded-sm border border-hairline bg-surface p-2 shadow-lift",
                      block.imagePosition === "left" && "lg:order-1",
                    )}
                  >
                    <img
                      src={block.imageUrl}
                      alt={block.heading}
                      className="aspect-[16/10] w-full rounded-xs object-cover"
                    />
                  </div>
                </div>
              </section>
            );

          case "impact_reports":
            return (
              <section
                key={block.id}
                className={cn("bg-surface", compactPreview ? "px-6 py-10" : "py-16 md:py-22")}
              >
                <div className={cn(!compactPreview && "shell")}>
                  <h2 className="display-3 text-ink">{block.heading}</h2>

                  {block.counters.length > 0 && (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {block.counters.map((counter, idx) => (
                        <div
                          key={idx}
                          className="rounded-sm border border-hairline bg-background p-6 shadow-2xs"
                        >
                          <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                            {counter.label}
                          </p>
                          <p className="mt-2 font-display text-3xl font-extrabold text-green-deep">
                            {counter.value}
                          </p>
                          {counter.note && (
                            <p className="mt-1.5 text-xs text-muted-foreground">{counter.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {block.pdfReports.length > 0 && (
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {block.pdfReports
                        .map((pdf, idx) => (
                          <SmartActionLink
                            key={idx}
                            href={pdf.url}
                            label={`${pdf.title} (${pdf.fileSize})`}
                            showArrow={false}
                            className="group flex min-h-12 items-center justify-between gap-3 rounded-sm border border-hairline bg-background p-4 text-sm font-bold text-ink transition-colors hover:border-green-deep"
                          />
                        ))
                        .map((el, idx) => {
                          const pdf = block.pdfReports[idx];
                          if (!pdf) return el;
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3 rounded-sm border border-hairline bg-background p-4"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xs bg-brand-red-wash text-brand-red">
                                  <FileText className="size-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-bold text-ink">{pdf.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {pdf.year} · {pdf.fileSize}
                                  </p>
                                </div>
                              </div>
                              <SmartActionLink
                                href={pdf.url}
                                label="Open"
                                showArrow={false}
                                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xs border border-hairline bg-surface px-3 py-1.5 text-xs font-bold text-green-deep hover:bg-green-wash"
                              />
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </section>
            );

          case "media_video": {
            const embed = block.videoUrl ? resolveVideoEmbed(block.videoUrl) : null;
            return (
              <section
                key={block.id}
                className={cn("bg-background", compactPreview ? "px-6 py-10" : "py-16 md:py-22")}
              >
                <div className={cn(!compactPreview && "shell")}>
                  <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-green-mid uppercase">
                    <PlayCircle className="size-4" />
                    <span>
                      {block.mode === "video" ? "Embedded Field Video" : "Verified Field Gallery"}
                    </span>
                  </div>
                  <h2 className="display-3 mt-2 text-ink">{block.heading}</h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{block.caption}</p>

                  {block.mode === "video" && embed ? (
                    <div className="mt-6 overflow-hidden rounded-sm border border-hairline bg-slate-950 shadow-lift">
                      {embed.kind === "iframe" ? (
                        <div className="aspect-video w-full">
                          <iframe
                            src={embed.src}
                            title={block.heading}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="size-full border-0"
                          />
                        </div>
                      ) : (
                        <video src={embed.src} controls className="aspect-video w-full bg-black" />
                      )}
                    </div>
                  ) : (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {block.galleryUrls.map((src, idx) => (
                        <div
                          key={idx}
                          className="overflow-hidden rounded-sm border border-hairline bg-surface shadow-2xs"
                        >
                          <img
                            src={src}
                            alt={`${block.heading} visual ${idx + 1}`}
                            className="aspect-[4/3] w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          case "cta_banner":
            return (
              <section
                key={block.id}
                className={cn(
                  "text-white",
                  block.tone === "navy"
                    ? "bg-slate-900"
                    : block.tone === "red"
                      ? "bg-brand-red"
                      : "bg-green-deep",
                  compactPreview ? "px-6 py-10" : "py-14 md:py-18",
                )}
              >
                <div
                  className={cn(
                    "flex flex-col justify-between gap-6 sm:flex-row sm:items-center",
                    !compactPreview && "shell",
                  )}
                >
                  <div className="max-w-2xl">
                    <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      {block.heading}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">{block.body}</p>
                  </div>
                  <div className="shrink-0">
                    <SmartActionLink
                      href={block.buttonHref}
                      label={block.buttonLabel}
                      className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-amber-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lift transition-colors hover:bg-amber-300"
                    />
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export { Download };

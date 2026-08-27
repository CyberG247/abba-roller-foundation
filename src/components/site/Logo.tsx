import { Link } from "@tanstack/react-router";

import logo from "@/assets/arf-logo-official.png.asset.json";
import { cn } from "@/lib/utils";
import { org } from "@/data/site";

type LogoProps = {
  /** Word-mark colour context. */
  tone?: "dark" | "light";
  className?: string;
  /** Hide the accompanying word-mark (used in tight mobile bars). */
  markOnly?: boolean;
};

/**
 * Official ARF logo lock-up. The mark itself is never recoloured, cropped or
 * distorted — only the accompanying word-mark adapts to its background.
 */
export function Logo({ tone = "dark", className, markOnly = false }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label={`${org.name} — home`}
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <img
        src={logo.url}
        alt={`${org.name} logo`}
        width={56}
        height={56}
        className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12"
      />
      {!markOnly && (
        <span className="min-w-0 leading-tight">
          <span
            className={cn(
              "block font-display text-[0.95rem] font-extrabold tracking-tight",
              tone === "light" ? "text-on-dark" : "text-ink",
            )}
          >
            Abba Roller
          </span>
          <span
            className={cn(
              "block text-[0.68rem] font-semibold tracking-[0.2em] uppercase",
              tone === "light" ? "text-on-dark-muted" : "text-muted-foreground",
            )}
          >
            Foundation
          </span>
        </span>
      )}
    </Link>
  );
}

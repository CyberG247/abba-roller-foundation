import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lede,
  tone = "dark",
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "eyebrow mb-4",
            tone === "light" ? "text-on-dark-muted" : "text-green-mid",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={cn("display-2", tone === "light" ? "text-on-dark" : "text-ink")}>{title}</h2>
      {lede && (
        <p className={cn("lede mt-5", tone === "light" && "text-on-dark-muted")}>{lede}</p>
      )}
    </Reveal>
  );
}

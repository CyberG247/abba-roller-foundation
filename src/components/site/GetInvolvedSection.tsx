import { Link } from "@tanstack/react-router";
import { ArrowRight, HandHeart, HeartHandshake, Megaphone, Users2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { involvementOptions } from "@/data/site";

const iconMap = {
  Volunteer: Users2,
  "Partner With Us": HeartHandshake,
  "Support Our Work": HandHeart,
  Advocate: Megaphone,
};

export function GetInvolvedSection({ id = "get-involved" }: { id?: string }) {
  return (
    <section id={id} className="scroll-mt-20 py-20 md:py-28 bg-surface border-t border-hairline">
      <div className="shell">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-green-mid">Take Action</p>
            <h2 className="display-2 mt-3 text-ink">Get Involved with ARF</h2>
            <p className="lede mt-4 max-w-3xl">
              There is more than one way to stand with these communities — time, expertise,
              advocacy, or resources.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="shrink-0">
            <Link to="/volunteer" className="inline-flex items-center gap-2">
              Apply to Volunteer
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {involvementOptions.map((option, index) => {
            const Icon = iconMap[option.title as keyof typeof iconMap] || HeartHandshake;
            return (
              <Reveal
                key={option.title}
                delay={index * 60}
                className="group flex flex-col justify-between rounded-xs border border-hairline bg-background p-6 shadow-2xs hover:border-green-deep hover:shadow-lift transition-all"
              >
                <div>
                  <div className="flex size-11 items-center justify-center rounded-xs bg-green-wash text-green-deep group-hover:bg-green-deep group-hover:text-white transition-colors mb-5">
                    <Icon className="size-5.5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink">{option.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {option.body}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-hairline">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="px-0 text-green-deep font-bold hover:text-green-mid"
                  >
                    <Link to={option.to} className="inline-flex items-center gap-1.5">
                      {option.cta}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { Check, Copy, Heart, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { org } from "@/data/site";
import { cn } from "@/lib/utils";

const tiers = [
  {
    amount: "5,000",
    numeric: 5000,
    impact:
      "Supplies sanitary pad packs & menstrual hygiene education for 5 schoolgirls in rural Jigawa.",
    tag: "Essential Care",
  },
  {
    amount: "10,000",
    numeric: 10000,
    impact: "Provides 10 menstrual health kits and educational workbooks for students.",
    tag: "Popular",
  },
  {
    amount: "25,000",
    numeric: 25000,
    impact:
      "Settles emergency medical bills and prescription medicine for indigent hospital patients.",
    tag: "Healthcare Relief",
  },
  {
    amount: "50,000",
    numeric: 50000,
    impact:
      "Provides bulk staple food supplies and nutrition relief for a vulnerable household or custodial inmates.",
    tag: "Food Security",
  },
  {
    amount: "100,000",
    numeric: 100000,
    impact:
      "Supplies seed micro-grant capital to restore small petty trade for a female breadwinner.",
    tag: "Empowerment",
  },
];

export function DonationSection({ id = "donate" }: { id?: string }) {
  const [selectedTier, setSelectedTier] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const activeTier = tiers.find((t) => t.numeric === selectedTier) || tiers[1];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id={id}
      className="scroll-mt-20 relative overflow-hidden bg-green-deep py-20 md:py-28 text-on-dark"
    >
      <div aria-hidden className="motif-grid absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-green-light/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -top-40 -right-20 h-96 w-96 rounded-full bg-brand-red/20 blur-3xl"
      />

      <div className="shell relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.3fr] lg:items-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-brand-red-wash backdrop-blur-md">
              <Heart className="size-3.5 fill-brand-red-wash" />
              <span>Direct Community Support</span>
            </div>
            <h2 className="display-2 mt-4 text-on-dark">
              Make a Direct Difference in Northern Nigeria
            </h2>
            <p className="lede mt-5 text-on-dark-muted">
              Every naira contributed is converted directly into verified sanitary provisions,
              emergency hospital bills relief, food packages, and vocational training cohorts.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "100% direct community delivery with zero administrative leakage",
                "Verified documentation published openly on this website",
                "Reaches households and communities most often overlooked",
              ].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-red text-white">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-on-dark">{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-sm border border-white/15 bg-white/5 p-6 backdrop-blur-md">
              <h3 className="text-xs font-bold tracking-wider text-brand-red-wash uppercase">
                Official Giving Inquiries
              </h3>
              <p className="mt-1.5 text-sm text-on-dark-muted">
                For bank transfer details, institutional grants, or CSR collaborations:
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${org.email}?subject=Donation%20Inquiry`}
                  className="font-display font-bold text-on-dark underline decoration-brand-red decoration-2 underline-offset-4 hover:text-brand-red-wash"
                >
                  {org.email}
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(org.email)}
                  className="rounded-xs border border-white/20 px-2.5 py-1 text-xs font-semibold text-on-dark transition-colors hover:bg-white/10"
                >
                  {copied ? "Copied!" : "Copy email"}
                </button>
              </div>
            </div>
          </Reveal>

          {/* Interactive Giving Calculator */}
          <Reveal delay={120}>
            <div className="rounded-sm border border-hairline/20 bg-background p-6 sm:p-8 text-ink shadow-panel">
              <div className="flex items-center justify-between border-b border-hairline pb-4">
                <div>
                  <span className="eyebrow text-green-mid">Choose Impact Amount</span>
                  <h3 className="font-display text-xl font-bold text-ink mt-0.5">
                    Select Contribution
                  </h3>
                </div>
                <Sparkles className="size-5 text-brand-red" />
              </div>

              {/* Tiers list */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {tiers.map((tier) => (
                  <button
                    key={tier.numeric}
                    type="button"
                    onClick={() => {
                      setSelectedTier(tier.numeric);
                      setCustomAmount("");
                    }}
                    className={cn(
                      "relative flex flex-col items-center justify-center rounded-xs p-3.5 text-center transition-all border",
                      selectedTier === tier.numeric && !customAmount
                        ? "border-green-deep bg-green-wash font-bold text-green-deep shadow-xs ring-1 ring-green-deep"
                        : "border-hairline bg-surface text-ink hover:border-green-mid",
                    )}
                  >
                    {tier.tag && (
                      <span className="absolute -top-2 rounded-full bg-brand-red px-1.5 py-0.2 text-[9px] font-extrabold text-white uppercase">
                        {tier.tag}
                      </span>
                    )}
                    <span className="font-display text-lg font-bold">₦{tier.amount}</span>
                  </button>
                ))}
              </div>

              {/* Impact Callout Box */}
              <div className="mt-6 rounded-xs border border-hairline bg-surface p-4.5">
                <div className="flex items-start gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-green-deep text-white">
                    <Heart className="size-3.5 fill-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold tracking-wide text-green-mid uppercase">
                      What Your Gift Achieves
                    </span>
                    <p className="mt-1 text-sm leading-relaxed font-medium text-ink">
                      {activeTier.impact}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Action */}
              <div className="mt-8 flex flex-col gap-3">
                <Button
                  asChild
                  variant="give"
                  size="lg"
                  className="w-full text-base py-6 font-bold shadow-lift"
                >
                  <a
                    href={`mailto:${org.email}?subject=Donation%20of%20NGN%20${selectedTier.toLocaleString()}`}
                  >
                    Proceed to Support (₦{selectedTier.toLocaleString()})
                  </a>
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Secure direct giving · Official Foundation receipt and impact confirmation
                  provided.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

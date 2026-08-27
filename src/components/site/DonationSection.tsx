import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Heart,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
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

const BANK_DETAILS = {
  bankName: "First Bank of Nigeria",
  accountName: "Abba Roller Foundation",
  accountNumber: "1024889201",
  accountType: "Corporate / Nonprofit Account",
};

export function DonationSection({ id = "donate" }: { id?: string }) {
  const [selectedTier, setSelectedTier] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [step, setStep] = useState<"select" | "complete">("select");

  const activeAmount = customAmount ? parseInt(customAmount, 10) || selectedTier : selectedTier;
  const activeTier = tiers.find((t) => t.numeric === selectedTier) || tiers[1];
  const refCode = `ARF-${activeAmount.toString().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleCopyRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Abba Roller Foundation,\n\nI would like to complete my donation of ₦${activeAmount.toLocaleString()} to support your community programmes.\n\nReference: ${refCode}\nPurpose: ${activeTier.impact}`,
  );

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
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.3fr] lg:items-start">
          {/* Left Column: Mission & Trust Info */}
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-brand-red-wash backdrop-blur-md border border-white/15">
              <Heart className="size-3.5 fill-brand-red-wash animate-pulse" />
              <span>Direct Community Giving</span>
            </div>
            <h2 className="display-2 mt-4 text-on-dark">
              Make a Direct Difference in Northern Nigeria
            </h2>
            <p className="lede mt-5 text-on-dark-muted">
              Every naira contributed is converted directly into verified sanitary provisions,
              emergency hospital bills relief, food packages, and vocational training cohorts across
              Jigawa and Kano States.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "100% direct community delivery with zero administrative leakage",
                "Official confirmation and verified field reporting published openly",
                "Reaches the most vulnerable households, students, and custodial inmates",
              ].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-red text-white shadow-xs">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-on-dark">{point}</span>
                </div>
              ))}
            </div>

            {/* Quick Banking Summary Box */}
            <div className="mt-10 rounded-sm border border-white/20 bg-white/5 p-6 backdrop-blur-md shadow-xs">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <Building2 className="size-5 text-brand-red-wash" />
                  <h3 className="text-xs font-bold tracking-wider text-on-dark uppercase">
                    Official Foundation Account
                  </h3>
                </div>
                <span className="rounded-full bg-green-wash/20 px-2.5 py-0.5 text-[11px] font-semibold text-on-dark">
                  Verified FBN
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-on-dark-muted">
                <p>
                  <strong className="text-on-dark">Bank:</strong> {BANK_DETAILS.bankName}
                </p>
                <p>
                  <strong className="text-on-dark">Account Name:</strong> {BANK_DETAILS.accountName}
                </p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2 rounded-xs bg-black/20 p-3 font-mono">
                  <span className="text-base font-bold text-on-dark tracking-wider">
                    {BANK_DETAILS.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="inline-flex items-center gap-1.5 rounded-xs bg-white/20 px-3 py-1 text-xs font-sans font-bold text-on-dark transition-colors hover:bg-white/30"
                  >
                    {copiedAccount ? (
                      <>
                        <Check className="size-3 text-green-light" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy Number</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Step 1 (Select Amount) or Step 2 (Complete Support) */}
          <Reveal delay={120}>
            <div className="rounded-sm border border-hairline/20 bg-background p-6 sm:p-8 text-ink shadow-panel transition-all">
              {step === "select" ? (
                <>
                  <div className="flex items-center justify-between border-b border-hairline pb-4">
                    <div>
                      <span className="eyebrow text-green-mid">Step 1 of 2 · Choose Impact</span>
                      <h3 className="font-display text-xl font-bold text-ink mt-0.5">
                        Select Contribution Tier
                      </h3>
                    </div>
                    <Sparkles className="size-5 text-brand-red" />
                  </div>

                  {/* Tiers Grid */}
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
                          "relative flex flex-col items-center justify-center rounded-xs p-3.5 text-center transition-all border cursor-pointer",
                          selectedTier === tier.numeric && !customAmount
                            ? "border-green-deep bg-green-wash font-bold text-green-deep shadow-xs ring-2 ring-green-deep/30"
                            : "border-hairline bg-surface text-ink hover:border-green-mid",
                        )}
                      >
                        {tier.tag && (
                          <span className="absolute -top-2 rounded-full bg-brand-red px-2 py-0.5 text-[9px] font-extrabold text-white uppercase shadow-xs">
                            {tier.tag}
                          </span>
                        )}
                        <span className="font-display text-lg font-extrabold">₦{tier.amount}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount Input */}
                  <div className="mt-4">
                    <label
                      htmlFor="custom-amount"
                      className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5"
                    >
                      Or Enter Custom Amount (₦)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center font-display font-bold text-muted-foreground text-sm">
                        ₦
                      </span>
                      <input
                        id="custom-amount"
                        type="number"
                        min={1000}
                        step={1000}
                        placeholder="e.g. 150000"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full rounded-xs border border-hairline bg-surface py-2.5 pl-8 pr-4 text-sm font-bold text-ink outline-none transition-colors focus:border-green-deep focus:bg-background"
                      />
                    </div>
                  </div>

                  {/* Impact Description Card */}
                  <div className="mt-6 rounded-xs border border-hairline bg-surface p-4.5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-deep text-white shadow-xs">
                        <Heart className="size-4 fill-white" />
                      </div>
                      <div>
                        <span className="text-xs font-bold tracking-wide text-green-mid uppercase">
                          Verified Impact Outcome
                        </span>
                        <p className="mt-1 text-sm leading-relaxed font-semibold text-ink">
                          {activeTier.impact}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action CTA to Proceed to Step 2 */}
                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("complete")}
                      className="btn-shine group relative w-full overflow-hidden rounded-sm bg-gradient-to-r from-brand-red via-brand-red to-brand-red-bright py-4 px-6 text-center text-base font-extrabold text-white shadow-lg shadow-brand-red/30 ring-1 ring-white/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-red/45 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      <span className="relative z-10 inline-flex items-center justify-center gap-2">
                        <span>Proceed to Complete Support (₦{activeAmount.toLocaleString()})</span>
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </button>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="size-3.5 text-green-deep" />
                        Verified official channel
                      </span>
                      <Link
                        to="/donate"
                        className="font-semibold text-green-deep underline underline-offset-2 hover:text-green-mid"
                      >
                        Full donation page →
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                /* Step 2: Complete Support Details */
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between border-b border-hairline pb-4">
                    <button
                      type="button"
                      onClick={() => setStep("select")}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-soft hover:text-green-deep transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="size-3.5" />
                      <span>Change amount</span>
                    </button>
                    <span className="rounded-full bg-brand-red-wash px-3 py-1 text-xs font-extrabold text-brand-red">
                      Target: ₦{activeAmount.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-black text-ink">
                      Complete Your Support
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Transfer directly to the Foundation's official account below or confirm via
                      WhatsApp.
                    </p>
                  </div>

                  {/* Transfer Details Card */}
                  <div className="rounded-sm border-2 border-green-deep/30 bg-green-wash/40 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Bank Name
                      </span>
                      <span className="font-display text-sm font-extrabold text-ink">
                        {BANK_DETAILS.bankName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-hairline pt-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Account Name
                      </span>
                      <span className="font-display text-sm font-extrabold text-ink">
                        {BANK_DETAILS.accountName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-hairline pt-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Account Number
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-black text-green-deep">
                          {BANK_DETAILS.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyAccount}
                          className="rounded-xs bg-green-deep px-2 py-1 text-[11px] font-bold text-white transition-all hover:bg-green-mid cursor-pointer"
                        >
                          {copiedAccount ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-hairline pt-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Payment Reference
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-ink">{refCode}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyRef(refCode)}
                          className="text-[11px] font-semibold text-green-deep underline hover:text-green-mid cursor-pointer"
                        >
                          {copiedRef ? "Copied!" : "Copy ref"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Immediate Confirmation Buttons */}
                  <div className="space-y-3 pt-2">
                    <a
                      href={`https://wa.me/2348000000000?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex w-full items-center justify-center gap-2.5 rounded-sm bg-[#25D366] px-5 py-3.5 text-sm font-extrabold text-white shadow-md transition-all hover:bg-[#1EBE5D] hover:shadow-lg active:scale-[0.99]"
                    >
                      <MessageCircle className="size-4.5 fill-white" />
                      <span>Confirm Donation on WhatsApp</span>
                    </a>

                    <a
                      href={`mailto:${org.email}?subject=Donation%20Receipt%20-%20₦${activeAmount.toLocaleString()}&body=Hello%20Abba%20Roller%20Foundation,%0A%0AI%20have%20transferred%20₦${activeAmount.toLocaleString()}%20with%20reference%20${refCode}.%0A%0APlease%20confirm%20receipt.%0A%0AThank%20you!`}
                      className="flex w-full items-center justify-center gap-2 rounded-sm border border-hairline bg-surface px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-muted"
                    >
                      <span>Send Payment Notification via Email</span>
                    </a>

                    <Button
                      asChild
                      variant="outline"
                      size="default"
                      className="w-full text-xs font-semibold"
                    >
                      <Link to="/donate">
                        <span>Open Full Dedicated Giving Portal</span>
                        <ExternalLink className="size-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

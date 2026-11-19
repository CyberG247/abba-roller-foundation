import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Copy,
  ExternalLink,
  Heart,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { CMS_PLACEHOLDER, donationTiers, org } from "@/data/site";
import { cn, copyToClipboard } from "@/lib/utils";

export function DonationSection({ id = "donate" }: { id?: string }) {
  const [selectedTier, setSelectedTier] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [step, setStep] = useState<"select" | "complete">("select");
  const [refSuffix] = useState<number>(() => Math.floor(1000 + Math.random() * 9000));

  const parsedCustom = customAmount ? parseInt(customAmount, 10) : 0;
  const hasCustom = Boolean(customAmount && parsedCustom > 0);
  const activeAmount = hasCustom ? parsedCustom : selectedTier;

  const matchedTier = donationTiers.find((t) => t.numeric === selectedTier) ?? donationTiers[1]!;

  const impactDescription = hasCustom
    ? `Custom contribution of ₦${activeAmount.toLocaleString()} supporting priority ARF food relief, menstrual health kits, and emergency medical aid.`
    : matchedTier.impact;

  const refCode = useMemo(
    () => `ARF-${activeAmount.toString().slice(0, 4)}-${refSuffix}`,
    [activeAmount, refSuffix],
  );

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.65 },
        colors: ["#145A43", "#1B6B50", "#E53935", "#F59E0B", "#ffffff"],
      });
    } catch {
      // ignore if confetti fails
    }
  };

  const handleCopyAccount = async () => {
    const ok = await copyToClipboard(org.bankDetails.accountNumber);
    if (!ok) {
      toast.error("Please copy the account number manually.");
      return;
    }
    setCopiedAccount(true);
    toast.success("Account number copied to clipboard.");
    triggerCelebration();
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleCopyRef = async () => {
    const ok = await copyToClipboard(refCode);
    if (!ok) return;
    setCopiedRef(true);
    toast.success("Payment reference copied.");
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handleProceed = () => {
    if (hasCustom && activeAmount < 500) {
      toast.error("Minimum custom contribution is ₦500.");
      return;
    }
    setStep("complete");
    triggerCelebration();
  };

  const confirmationPlainText = `Hello Abba Roller Foundation,\n\nI have completed a transfer of ₦${activeAmount.toLocaleString()} to support your community programmes.\n\nBank: ${org.bankDetails.bankName}\nAccount: ${org.bankDetails.accountNumber}\nReference: ${refCode}\nPurpose: ${impactDescription}`;

  const handleCopyConfirmation = async () => {
    const ok = await copyToClipboard(confirmationPlainText);
    if (!ok) {
      toast.error("Unable to copy confirmation text.");
      return;
    }
    setCopiedReceipt(true);
    toast.success(`Transfer summary copied — you can email it to ${org.email}.`);
    setTimeout(() => setCopiedReceipt(false), 3000);
  };

  const mailtoHref = `mailto:${org.email}?subject=${encodeURIComponent(
    `Donation Receipt - ₦${activeAmount.toLocaleString()} (${refCode})`,
  )}&body=${encodeURIComponent(confirmationPlainText)}`;

  const rawPhone: string = org.phone;
  const phoneDigits = rawPhone !== CMS_PLACEHOLDER ? rawPhone.replace(/[^\d]/g, "") : "";

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
                  Verified Account
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-on-dark-muted">
                <p>
                  <strong className="text-on-dark">Bank:</strong> {org.bankDetails.bankName}
                </p>
                <p>
                  <strong className="text-on-dark">Account Name:</strong>{" "}
                  {org.bankDetails.accountName}
                </p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2 rounded-xs bg-black/20 p-3 font-mono">
                  <span className="text-base font-bold text-on-dark tracking-wider">
                    {org.bankDetails.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="inline-flex items-center gap-1.5 rounded-xs bg-white/20 px-3 py-1 text-xs font-sans font-bold text-on-dark transition-colors hover:bg-white/30 cursor-pointer"
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
            <div className="rounded-sm border border-hairline/20 bg-background p-4 sm:p-6 md:p-8 text-ink shadow-panel transition-all">
              {step === "select" ? (
                <>
                  <div className="flex items-center justify-between border-b border-hairline pb-4">
                    <div>
                      <span className="eyebrow text-green-mid">Step 1 of 2 · Choose Impact</span>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-ink mt-0.5">
                        Select Contribution Tier
                      </h3>
                    </div>
                    <Sparkles className="size-4.5 sm:size-5 text-brand-red shrink-0" />
                  </div>

                  {/* Tiers Grid */}
                  <div className="mt-5 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                    {donationTiers.map((tier) => (
                      <button
                        key={tier.numeric}
                        type="button"
                        onClick={() => {
                          setSelectedTier(tier.numeric);
                          setCustomAmount("");
                        }}
                        className={cn(
                          "relative flex flex-col items-center justify-center rounded-xs p-2.5 sm:p-3.5 text-center transition-all border cursor-pointer",
                          selectedTier === tier.numeric && !customAmount
                            ? "border-green-deep bg-green-wash font-bold text-green-deep shadow-xs ring-2 ring-green-deep/30"
                            : "border-hairline bg-surface text-ink hover:border-green-mid",
                        )}
                      >
                        {tier.tag && (
                          <span className="absolute -top-2 rounded-full bg-brand-red px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-extrabold text-white uppercase shadow-xs">
                            {tier.tag}
                          </span>
                        )}
                        <span className="font-display text-base sm:text-lg font-extrabold">
                          ₦{tier.amount}
                        </span>
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
                        min={500}
                        step={500}
                        placeholder="e.g. 150000"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full rounded-xs border border-hairline bg-surface py-2.5 pl-8 pr-4 text-sm font-bold text-ink outline-none transition-colors focus:border-green-deep focus:bg-background"
                      />
                    </div>
                  </div>

                  {/* Impact Description Card */}
                  <div className="mt-5 sm:mt-6 rounded-xs border border-hairline bg-surface p-3.5 sm:p-4.5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-deep text-white shadow-xs">
                        <Heart className="size-4 fill-white" />
                      </div>
                      <div>
                        <span className="text-xs font-bold tracking-wide text-green-mid uppercase">
                          Verified Impact Outcome
                        </span>
                        <p className="mt-1 text-xs sm:text-sm leading-relaxed font-semibold text-ink">
                          {impactDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action CTA to Proceed to Step 2 */}
                  <div className="mt-6 sm:mt-8 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={handleProceed}
                      className="btn-shine group relative w-full overflow-hidden rounded-sm bg-gradient-to-r from-brand-red via-brand-red to-brand-red-bright py-3.5 sm:py-4 px-4 sm:px-6 text-center text-sm sm:text-base font-extrabold text-white shadow-lg shadow-brand-red/30 ring-1 ring-white/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-red/45 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
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
                <div className="space-y-5 sm:space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between border-b border-hairline pb-4">
                    <button
                      type="button"
                      onClick={() => setStep("select")}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-soft hover:text-green-deep transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="size-3.5" />
                      <span>Change amount</span>
                    </button>
                    <span className="rounded-full bg-brand-red-wash px-2.5 sm:px-3 py-1 text-xs font-extrabold text-brand-red">
                      Target: ₦{activeAmount.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-black text-ink">
                      Complete Your Support
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Transfer directly to the Foundation&apos;s official account below, then notify
                      us by email for immediate receipt confirmation.
                    </p>
                  </div>

                  {/* Transfer Details Card */}
                  <div className="rounded-sm border-2 border-green-deep/30 bg-green-wash/40 p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-1 sm:gap-0">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Bank Name
                      </span>
                      <span className="font-display text-sm font-extrabold text-ink">
                        {org.bankDetails.bankName}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-1 sm:gap-0 border-t border-hairline pt-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Account Name
                      </span>
                      <span className="font-display text-sm font-extrabold text-ink">
                        {org.bankDetails.accountName}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-1.5 sm:gap-0 border-t border-hairline pt-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Account Number
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-black text-green-deep">
                          {org.bankDetails.accountNumber}
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

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-1.5 sm:gap-0 border-t border-hairline pt-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Payment Reference
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-ink">{refCode}</span>
                        <button
                          type="button"
                          onClick={handleCopyRef}
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
                      href={mailtoHref}
                      className="btn-shine group flex w-full items-center justify-center gap-2.5 rounded-sm bg-green-deep px-5 py-3.5 text-sm font-extrabold text-white shadow-md transition-all hover:bg-green-mid hover:shadow-lg active:scale-[0.99]"
                    >
                      <Mail className="size-4.5" />
                      <span>Send Proof of Transfer ({org.email})</span>
                    </a>

                    {phoneDigits && (
                      <a
                        href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(confirmationPlainText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] px-5 py-3 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-[#1EBE5D]"
                      >
                        <span>Confirm Donation on WhatsApp</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={handleCopyConfirmation}
                      className="flex w-full items-center justify-center gap-2 rounded-sm border border-hairline bg-surface px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-muted cursor-pointer"
                    >
                      <Copy className="size-4" />
                      <span>
                        {copiedReceipt
                          ? "Confirmation Summary Copied!"
                          : "Copy Transfer Confirmation Message"}
                      </span>
                    </button>

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

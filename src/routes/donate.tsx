import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import confetti from "canvas-confetti";
import { Copy, Heart, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/blocks";
import { CMS_PLACEHOLDER, donationAllocations, donationTiers, org } from "@/data/site";
import { cn, copyToClipboard } from "@/lib/utils";

const title = "Donate & Complete Support — Abba Roller Foundation";
const description =
  "Support education, skills training, humanitarian aid and menstrual health programmes for youth and women in Northern Nigeria.";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: DonatePage,
});

function DonatePage() {
  const [selectedTier, setSelectedTier] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
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
      // ignore
    }
  };

  const handleCopyAccount = async () => {
    const ok = await copyToClipboard(org.bankDetails.accountNumber);
    if (!ok) {
      toast.error("Please copy the account number manually.");
      return;
    }
    setCopiedAccount(true);
    toast.success("Official Polaris Bank account number copied.");
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

  const confirmationPlainText = `Hello Abba Roller Foundation,\n\nI have completed my donation of ₦${activeAmount.toLocaleString()} to support your community programmes.\n\nBank: ${org.bankDetails.bankName}\nAccount: ${org.bankDetails.accountNumber}\nReference: ${refCode}\nPurpose: ${impactDescription}`;

  const handleCopyConfirmation = async () => {
    const ok = await copyToClipboard(confirmationPlainText);
    if (!ok) {
      toast.error("Unable to copy confirmation text.");
      return;
    }
    setCopiedReceipt(true);
    toast.success(`Transfer summary copied — you can send it to ${org.email}.`);
    setTimeout(() => setCopiedReceipt(false), 3000);
  };

  const mailtoHref = `mailto:${org.email}?subject=${encodeURIComponent(
    `Donation Receipt - ₦${activeAmount.toLocaleString()} (${refCode})`,
  )}&body=${encodeURIComponent(confirmationPlainText)}`;

  const rawPhone: string = org.phone;
  const phoneDigits = rawPhone !== CMS_PLACEHOLDER ? rawPhone.replace(/[^\d]/g, "") : "";

  return (
    <>
      <PageHeader
        eyebrow="Official Giving Portal"
        title="Complete Your Support"
        lede="Your gift is deployed directly to community programmes across Northern Nigeria — verified on the ground with open reporting."
        crumbs={[{ label: "Donate" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
          {/* Main Donation Completion Card */}
          <Reveal className="rounded-sm border border-hairline bg-surface p-6 sm:p-10 shadow-lift space-y-8">
            <div>
              <span className="eyebrow text-brand-red">Step 1 · Choose Your Contribution</span>
              <h2 className="font-display text-2xl font-bold text-ink mt-1">Select Amount</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Select a standard contribution tier or enter a custom amount.
              </p>
            </div>

            {/* Tiers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {donationTiers.map((tier) => (
                <button
                  key={tier.numeric}
                  type="button"
                  onClick={() => {
                    setSelectedTier(tier.numeric);
                    setCustomAmount("");
                  }}
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-xs p-4 text-center transition-all border cursor-pointer",
                    selectedTier === tier.numeric && !customAmount
                      ? "border-green-deep bg-green-wash font-bold text-green-deep shadow-xs ring-2 ring-green-deep/40"
                      : "border-hairline bg-background text-ink hover:border-green-mid",
                  )}
                >
                  {tier.tag && (
                    <span className="absolute -top-2 rounded-full bg-brand-red px-2 py-0.5 text-[9px] font-extrabold text-white uppercase shadow-xs">
                      {tier.tag}
                    </span>
                  )}
                  <span className="font-display text-lg sm:text-xl font-black">₦{tier.amount}</span>
                </button>
              ))}
            </div>

            {/* Custom Amount Field */}
            <div>
              <label
                htmlFor="custom-donate-amount"
                className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Or Enter Custom Amount (₦)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center font-display font-bold text-muted-foreground text-sm">
                  ₦
                </span>
                <input
                  id="custom-donate-amount"
                  type="number"
                  min={500}
                  step={500}
                  placeholder="e.g. 250000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full rounded-xs border border-hairline bg-background py-3 pl-9 pr-4 text-base font-bold text-ink outline-none transition-colors focus:border-green-deep"
                />
              </div>
            </div>

            {/* Impact Box */}
            <div className="rounded-xs border border-hairline bg-background p-4.5">
              <div className="flex items-start gap-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-deep text-white shadow-xs">
                  <Heart className="size-4.5 fill-white" />
                </div>
                <div>
                  <span className="text-xs font-bold tracking-wide text-green-mid uppercase">
                    Your Impact Outcome
                  </span>
                  <p className="mt-1 text-sm font-semibold text-ink leading-relaxed">
                    {impactDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Bank Transfer Details Card */}
            <div className="pt-4 border-t border-hairline space-y-4">
              <div>
                <span className="eyebrow text-green-mid">
                  Step 2 · Direct Bank Transfer Details
                </span>
                <h3 className="font-display text-xl font-extrabold text-ink mt-0.5">
                  Transfer ₦{activeAmount.toLocaleString()} to Foundation Account
                </h3>
              </div>

              <div className="rounded-sm border-2 border-green-deep/30 bg-green-wash/40 p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Bank
                  </span>
                  <span className="font-display text-sm font-extrabold text-ink">
                    {org.bankDetails.bankName}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-hairline pt-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Account Name
                  </span>
                  <span className="font-display text-sm font-extrabold text-ink">
                    {org.bankDetails.accountName}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-hairline pt-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Account Number
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-black text-green-deep">
                      {org.bankDetails.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="rounded-xs bg-green-deep px-2.5 py-1 text-xs font-bold text-white transition-all hover:bg-green-mid cursor-pointer"
                    >
                      {copiedAccount ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-hairline pt-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Reference
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ink">{refCode}</span>
                    <button
                      type="button"
                      onClick={handleCopyRef}
                      className="text-xs font-semibold text-green-deep underline hover:text-green-mid cursor-pointer"
                    >
                      {copiedRef ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Instant Notification Buttons */}
              <div className="space-y-3 pt-3">
                <a
                  href={mailtoHref}
                  className="btn-shine group flex w-full items-center justify-center gap-2.5 rounded-sm bg-green-deep px-5 py-4 text-sm font-extrabold text-white shadow-md transition-all hover:bg-green-mid hover:shadow-lg active:scale-[0.99]"
                >
                  <Mail className="size-5" />
                  <span>Email Proof of Transfer ({org.email})</span>
                </a>

                {phoneDigits && (
                  <a
                    href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(confirmationPlainText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] px-5 py-3.5 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-[#1EBE5D]"
                  >
                    <span>Notify / Confirm on WhatsApp</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleCopyConfirmation}
                  className="flex w-full items-center justify-center gap-2 rounded-sm border border-hairline bg-background px-5 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-muted cursor-pointer"
                >
                  <Copy className="size-4" />
                  <span>
                    {copiedReceipt
                      ? "Confirmation Summary Copied!"
                      : "Copy Transfer Confirmation Summary"}
                  </span>
                </button>
              </div>
            </div>
          </Reveal>

          {/* Side Column: Allocations & Transparency */}
          <div className="space-y-8">
            <Reveal
              delay={100}
              className="rounded-sm border border-hairline bg-surface p-8 shadow-xs"
            >
              <h3 className="font-display text-xl font-bold text-ink">Where your gift goes</h3>
              <div className="mt-6 divide-y divide-hairline border-y border-hairline">
                {donationAllocations.map((item) => (
                  <article key={item.title} className="py-4.5">
                    <h4 className="font-display text-sm font-bold text-ink">{item.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal
              delay={150}
              className="rounded-sm bg-green-deep p-8 text-on-dark shadow-lift relative overflow-hidden"
            >
              <div aria-hidden="true" className="motif-grid absolute inset-0 opacity-30" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-brand-red-wash">
                  <ShieldCheck className="size-5" />
                  <span className="eyebrow text-brand-red-wash">Transparency Pledge</span>
                </div>
                <h4 className="mt-3 font-display text-lg font-bold text-on-dark">
                  100% Verified Field Audit
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-on-dark-muted">
                  Every disbursement and aid package is published under our Media &amp; Updates
                  archive with photographic verification and community leader sign-off.
                </p>
                <div className="mt-6 pt-4 border-t border-white/15">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs font-bold text-on-dark underline decoration-brand-red decoration-2 underline-offset-4 hover:text-brand-red-wash"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}

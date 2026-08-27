import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Heart,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/blocks";
import { org } from "@/data/site";
import { cn } from "@/lib/utils";

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

const tiers = [
  {
    amount: "5,000",
    numeric: 5000,
    impact: "Supplies sanitary pad packs & menstrual hygiene education for 5 schoolgirls.",
    tag: "Essential Care",
  },
  {
    amount: "10,000",
    numeric: 10000,
    impact:
      "Provides 10 menstrual health kits and educational workbooks for students in rural LGAs.",
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

const allocations = [
  {
    title: "Menstrual Health & Dignity",
    body: "Sanitary products distributed alongside educational sessions so girls in Jigawa and Kano do not miss classes.",
  },
  {
    title: "Skills & Vocational Training",
    body: "Materials, tailoring Cohorts, toolkits and ongoing mentorship for young people and women.",
  },
  {
    title: "Humanitarian & Food Security",
    body: "Food staples and household support for vulnerable families and custodial centres.",
  },
  {
    title: "Emergency Medical Relief",
    body: "Immediate hospital bill clearance for indigent patients at Gumel General Hospital and regional clinics.",
  },
];

function DonatePage() {
  const [selectedTier, setSelectedTier] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  const activeAmount = customAmount ? parseInt(customAmount, 10) || selectedTier : selectedTier;
  const activeTier = tiers.find((t) => t.numeric === selectedTier) || tiers[1];
  const refCode = `ARF-${activeAmount.toString().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(refCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Abba Roller Foundation,\n\nI have completed my donation of ₦${activeAmount.toLocaleString()} to support your community programmes.\n\nReference: ${refCode}\nPurpose: ${activeTier.impact}`,
  );

  return (
    <>
      <PageHeader
        eyebrow="Official Giving Portal"
        title="Complete Your Support"
        lede="Your gift is deployed directly to community programmes across Northern Nigeria — verified on the ground with open reporting."
        crumbs={[{ label: "Home", to: "/" }, { label: "Donate" }]}
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
              {tiers.map((tier) => (
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
                  min={1000}
                  step={1000}
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
                    {activeTier.impact}
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
                    {BANK_DETAILS.bankName}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-hairline pt-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Account Name
                  </span>
                  <span className="font-display text-sm font-extrabold text-ink">
                    {BANK_DETAILS.accountName}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-hairline pt-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Account Number
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-black text-green-deep">
                      {BANK_DETAILS.accountNumber}
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
                  href={`https://wa.me/2348000000000?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shine group flex w-full items-center justify-center gap-2.5 rounded-sm bg-[#25D366] px-5 py-4 text-sm font-extrabold text-white shadow-md transition-all hover:bg-[#1EBE5D] hover:shadow-lg active:scale-[0.99]"
                >
                  <MessageCircle className="size-5 fill-white" />
                  <span>Notify / Confirm on WhatsApp</span>
                </a>

                <a
                  href={`mailto:${org.email}?subject=Donation%20Receipt%20-%20₦${activeAmount.toLocaleString()}&body=Hello%20Abba%20Roller%20Foundation,%0A%0AI%20have%20transferred%20₦${activeAmount.toLocaleString()}%20with%20reference%20${refCode}.%0A%0APlease%20confirm%20receipt.%0A%0AThank%20you!`}
                  className="flex w-full items-center justify-center gap-2 rounded-sm border border-hairline bg-background px-5 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-muted"
                >
                  <span>Email Proof of Transfer ({org.email})</span>
                </a>
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
                {allocations.map((item) => (
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
                    ← Back to Single-Page Home
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

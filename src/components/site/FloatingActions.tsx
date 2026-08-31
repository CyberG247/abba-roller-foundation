import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { ArrowUp, Building2, Check, Copy, Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";

const BANK_DETAILS = {
  bankName: "POLARIS BANK",
  accountName: "ABBA ROLLER FOUNDATION",
  accountNumber: "4092448499",
};

export function FloatingActions() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [showBankCard, setShowBankCard] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const currentScroll = window.scrollY;
      const progress = Math.min(Math.max((currentScroll / totalHeight) * 100, 0), 100);
      setScrollProgress(progress);
      setVisible(currentScroll > 320);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToDonate = () => {
    const el = document.getElementById("donate") || document.getElementById("get-involved");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCopyAccount = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
    setCopied(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#145A43", "#1B6B50", "#E53935", "#F59E0B", "#ffffff"],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setCopied(false), 2500);
  };

  if (!visible) return null;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 transition-all duration-500 ease-out">
      {/* Quick Bank Details Floating Card */}
      {showBankCard && (
        <div className="mb-2 w-72 rounded-sm border border-hairline bg-surface/98 p-4 shadow-panel backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-hairline pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-green-deep">
              <Building2 className="size-3.5" />
              <span>Official Account</span>
            </div>
            <button
              type="button"
              onClick={() => setShowBankCard(false)}
              className="text-muted-foreground hover:text-ink cursor-pointer p-0.5"
              aria-label="Close"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="mt-2.5 space-y-1 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Bank:</span>
              <strong className="text-ink font-bold">{BANK_DETAILS.bankName}</strong>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Name:</span>
              <strong className="text-ink font-bold text-[11px]">{BANK_DETAILS.accountName}</strong>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-xs bg-green-wash p-2 font-mono">
              <span className="font-extrabold text-sm text-green-deep tracking-wider">
                {BANK_DETAILS.accountNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="inline-flex items-center gap-1 rounded-xs bg-green-deep px-2 py-0.5 text-[10px] font-sans font-bold text-white transition-all hover:bg-green-mid cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="size-3 text-green-light" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setShowBankCard(false);
                scrollToDonate();
              }}
              className="w-full rounded-xs bg-brand-red py-1.5 text-center text-[11px] font-extrabold text-white transition-all hover:bg-brand-red-bright shadow-2xs cursor-pointer"
            >
              Calculate Impact &amp; Donate →
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Quick Bank Icon Toggle */}
        <button
          type="button"
          onClick={() => setShowBankCard(!showBankCard)}
          aria-label="Show quick bank transfer details"
          className="flex size-11 items-center justify-center rounded-full bg-green-deep text-white shadow-lift transition-all hover:bg-green-mid hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-white/30"
          title="Quick Polaris Bank Details"
        >
          <Building2 className="size-4.5" />
        </button>

        {/* Quick Donate Floating Pill */}
        <button
          type="button"
          onClick={scrollToDonate}
          aria-label="Quick donate"
          className="btn-shine group flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-red via-brand-red to-brand-red-bright px-4.5 py-2.5 text-xs font-extrabold text-white shadow-lift shadow-brand-red/30 ring-1 ring-white/30 transition-all hover:shadow-lg hover:shadow-brand-red/45 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Heart className="size-3.5 fill-white transition-transform group-hover:scale-120 animate-pulse" />
          <span className="hidden sm:inline">Support ARF</span>
          <span className="sm:hidden">Donate</span>
        </button>

        {/* Back to top with Circular Scroll Progress */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="group relative flex size-11 items-center justify-center rounded-full bg-background/95 text-ink shadow-lift backdrop-blur-md transition-all hover:border-green-deep hover:scale-110 active:scale-95 border border-hairline"
        >
          <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r={radius}
              className="stroke-hairline fill-none"
              strokeWidth="2.5"
            />
            <circle
              cx="22"
              cy="22"
              r={radius}
              className="stroke-green-deep fill-none transition-all duration-150 ease-out"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <ArrowUp className="size-4.5 text-green-deep transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}


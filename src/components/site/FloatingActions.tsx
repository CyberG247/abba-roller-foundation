import { useEffect, useState } from "react";
import { ArrowUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(false);

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

  if (!visible) return null;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 transition-all duration-500 ease-out">
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
  );
}

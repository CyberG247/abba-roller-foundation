import { useEffect, useRef, useState } from "react";

export function AnimatedCounter({
  value,
  duration = 1600,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  // Render the true metric value for SSR / initial paint so search engines and zero-JS/slow clients never see "0".
  const [displayValue, setDisplayValue] = useState<string>(value);
  const ref = useRef<HTMLSpanElement | null>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayValue(value);
      return;
    }

    // Parse the numeric portion and suffix (e.g., "15,400+" -> number 15400, prefix "", suffix "+")
    const cleaned = value.replace(/,/g, "");
    const match = cleaned.match(/^([^\d]*)(\d+)(.*)$/);
    const rawNumber = match?.[2];

    if (!match || !rawNumber) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] ?? "";
    const targetNumber = parseInt(rawNumber, 10);
    const suffix = match[3] ?? "";

    if (typeof IntersectionObserver === "undefined") {
      setDisplayValue(value);
      return;
    }

    let rafId = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const startTime = performance.now();

          const updateCounter = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easeOut * targetNumber);

            setDisplayValue(
              `${prefix}${currentCount.toLocaleString()}${progress >= 1 ? suffix : ""}`,
            );

            if (progress < 1) {
              rafId = requestAnimationFrame(updateCounter);
            } else {
              setDisplayValue(value);
            }
          };

          rafId = requestAnimationFrame(updateCounter);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}

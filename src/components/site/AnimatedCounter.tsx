import { useEffect, useRef, useState } from "react";

export function AnimatedCounter({
  value,
  duration = 1800,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const ref = useRef<HTMLSpanElement | null>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Parse the numeric portion and suffix (e.g., "15,400+" -> number 15400, prefix "", suffix "+")
    const cleaned = value.replace(/,/g, "");
    const match = cleaned.match(/^([^\d]*)(\d+)(.*)$/);

    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] || "";
    const targetNumber = parseInt(match[2], 10);
    const suffix = match[3] || "";

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const startTime = performance.now();

          const updateCounter = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easeOut * targetNumber);

            setDisplayValue(
              `${prefix}${currentCount.toLocaleString()}${progress >= 1 ? suffix : ""}`,
            );

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(updateCounter);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}

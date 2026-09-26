import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: string;
  imagePosition?: string;
  containerClassName?: string;
  zoomOnHover?: boolean;
  fitMode?: "cover" | "contain" | "ambient";
}

export function LazyImage({
  src,
  alt,
  aspectRatio = "aspect-[16/10]",
  imagePosition = "object-center",
  containerClassName,
  className,
  zoomOnHover = false,
  fitMode = "cover",
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-muted/70",
        fitMode === "ambient" && "flex items-center justify-center bg-slate-950",
        aspectRatio,
        containerClassName,
      )}
    >
      {/* Shimmer skeleton while not loaded */}
      {!loaded && !hasError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-hairline/60 to-muted z-20"
        />
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground p-4 text-center z-20">
          <ImageIcon className="size-8 opacity-40 mb-2" />
          <span className="text-xs">Image unavailable</span>
        </div>
      ) : isInView ? (
        <>
          {fitMode === "ambient" && (
            <img
              src={src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none select-none"
            />
          )}
          <img
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            onError={() => setHasError(true)}
            loading="lazy"
            className={cn(
              fitMode === "ambient"
                ? "relative z-10 max-h-full max-w-full object-contain transition-all duration-700 ease-out select-none"
                : "size-full object-cover transition-all duration-700 ease-out",
              fitMode !== "ambient" && imagePosition,
              loaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.03] blur-xs",
              zoomOnHover &&
                (fitMode === "ambient" ? "group-hover:scale-[1.02]" : "group-hover:scale-[1.05]"),
              className,
            )}
            {...props}
          />
        </>
      ) : null}
    </div>
  );
}

import { motion, type HTMLMotionProps, useReducedMotion } from "framer-motion";
import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealVariant = "up" | "down" | "left" | "right" | "scale" | "fade";

export type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealVariant;
  duration?: number;
  as?: ElementType;
  once?: boolean;
  amount?: number | "some" | "all";
};

const getVariants = (direction: RevealVariant) => {
  switch (direction) {
    case "up":
      return {
        hidden: { opacity: 0, y: 28, scale: 0.985 },
        visible: { opacity: 1, y: 0, scale: 1 },
      };
    case "down":
      return {
        hidden: { opacity: 0, y: -28, scale: 0.985 },
        visible: { opacity: 1, y: 0, scale: 1 },
      };
    case "left":
      return {
        hidden: { opacity: 0, x: -36 },
        visible: { opacity: 1, x: 0 },
      };
    case "right":
      return {
        hidden: { opacity: 0, x: 36 },
        visible: { opacity: 1, x: 0 },
      };
    case "scale":
      return {
        hidden: { opacity: 0, scale: 0.92 },
        visible: { opacity: 1, scale: 1 },
      };
    case "fade":
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
  }
};

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.65,
  as: Tag = "div",
  once = true,
  amount = 0.1,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants = getVariants(direction);

  const MotionTag = motion[Tag as keyof typeof motion] || motion.div;

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{
        duration,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}

/** Stagger container for animating lists of items in succession */
export function StaggerContainer({
  children,
  className,
  delay = 0,
  staggerChildren = 0.1,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay / 1000,
            staggerChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Child item inside StaggerContainer */
export function StaggerItem({
  children,
  className,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: RevealVariant;
}) {
  const variants = getVariants(direction);
  return (
    <motion.div
      variants={variants}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

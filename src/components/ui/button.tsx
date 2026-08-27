import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-green-mid",
        destructive: "bg-destructive text-destructive-foreground hover:bg-brand-red-bright",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-green-wash/70",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        /** Primary conversion action — used for Donate / Support Our Work. Ultra-stylish crimson gradient with gloss shine. */
        give: "btn-shine bg-gradient-to-r from-brand-red via-brand-red to-brand-red-bright text-white font-bold tracking-wide shadow-md shadow-brand-red/25 ring-1 ring-white/25 hover:shadow-lg hover:shadow-brand-red/40 hover:brightness-105 active:scale-[0.98] transition-all duration-300",
        /** Sits on photography or deep-green sections. */
        onDark: "bg-on-dark text-green-deep hover:bg-green-wash active:translate-y-px",
        /** Quiet outline for use on photography or deep-green sections. */
        onDarkOutline:
          "border border-on-dark/35 text-on-dark hover:border-on-dark hover:bg-on-dark/10",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-13 px-7 text-[0.95rem]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

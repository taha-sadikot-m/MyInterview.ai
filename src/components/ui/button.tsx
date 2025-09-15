import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "button-gradient text-primary-foreground hover:shadow-lg transition-all duration-300",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "button-gradient text-primary-foreground font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300",
        world: "bg-card border-2 border-border text-foreground font-semibold hover:border-primary hover:bg-primary/5 hover:scale-[1.02] card-shadow transition-all duration-300",
        feature: "bg-primary/10 text-primary font-semibold hover:bg-primary/20 border border-primary/30 transition-all duration-300",
        success: "bg-success text-success-foreground hover:bg-success/90",
      },
      size: {
        default: "h-12 px-6 py-3", // 48px height desktop
        sm: "h-10 px-4 py-2", // 40px height mobile
        lg: "h-14 px-8 py-4", // Larger for hero buttons
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-transform transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        gold:
          "bg-gold text-navy hover:bg-gold-soft",
        navy:
          "bg-navy text-paper border border-gold/40 hover:border-gold",
        paper:
          "bg-paper text-navy hover:bg-paper-2",
        ghost:
          "bg-transparent text-paper border border-gold/30 hover:border-gold hover:bg-navy-soft",
        danger:
          "bg-wrong text-paper hover:opacity-90",
      },
      size: {
        sm: "h-10 px-4 text-sm rounded-sm",
        md: "h-11 px-5 text-sm rounded-md",
        lg: "h-12 px-6 text-base rounded-md",
      },
    },
    defaultVariants: { variant: "gold", size: "md" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

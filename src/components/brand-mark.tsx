import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  compact = false,
  invert = false,
}: {
  className?: string;
  compact?: boolean;
  invert?: boolean;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <p
        className={cn(
          "font-display text-[0.65rem] font-semibold tracking-[0.42em] uppercase",
          invert ? "text-gold-deep" : "text-gold",
        )}
      >
        Learn · Grow · Succeed
      </p>
      <p
        className={cn(
          "font-display font-semibold tracking-[0.18em]",
          invert ? "text-navy" : "text-paper",
          compact ? "text-xl" : "text-3xl sm:text-5xl",
        )}
      >
        ANAVERSE
      </p>
      <p
        className={cn(
          "font-sans font-semibold tracking-[0.38em] uppercase",
          invert ? "text-gold-deep" : "text-gold",
          compact ? "text-[0.65rem]" : "text-xs sm:text-sm",
        )}
      >
        CBT
      </p>
    </div>
  );
}

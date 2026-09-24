import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-line bg-paper px-3 text-base text-ink",
        "placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        className,
      )}
      {...props}
    />
  );
}

import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

type IconButtonProps = Omit<ComponentProps<"button">, "aria-label" | "aria-pressed"> & {
  /** Accessible name; icons are decorative. */
  label: string;
  pressed?: boolean;
  tone?: "default" | "onBrand";
};

export function IconButton({
  label,
  pressed,
  tone = "default",
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full transition-colors disabled:opacity-50",
        tone === "onBrand"
          ? "text-white hover:bg-white/15 focus-visible:outline-white"
          : "text-fg hover:bg-surface-muted",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

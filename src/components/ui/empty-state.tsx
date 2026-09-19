import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  tone?: "neutral" | "error";
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  tone = "neutral",
  className,
}: EmptyStateProps) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn("card flex flex-col items-center gap-3 px-6 py-12 text-center", className)}
    >
      {icon ? (
        <div className={cn("text-4xl", tone === "error" ? "text-down" : "text-muted")}>{icon}</div>
      ) : null}
      <h2 className="text-lg font-semibold">{title}</h2>
      {description ? <p className="text-muted max-w-prose">{description}</p> : null}
      {action}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="That country or category does not exist. Pick one from the headlines page instead."
      action={
        <Link
          href="/"
          className="bg-brand text-brand-fg hover:bg-brand-strong rounded-xl px-4 py-2 font-semibold"
        >
          Back to headlines
        </Link>
      }
    />
  );
}

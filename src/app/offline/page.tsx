import { WifiOffIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false },
};

/** Served by the service worker when a navigation fails without connectivity. */
export default function OfflinePage() {
  return (
    <EmptyState
      icon={<WifiOffIcon className="size-10" aria-hidden="true" />}
      title="You are offline"
      description="This page is not available offline yet. Reconnect and try again."
      action={
        <Link
          href="/"
          className="bg-brand text-brand-fg hover:bg-brand-strong rounded-xl px-4 py-2 font-semibold"
        >
          Retry
        </Link>
      }
    />
  );
}

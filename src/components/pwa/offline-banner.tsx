"use client";

import { WifiOffIcon } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function OfflineBanner() {
  const isOnline = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

  if (isOnline) return null;

  return (
    <output
      aria-live="polite"
      className="bg-fg text-bg fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-2 px-4 py-2 text-sm"
    >
      <WifiOffIcon className="size-4" aria-hidden="true" />
      You are offline. Showing the last cached version.
    </output>
  );
}

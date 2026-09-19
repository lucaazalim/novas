"use client";

import { useEffect } from "react";

/** Registers /sw.js in production. The worker itself lives in public/sw.js. */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch((error: unknown) => console.error("[pwa] service worker registration failed", error));
  }, []);

  return null;
}

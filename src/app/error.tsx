"use client";

import { useEffect } from "react";

import { EmptyState } from "@/components/ui/empty-state";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      tone="error"
      title="Something went wrong"
      description="An unexpected error happened while loading this page."
      action={
        <button
          type="button"
          onClick={reset}
          className="bg-brand text-brand-fg hover:bg-brand-strong rounded-xl px-4 py-2 font-semibold"
        >
          Try again
        </button>
      }
    />
  );
}

"use client";

import { XIcon } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { IconButton } from "@/components/ui/icon-button";

type PickerDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
};

/**
 * Native <dialog>: focus trapping, Escape handling and focus restoration come for free,
 * and `closedby="any"` closes on backdrop clicks in browsers that support it.
 */
export function PickerDialog({ open, onClose, title, description, children }: PickerDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      closedby="any"
      aria-labelledby="picker-title"
      aria-describedby={description ? "picker-description" : undefined}
      className="rounded-card border-border bg-surface text-fg m-auto w-full max-w-4xl border p-0 shadow-2xl backdrop:bg-black/40 max-sm:h-dvh max-sm:max-h-none max-sm:max-w-none max-sm:rounded-none"
    >
      <div className="flex max-h-dvh flex-col sm:max-h-[85vh]">
        <header className="border-border bg-surface-muted flex items-start justify-between gap-4 border-b px-5 py-4">
          <div>
            <h2 id="picker-title" className="text-lg font-semibold">
              {title}
            </h2>
            {description ? (
              <p id="picker-description" className="text-muted text-sm">
                {description}
              </p>
            ) : null}
          </div>
          <IconButton label="Close" onClick={onClose} className="-mt-1 -mr-2">
            <XIcon className="size-5" aria-hidden="true" />
          </IconButton>
        </header>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </dialog>
  );
}

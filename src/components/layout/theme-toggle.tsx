"use client";

import { MoonIcon, SunIcon } from "lucide-react";

import { IconButton } from "@/components/ui/icon-button";
import { useHtmlDataAttribute } from "@/lib/hooks/use-html-data-attribute";

type Theme = "light" | "dark";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  // Null while server rendering, so markup matches until the client takes over.
  const theme = useHtmlDataAttribute("theme");

  function toggle() {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode, blocked). The toggle still works for this page.
    }
  }

  const isDark = theme === "dark";

  return (
    <IconButton
      onClick={toggle}
      label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      pressed={isDark}
      tone="onBrand"
    >
      {isDark ? (
        <SunIcon className="size-5" aria-hidden="true" />
      ) : (
        <MoonIcon className="size-5" aria-hidden="true" />
      )}
    </IconButton>
  );
}

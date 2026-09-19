import Image from "next/image";
import Link from "next/link";

import { HeaderSearchForm } from "@/components/layout/header-search-form";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ViewOptions } from "@/components/layout/view-options";
import { InstallButton } from "@/components/pwa/install-button";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="bg-brand text-brand-fg">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-md"
          aria-label={`${siteConfig.name} home`}
        >
          <Image src="/logo.svg" alt="" width={140} height={32} priority className="h-8 w-auto" />
        </Link>

        <nav
          aria-label="Primary"
          className="order-3 flex w-full items-center gap-1 sm:order-none sm:w-auto"
        >
          <HeaderSearchForm />
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <InstallButton />
          <ViewOptions />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

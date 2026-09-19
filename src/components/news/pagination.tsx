import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => Route;
};

export function Pagination({ page, totalPages, hrefFor }: PaginationProps) {
  if (totalPages <= 1) return null;

  const previous = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-4">
      <PageLink href={previous ? hrefFor(previous) : null} rel="prev">
        <ChevronLeftIcon className="size-4" aria-hidden="true" />
        Previous
      </PageLink>
      <p className="text-muted text-sm" aria-current="page">
        Page {page} of {totalPages}
      </p>
      <PageLink href={next ? hrefFor(next) : null} rel="next">
        Next
        <ChevronRightIcon className="size-4" aria-hidden="true" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  rel,
  children,
}: {
  href: Route | null;
  rel: "prev" | "next";
  children: React.ReactNode;
}) {
  const className = "inline-flex items-center gap-1 rounded-xl px-4 py-2 font-semibold";

  if (!href) {
    return (
      <span aria-disabled="true" className={`${className} text-muted opacity-50`}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      rel={rel}
      className={`${className} bg-surface text-brand hover:bg-brand-soft`}
    >
      {children}
    </Link>
  );
}

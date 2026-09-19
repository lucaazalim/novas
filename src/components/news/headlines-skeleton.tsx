import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the shape of <Headlines> so the static shell reserves the right space. */
export function HeadlinesSkeleton({ featured = true }: { featured?: boolean }) {
  return (
    <>
      <div className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center" aria-hidden="true">
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-full sm:ml-auto sm:w-56" />
      </div>
      <Skeleton className="mt-6 h-7 w-72" />
      {featured ? (
        <div className="mt-4 grid h-[520px] grid-cols-1 gap-3 md:grid-cols-2" aria-hidden="true">
          <Skeleton className="h-full" />
          <div className="hidden grid-rows-2 gap-3 md:grid">
            <Skeleton className="h-full" />
            <Skeleton className="h-full" />
          </div>
        </div>
      ) : null}
      <div className="mt-8 flex flex-col gap-5" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="grid grid-cols-1 gap-5 lg:grid-cols-8">
            <Skeleton className="aspect-video lg:col-span-3 lg:aspect-[4/3]" />
            <div className="flex flex-col gap-3 lg:col-span-5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

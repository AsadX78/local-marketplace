import { Skeleton } from "@/components/ui/skeleton";

export default function ListingDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="mt-3 h-10 w-1/3" />
          </div>
          <div className="rounded-xl border border-gray-200 p-6 space-y-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="rounded-xl border border-gray-200 p-6 space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-[256px] w-full rounded-xl" />
          </div>
        </div>
        <div className="space-y-6 lg:sticky lg:top-20 lg:h-fit">
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="rounded-xl border border-gray-200 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

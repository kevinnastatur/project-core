export default function B2BLoading() {
  return (
    <div className="space-y-6">
      {/* Page header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-44 animate-pulse rounded-lg bg-[#E5E7EB]" />
          <div className="h-4 w-60 animate-pulse rounded-md bg-[#F3F4F6]" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-[#E5E7EB] bg-white p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-[#F3F4F6]" />
              <div className="space-y-1.5">
                <div className="h-4 w-28 animate-pulse rounded bg-[#E5E7EB]" />
                <div className="h-3 w-20 animate-pulse rounded bg-[#F3F4F6]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-[#F3F4F6]" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-[#F3F4F6]" />
            </div>
            <div className="h-9 w-full animate-pulse rounded-lg bg-[#F3F4F6]" />
          </div>
        ))}
      </div>
    </div>
  );
}

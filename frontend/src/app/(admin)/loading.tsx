export default function AdminLoading() {
  return (
    <div className="space-y-6">
      {/* Page header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 animate-pulse rounded-lg bg-[#E5E7EB]" />
          <div className="h-4 w-72 animate-pulse rounded-md bg-[#F3F4F6]" />
        </div>
        <div className="h-9 w-32 animate-pulse rounded-lg bg-[#E5E7EB]" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-[#E5E7EB] bg-white p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-[#F3F4F6]" />
              <div className="h-8 w-8 animate-pulse rounded-lg bg-[#F3F4F6]" />
            </div>
            <div className="h-7 w-16 animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-3 w-32 animate-pulse rounded bg-[#F3F4F6]" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white">
        {/* Table header */}
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-9 w-64 animate-pulse rounded-lg bg-[#F3F4F6]" />
          </div>
        </div>
        {/* Table rows */}
        <div className="divide-y divide-[#F3F4F6]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="h-4 w-4 animate-pulse rounded bg-[#F3F4F6]" />
              <div className="h-8 w-8 animate-pulse rounded-full bg-[#F3F4F6]" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-40 animate-pulse rounded bg-[#E5E7EB]" />
                <div className="h-3 w-56 animate-pulse rounded bg-[#F3F4F6]" />
              </div>
              <div className="h-6 w-20 animate-pulse rounded-full bg-[#F3F4F6]" />
              <div className="h-4 w-24 animate-pulse rounded bg-[#F3F4F6]" />
              <div className="h-8 w-8 animate-pulse rounded-lg bg-[#F3F4F6]" />
            </div>
          ))}
        </div>
        {/* Table footer */}
        <div className="border-t border-[#E5E7EB] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-40 animate-pulse rounded bg-[#F3F4F6]" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 w-8 animate-pulse rounded-lg bg-[#F3F4F6]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Page header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-40 animate-pulse rounded-lg bg-[#E5E7EB]" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-[#F3F4F6]" />
      </div>

      {/* Profile card skeleton */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-6">
        <div className="flex items-start gap-6">
          <div className="h-20 w-20 animate-pulse rounded-full bg-[#E5E7EB]" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-48 animate-pulse rounded-lg bg-[#E5E7EB]" />
            <div className="h-4 w-32 animate-pulse rounded bg-[#F3F4F6]" />
            <div className="flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-[#F3F4F6]" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-[#F3F4F6]" />
            </div>
          </div>
          <div className="h-9 w-28 animate-pulse rounded-lg bg-[#E5E7EB]" />
        </div>
      </div>

      {/* Info sections skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#E5E7EB] bg-white p-6 space-y-4">
            <div className="h-5 w-36 animate-pulse rounded bg-[#E5E7EB]" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="h-4 w-28 animate-pulse rounded bg-[#F3F4F6]" />
                  <div className="h-4 w-40 animate-pulse rounded bg-[#E5E7EB]" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

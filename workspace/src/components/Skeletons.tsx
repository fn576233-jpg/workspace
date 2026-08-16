export function SkeletonMovieCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
      <div className="skeleton aspect-[2/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  )
}

export function SkeletonMovieGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonMovieCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonHero() {
  return (
    <div className="relative overflow-hidden">
      <div className="skeleton h-[70vh] w-full rounded-none sm:h-[80vh]" />
      <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12">
        <div className="skeleton h-6 w-40" />
        <div className="skeleton mt-4 h-14 w-3/4 max-w-xl" />
        <div className="skeleton mt-4 h-4 w-1/2 max-w-md" />
        <div className="mt-8 flex gap-3">
          <div className="skeleton h-11 w-36 rounded-full" />
          <div className="skeleton h-11 w-32 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonDetail() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6">
      <div className="skeleton h-8 w-40" />
      <div className="mt-8 grid gap-10 md:grid-cols-[300px_1fr]">
        <div className="skeleton aspect-[2/3] w-full" />
        <div className="space-y-4">
          <div className="skeleton h-16 w-3/4" />
          <div className="skeleton h-5 w-1/2" />
          <div className="skeleton h-5 w-2/3" />
          <div className="skeleton h-32 w-full" />
          <div className="flex gap-3 pt-2">
            <div className="skeleton h-11 w-40 rounded-full" />
            <div className="skeleton h-11 w-36 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

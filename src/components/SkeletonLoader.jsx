const SkeletonLoader = ({ count = 7 }) => (
  <div className="flex gap-4 overflow-x-hidden pb-2" aria-label="Loading content" aria-busy="true">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="skeleton flex-shrink-0 w-36 sm:w-44 md:w-48 rounded-card"
        style={{
          aspectRatio: '2 / 3',
          animationDelay: `${i * 80}ms`,
        }}
        aria-hidden="true"
      />
    ))}
  </div>
)

export default SkeletonLoader

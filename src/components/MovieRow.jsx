import { useRef, useState, useCallback } from 'react'
import MovieCard from './MovieCard'
import SkeletonLoader from './SkeletonLoader'
import useInfiniteScroll from '../hooks/useInfiniteScroll'

const PAGE_SIZE = 10

const MovieRow = ({
  title,
  movies = [],
  loading = false,
  onTrailerClick,
}) => {
  const rowRef = useRef(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const visibleMovies = movies.slice(0, visibleCount)
  const hasMore = visibleCount < movies.length

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, movies.length))
  }, [movies.length])

  const { sentinelRef } = useInfiniteScroll(loadMore, hasMore, loading)

  const scroll = (dir) => {
    if (!rowRef.current) return
    const amount = rowRef.current.offsetWidth * 0.75
    rowRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <section className="relative py-6" aria-label={title}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row header */}
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl sm:text-2xl font-bold tracking-wide uppercase"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h2>
          <div className="flex gap-2">
            {[
              { dir: 'left',  icon: 'M15 19l-7-7 7-7',  label: 'Scroll left' },
              { dir: 'right', icon: 'M9 5l7 7-7 7',     label: 'Scroll right' },
            ].map(({ dir, icon, label }) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                aria-label={label}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  transition: 'border-color 0.2s, transform 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable row */}
        {loading ? (
          <SkeletonLoader count={7} />
        ) : movies.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No content available.
          </p>
        ) : (
          <>
            <div
              ref={rowRef}
              className="flex gap-4 overflow-x-auto no-scrollbar pb-2 relative"
              role="list"
            >
              {visibleMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  role="listitem"
                  className="animate-fade-in shrink-0"
                  style={{ animationDelay: `${Math.min(index, 9) * 40}ms`, animationFillMode: 'both' }}
                >
                  <MovieCard movie={movie} onTrailerClick={onTrailerClick} />
                </div>
              ))}
              
              {/* Infinite scroll sentinel — triggers when user scrolls horizontally to the end */}
              <div ref={sentinelRef} className="scroll-sentinel w-10 shrink-0" aria-hidden="true" />
            </div>

            {hasMore && (
              <p
                className="mt-2 text-xs text-center"
                style={{ color: 'var(--text-secondary)' }}
              >
                Scroll to load more…
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default MovieRow

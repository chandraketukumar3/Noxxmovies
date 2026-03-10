import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { addToHistory } from '../redux/slices/watchHistorySlice'
import { getTVShows, getTVShowsByGenre, getAnime } from '../services/moviesService'
import PaginatedMovieRow from '../components/PaginatedMovieRow'
import TrailerModal from '../components/TrailerModal'
import MovieCard from '../components/MovieCard'
import Loader from '../components/Loader'
import useInfiniteScroll from '../hooks/useInfiniteScroll'

const TVShows = () => {
  const dispatch = useDispatch()
  const [activeTrailer, setActiveTrailer] = useState(null)
  
  // Infinite scroll for bottom section
  const [page, setPage] = useState(1)
  const [moreShows, setMoreShows] = useState([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMoreShows = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)

    try {
      const res = await getTVShows(page)
      const results = Array.isArray(res.data) ? res.data : (res.data?.results || [])

      if (results.length > 0) {
        setMoreShows((prev) => {
          const newShows = results.filter(m => !prev.some(p => p.id === m.id))
          return [...prev, ...newShows]
        })
        setPage((p) => p + 1)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error('Failed to load more TV shows:', err)
      setHasMore(false)
    } finally {
      setLoadingMore(false)
    }
  }, [page, loadingMore, hasMore])

  const { sentinelRef } = useInfiniteScroll(loadMoreShows, hasMore, loadingMore)

  const handleTrailerClick = (movie) => {
    dispatch(addToHistory(movie))
    setActiveTrailer(movie)
  }

  return (
    <div className="min-h-screen py-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <h1
          className="text-4xl font-bold tracking-wider uppercase"
          style={{ color: 'var(--text-primary)' }}
        >
          TV Shows
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Explore series from around the world
        </p>
      </div>

      <PaginatedMovieRow 
        title="All TV Shows" 
        fetchFn={getTVShows} 
        onTrailerClick={handleTrailerClick} 
      />
      
      <PaginatedMovieRow 
        title="Drama" 
        genreId={18}
        fetchFn={(p) => getTVShowsByGenre(18, p)} 
        onTrailerClick={handleTrailerClick} 
      />

      <PaginatedMovieRow 
        title="Action" 
        genreId={10759}
        fetchFn={(p) => getTVShowsByGenre(10759, p)} 
        onTrailerClick={handleTrailerClick} 
      />

      <PaginatedMovieRow 
        title="Comedy" 
        genreId={35}
        fetchFn={(p) => getTVShowsByGenre(35, p)} 
        onTrailerClick={handleTrailerClick} 
      />

      <PaginatedMovieRow 
        title="Anime" 
        genreId={16}
        fetchFn={(p) => getAnime(p)} 
        onTrailerClick={handleTrailerClick} 
      />

      {/* Vertical Infinite Scroll Section */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-8">
        <h2 className="text-2xl font-bold tracking-wide uppercase mb-6" style={{ color: 'var(--text-primary)' }}>
          Discover All TV Shows
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {moreShows.map((movie, index) => (
            <div key={`${movie.id}-${index}`} className="animate-fade-in flex justify-center">
              <MovieCard movie={movie} onTrailerClick={handleTrailerClick} />
            </div>
          ))}
        </div>

        {/* Sentinel */}
        <div ref={sentinelRef} className="h-20 w-full" aria-hidden="true" />

        {loadingMore && (
          <div className="flex justify-center mt-8">
            <Loader />
          </div>
        )}

        {!hasMore && moreShows.length > 0 && (
          <p className="text-center mt-10 text-[var(--text-secondary)]">You reached the end.</p>
        )}
      </div>

      {activeTrailer && (
        <TrailerModal
          movieId={activeTrailer.id}
          title={activeTrailer.title || activeTrailer.name}
          onClose={() => setActiveTrailer(null)}
        />
      )}
    </div>
  )
}

export default TVShows

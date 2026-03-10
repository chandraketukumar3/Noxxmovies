import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { openTrailer } from '../redux/slices/trailerSlice'
import MovieCard from '../components/MovieCard'
import Loader from '../components/Loader'
import PaginatedMovieRow from '../components/PaginatedMovieRow'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import { getMovies, getMoviesByGenre } from '../services/moviesService'

const Movies = () => {
  const dispatch = useDispatch()
  
  // Infinite scroll for bottom section
  const [page, setPage] = useState(1)
  const [moreMovies, setMoreMovies] = useState([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMoreMovies = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)

    try {
      const res = await getMovies(page)
      const results = Array.isArray(res.data) ? res.data : (res.data?.results || [])

      if (results.length > 0) {
        setMoreMovies((prev) => {
          const newMovies = results.filter(m => !prev.some(p => p.id === m.id))
          return [...prev, ...newMovies]
        })
        setPage((p) => p + 1)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error('Failed to load more movies:', err)
      setHasMore(false)
    } finally {
      setLoadingMore(false)
    }
  }, [page, loadingMore, hasMore])

  const { sentinelRef } = useInfiniteScroll(loadMoreMovies, hasMore, loadingMore)

  const handleTrailerClick = (movie) => {
    dispatch(openTrailer(movie))
  }

  return (
    <div className="min-h-screen py-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <h1
          className="text-4xl font-bold tracking-wider uppercase"
          style={{ color: 'var(--text-primary)' }}
        >
          Movies
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Browse the latest and greatest films
        </p>
      </div>

      <PaginatedMovieRow 
        title="All Movies" 
        fetchFn={getMovies} 
        onTrailerClick={handleTrailerClick} 
      />
      
      <PaginatedMovieRow 
        title="Action" 
        genreId={28}
        fetchFn={(p) => getMoviesByGenre(28, p)} 
        onTrailerClick={handleTrailerClick} 
      />

      <PaginatedMovieRow 
        title="Thriller" 
        genreId={53}
        fetchFn={(p) => getMoviesByGenre(53, p)} 
        onTrailerClick={handleTrailerClick} 
      />

      <PaginatedMovieRow 
        title="Science Fiction" 
        genreId={878}
        fetchFn={(p) => getMoviesByGenre(878, p)} 
        onTrailerClick={handleTrailerClick} 
      />

      {/* Vertical Infinite Scroll Section */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-8">
        <h2 className="text-2xl font-bold tracking-wide uppercase mb-6" style={{ color: 'var(--text-primary)' }}>
          Discover All Movies
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {moreMovies.map((movie, index) => (
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

        {!hasMore && moreMovies.length > 0 && (
          <p className="text-center mt-10 text-[var(--text-secondary)]">You reached the end.</p>
        )}
      </div>
    </div>
  )
}

export default Movies

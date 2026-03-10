import { useState, useEffect, useCallback } from 'react'
import MovieRow from './MovieRow'

const PaginatedMovieRow = ({ title, fetchFn, onTrailerClick, mediaType, genreId }) => {
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMovies = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const res = await fetchFn(page)
      const data = Array.isArray(res.data) ? res.data : res.data?.results || []
      
      if (data.length > 0) {
        setMovies((prev) => {
          // Filter out duplicates and ensure correct mediaType/genre if specified
          const newMovies = data.filter(m => {
            const isDuplicate = prev.some(p => p.id === m.id)
            if (isDuplicate) return false
            if (mediaType && m.media_type && m.media_type !== mediaType) return false
            // Genre filtering as requested by user
            if (genreId && m.genre_ids && !m.genre_ids.includes(genreId)) return false
            return true
          })
          return [...prev, ...newMovies]
        })
        setPage(p => p + 1)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error(`Failed to load ${title}:`, err)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [fetchFn, page, loading, hasMore, title, mediaType])

  useEffect(() => {
    loadMovies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Initial load

  return (
    <MovieRow
      title={title}
      movies={movies}
      loading={loading && movies.length === 0}
      onTrailerClick={onTrailerClick}
      onLoadMore={loadMovies}
    />
  )
}

export default PaginatedMovieRow

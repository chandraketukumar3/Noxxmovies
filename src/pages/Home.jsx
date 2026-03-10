import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchGenres } from '../redux/slices/moviesSlice'
import { addToHistory } from '../redux/slices/watchHistorySlice'
import { toggleFavorite } from '../redux/slices/favoritesSlice'
import HeroBanner from '../components/HeroBanner'
import MovieRow from '../components/MovieRow'
import TrailerModal from '../components/TrailerModal'
import MovieCard from '../components/MovieCard'
import Loader from '../components/Loader'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import api from '../services/api'
import { getTrending, getMoviesByGenre } from '../services/moviesService'
import PaginatedMovieRow from '../components/PaginatedMovieRow'

const GENRE_ROWS = [
  { label: 'Action', id: 28 },
  { label: 'Drama', id: 18 },
  { label: 'Science Fiction', id: 878 },
  { label: 'Comedy', id: 35 },
]

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { genres } = useSelector((state) => state.movies)
  const favoriteIds = useSelector((state) =>
    new Set(state.favorites.items.map((m) => m.id))
  )

  const [trendingHero, setTrendingHero] = useState(null)
  const [activeTrailer, setActiveTrailer] = useState(null)

  // Infinite scroll states for bottom "Discover More"
  const [page, setPage] = useState(1)
  const [moreMovies, setMoreMovies] = useState([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    dispatch(fetchGenres())
    // Fetch initial trending for HeroBanner
    getTrending(1).then(res => {
      if (res.data?.results?.length > 0) {
        setTrendingHero(res.data.results[0])
      }
    })
  }, [dispatch])

  const loadMoreDiscover = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)

    try {
      const res = await api.get(`/movies/trending`, { params: { page } })
      const results = Array.isArray(res?.data) ? res.data : (res.data?.results || [])

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

  const { sentinelRef } = useInfiniteScroll(loadMoreDiscover, hasMore, loadingMore)

  const handleTrailerClick = (movie) => {
    dispatch(addToHistory(movie))
    setActiveTrailer(movie)
  }

  const handleMoreInfo = (movie) => navigate(`/movies/${movie.id}`)

  const handleAddToFavorites = (movie) => dispatch(toggleFavorite(movie))

  return (
    <div>
      <HeroBanner
        movie={trendingHero}
        movieId={trendingHero?.id}
        isFavorited={trendingHero ? favoriteIds.has(trendingHero.id) : false}
        onMoreInfo={handleMoreInfo}
        onAddToFavorites={handleAddToFavorites}
      />

      <div className="py-2">
        <PaginatedMovieRow
          title="Trending Now"
          fetchFn={(p) => getTrending(p)}
          onTrailerClick={handleTrailerClick}
        />

        {GENRE_ROWS.map(({ label, id }) => (
          <PaginatedMovieRow
            key={id}
            title={label}
            fetchFn={(p) => getMoviesByGenre(id, p)}
            onTrailerClick={handleTrailerClick}
          />
        ))}

        {/* Discover More Section */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-4">
          <h2
            className="text-xl sm:text-2xl font-bold tracking-wide uppercase mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Discover More
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {moreMovies.map((movie, index) => (
              <div
                key={`${movie.id}-${index}`}
                className="animate-fade-in shrink-0 flex justify-center"
              >
                <MovieCard
                  movie={movie}
                  onTrailerClick={handleTrailerClick}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-10 w-full" aria-hidden="true" />

        {loadingMore && (
          <div className="py-4 flex justify-center">
            <Loader />
          </div>
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

export default Home
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTrending } from '../redux/slices/moviesSlice'
import MovieRow from '../components/MovieRow'

const Movies = () => {
  const dispatch = useDispatch()
  const { trending, loading } = useSelector((state) => state.movies)

  useEffect(() => {
    if (trending.length === 0) dispatch(fetchTrending())
  }, [dispatch, trending.length])

  const movies = trending.filter((m) => m.media_type === 'movie' || !m.media_type)
  const actionMovies = movies.filter((m) => m.genre_ids?.includes(28))
  const thrillerMovies = movies.filter((m) => m.genre_ids?.includes(53))
  const scifiMovies = movies.filter((m) => m.genre_ids?.includes(878))

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

      <MovieRow title="All Movies" movies={movies} loading={loading} />
      {(loading || actionMovies.length > 0) && (
        <MovieRow title="Action" movies={actionMovies} loading={loading} />
      )}
      {(loading || thrillerMovies.length > 0) && (
        <MovieRow title="Thriller" movies={thrillerMovies} loading={loading} />
      )}
      {(loading || scifiMovies.length > 0) && (
        <MovieRow title="Science Fiction" movies={scifiMovies} loading={loading} />
      )}
    </div>
  )
}

export default Movies

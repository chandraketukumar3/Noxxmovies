import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTrending } from '../redux/slices/moviesSlice'
import MovieRow from '../components/MovieRow'

const TVShows = () => {
  const dispatch = useDispatch()
  const { trending, loading } = useSelector((state) => state.movies)

  useEffect(() => {
    if (trending.length === 0) dispatch(fetchTrending())
  }, [dispatch, trending.length])

  const shows = trending.filter((m) => m.media_type === 'tv')
  const dramaShows = shows.filter((m) => m.genre_ids?.includes(18))
  const actionShows = shows.filter((m) => m.genre_ids?.includes(28))

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

      {shows.length === 0 && !loading ? (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-col items-center justify-center py-24 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>
              No TV Shows in current trending data
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--border)' }}>
              The backend trending endpoint currently returns movies — TV shows will appear here when available
            </p>
          </div>
        </div>
      ) : (
        <>
          <MovieRow title="All TV Shows" movies={shows} loading={loading} />
          {dramaShows.length > 0 && (
            <MovieRow title="Drama" movies={dramaShows} loading={false} />
          )}
          {actionShows.length > 0 && (
            <MovieRow title="Action" movies={actionShows} loading={false} />
          )}
        </>
      )}
    </div>
  )
}

export default TVShows

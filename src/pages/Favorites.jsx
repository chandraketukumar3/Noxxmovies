import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeFavorite } from '../redux/slices/favoritesSlice'
import MovieCard from '../components/MovieCard'

const Favorites = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const favorites = useSelector((state) => state.favorites.items)

  return (
    <div className="min-h-screen py-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1
              className="text-4xl font-bold tracking-wider uppercase"
              style={{ color: 'var(--text-primary)' }}
            >
              Favorites
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {favorites.length > 0
                ? `${favorites.length} saved title${favorites.length > 1 ? 's' : ''}`
                : 'Your saved movies and TV shows'}
            </p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <svg
              className="w-14 h-14 mb-4"
              style={{ color: 'var(--border)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>
              No favorites yet
            </p>
            <p className="mt-1 text-sm mb-6" style={{ color: 'var(--border)' }}>
              Add movies from any page to see them here
            </p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((movie) => (
              <div key={movie.id} className="relative group">
                <MovieCard movie={movie} />
                <button
                  onClick={() => dispatch(removeFavorite(movie.id))}
                  aria-label={`Remove ${movie.title || movie.name} from favorites`}
                  className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  style={{
                    background: 'rgba(229,9,20,0.85)',
                    color: '#fff',
                  }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites

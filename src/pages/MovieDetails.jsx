import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovieById, clearMovieDetail } from '../redux/slices/movieDetailSlice'
import { addToHistory } from '../redux/slices/watchHistorySlice'
import { toggleFavorite } from '../redux/slices/favoritesSlice'
import TrailerModal from '../components/TrailerModal'
import Loader from '../components/Loader'

const TMDB_IMAGE = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null

const FALLBACK_POSTER = 'https://via.placeholder.com/500x750/1A1A24/A1A1AA?text=No+Image'

const StarRow = ({ value }) => {
  const filled = Math.round((value / 10) * 5)
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < filled ? 'text-yellow-400' : 'text-gray-600'} fill-current`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
        {Number(value).toFixed(1)} / 10
      </span>
    </div>
  )
}

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { movie, loading, error } = useSelector((state) => state.movieDetail)
  const favoriteIds = useSelector((state) => new Set(state.favorites.items.map((m) => m.id)))
  const [showTrailer, setShowTrailer] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    dispatch(fetchMovieById(id))
    return () => dispatch(clearMovieDetail())
  }, [id, dispatch])

  useEffect(() => {
    if (movie) dispatch(addToHistory(movie))
  }, [movie, dispatch])

  const isFavorited = movie ? favoriteIds.has(movie.id) : false

  const handleTrailerOpen = () => {
    if (movie) dispatch(addToHistory(movie))
    setShowTrailer(true)
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg)' }}
      >
        <Loader size="lg" label="Loading movie details..." />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-2xl p-12 flex flex-col items-center text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <svg
              className="w-16 h-16 mb-4"
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
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {error ? 'Failed to Load' : 'Movie Not Found'}
            </h2>
            <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {error || `No data available for ID: ${id}`}
            </p>
            <button className="btn-primary" onClick={() => navigate(-1)}>
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const {
    title,
    name,
    overview,
    poster_path,
    backdrop_path,
    vote_average,
    release_date,
    first_air_date,
    genres = [],
    runtime,
    tagline,
    status,
  } = movie

  const displayTitle = title || name || 'Untitled'
  const year = (release_date || first_air_date || '').substring(0, 4)
  const posterUrl = !imgError && poster_path ? TMDB_IMAGE(poster_path) : FALLBACK_POSTER
  const backdropUrl = backdrop_path ? TMDB_IMAGE(backdrop_path, 'original') : null

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Backdrop hero */}
      {backdropUrl && (
        <div className="relative w-full h-64 sm:h-80 overflow-hidden">
          <img
            src={backdropUrl}
            alt={`${displayTitle} backdrop`}
            className="w-full h-full object-cover object-top"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(11,11,15,0.2) 0%, rgba(11,11,15,1) 100%)',
            }}
          />
        </div>
      )}

      {/* Main content */}
      <div
        className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        style={{ marginTop: backdropUrl ? '-8rem' : '0' }}
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={posterUrl}
              alt={displayTitle}
              onError={() => setImgError(true)}
              className="w-48 sm:w-60 md:w-72 rounded-card object-cover card-shadow mx-auto md:mx-0"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide leading-tight mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {displayTitle}
            </h1>

            {/* Tagline */}
            {tagline && (
              <p
                className="text-base italic mb-4"
                style={{ color: 'var(--text-secondary)' }}
              >
                &ldquo;{tagline}&rdquo;
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {vote_average > 0 && <StarRow value={vote_average} />}
              {year && (
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {year}
                </span>
              )}
              {runtime > 0 && (
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {Math.floor(runtime / 60)}h {runtime % 60}m
                </span>
              )}
              {status && (
                <span className="badge">{status}</span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {genres.map((g) => (
                  <span key={g.id} className="badge">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Release date */}
            {(release_date || first_air_date) && (
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Release Date:{' '}
                </span>
                {new Date(release_date || first_air_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}

            {/* Overview */}
            {overview && (
              <p
                className="text-sm sm:text-base leading-relaxed mb-6 max-w-2xl"
                style={{ color: 'var(--text-secondary)' }}
              >
                {overview}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary" onClick={handleTrailerOpen}>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Trailer
              </button>

              <button
                className="btn-secondary"
                onClick={() => dispatch(toggleFavorite(movie))}
                style={
                  isFavorited
                    ? { borderColor: 'var(--primary)', color: 'var(--secondary)' }
                    : {}
                }
              >
                <svg
                  className="w-4 h-4"
                  fill={isFavorited ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>

              <button className="btn-secondary" onClick={() => navigate(-1)}>
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {showTrailer && (
        <TrailerModal
          trailerKey={null}
          title={displayTitle}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  )
}

export default MovieDetails

import { useNavigate } from 'react-router-dom'
import LazyImage from './LazyImage'

const TMDB_IMG = (path) =>
  path ? `https://image.tmdb.org/t/p/w342${path}` : null

const MovieCard = ({ movie, onTrailerClick, onRemove }) => {
  const navigate = useNavigate()

  const {
    id,
    title,
    name,
    poster_path,
    vote_average,
    release_date,
    first_air_date,
  } = movie

  const displayTitle = title || name || 'Untitled'
  const year = (release_date || first_air_date || '').substring(0, 4)
  const rating = vote_average ? Number(vote_average).toFixed(1) : null
  const posterUrl = TMDB_IMG(poster_path)
  const detailPath = `/movies/${id}`

  return (
    <article
      className="movie-card w-36 sm:w-44 md:w-48"
      onClick={() => navigate(detailPath)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(detailPath)}
      aria-label={`View ${displayTitle}`}
    >
      {/* Poster */}
      <div className="relative w-full" style={{ aspectRatio: '2 / 3' }}>
        <LazyImage
          src={posterUrl}
          alt={displayTitle}
          className="w-full h-full object-cover"
        />
        <div className="card-overlay" aria-hidden="true" />
      </div>

      {/* Rating badge */}
      {rating && Number(rating) > 0 && (
        <div
          className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-bold z-10"
          style={{ background: 'rgba(11,11,15,0.88)', color: '#FCD34D' }}
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {rating}
        </div>
      )}

      {/* Remove button (favorites) */}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(id) }}
          aria-label={`Remove ${displayTitle}`}
          className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
          style={{ background: 'rgba(229,9,20,0.85)', color: '#fff' }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Slide-up info panel */}
      <div className="card-info-panel z-10" onClick={(e) => e.stopPropagation()}>
        <p
          className="text-xs font-semibold leading-tight truncate mb-1"
          style={{ color: 'var(--text-primary)' }}
          title={displayTitle}
        >
          {displayTitle}
        </p>
        {year && (
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            {year}
          </p>
        )}
        <div className="flex gap-1">
          <button
            onClick={() => navigate(detailPath)}
            className="flex-1 text-xs py-1 rounded-md font-semibold tracking-wide"
            style={{
              background: 'var(--primary)',
              color: '#fff',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--primary)')}
          >
            Details
          </button>
          {onTrailerClick && (
            <button
              onClick={() => onTrailerClick(movie)}
              className="flex-1 text-xs py-1 rounded-md font-semibold tracking-wide"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid var(--border)',
              }}
            >
              ▶
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default MovieCard

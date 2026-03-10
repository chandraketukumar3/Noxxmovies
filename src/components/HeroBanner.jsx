import { useState } from 'react'
import TrailerModal from './TrailerModal'

const FALLBACK_BACKDROP =
  'https://via.placeholder.com/1280x720/12121A/A1A1AA?text=NoxMovies'

const StarRating = ({ value }) => {
  const filled = Math.round((value / 10) * 5)
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${value} out of 10`}>
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
      <span
        className="ml-1 text-sm font-semibold"
        style={{ color: 'var(--text-secondary)' }}
      >
        {Number(value).toFixed(1)}
      </span>
    </div>
  )
}

const HeroBanner = ({
  movie,
  trailerKey = null,
  isFavorited = false,
  onMoreInfo,
  onAddToFavorites,
  genreMap = {},
}) => {
  const [showTrailer, setShowTrailer] = useState(false)
  const [imgError, setImgError] = useState(false)

  if (!movie) return null

  const {
    title,
    name,
    overview,
    backdrop_path,
    vote_average,
    release_date,
    first_air_date,
    genres = [],
    genre_ids = [],
  } = movie

  const displayTitle = title || name || 'Untitled'
  const year = (release_date || first_air_date || '').substring(0, 4)
  const backdropUrl =
    !imgError && backdrop_path
      ? `https://image.tmdb.org/t/p/original${backdrop_path}`
      : FALLBACK_BACKDROP
  const truncatedOverview =
    overview && overview.length > 200
      ? overview.substring(0, 200) + '...'
      : overview

  const resolvedGenres =
    genres.length > 0
      ? genres
      : genre_ids.slice(0, 3).map((id) => ({ id, name: genreMap[id] })).filter((g) => g.name)

  const handleFavorite = () => {
    onAddToFavorites?.(movie)
  }

  return (
    <>
      <section
        className="relative w-full h-[70vh] min-h-[480px] max-h-[780px] overflow-hidden flex items-end"
        aria-label={`Featured: ${displayTitle}`}
      >
        {/* Backdrop image */}
        <img
          src={backdropUrl}
          alt={`${displayTitle} backdrop`}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />

        {/* Cinematic gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(11,11,15,0.95) 35%, rgba(11,11,15,0.5) 70%, transparent 100%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(11,11,15,1) 0%, rgba(11,11,15,0.3) 40%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Content area */}
        <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-0">
          <div className="max-w-2xl">
            {/* Genres */}
            {resolvedGenres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {resolvedGenres.slice(0, 3).map((g) => (
                  <span key={g.id || g} className="badge">
                    {g.name || g}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide leading-tight mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              {displayTitle}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {vote_average > 0 && <StarRating value={vote_average} />}
              {year && (
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {year}
                </span>
              )}
            </div>

            {/* Overview */}
            {truncatedOverview && (
              <p
                className="text-sm sm:text-base leading-relaxed mb-6 max-w-xl"
                style={{ color: 'var(--text-secondary)' }}
              >
                {truncatedOverview}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                className="btn-primary"
                onClick={() => setShowTrailer(true)}
                aria-label={`Play trailer for ${displayTitle}`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Trailer
              </button>

              <button
                className="btn-secondary"
                onClick={() => onMoreInfo?.(movie)}
                aria-label={`More info about ${displayTitle}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                More Info
              </button>

              <button
                className="btn-secondary"
                onClick={handleFavorite}
                aria-label={
                  isFavorited
                    ? `Remove ${displayTitle} from favorites`
                    : `Add ${displayTitle} to favorites`
                }
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
                {isFavorited ? 'Remove Favorite' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {showTrailer && (
        <TrailerModal
          trailerKey={trailerKey}
          title={displayTitle}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </>
  )
}

export default HeroBanner

import { useEffect, useState } from 'react'
import api from '../services/api' // Use customized axios instance
import axios from 'axios'

const TrailerModal = ({ movieId, title, onClose, mediaType = 'movie' }) => {
  const [trailerKey, setTrailerKey] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!movieId) {
        setLoading(false)
        return
      }
      try {
        // Use our backend trailer endpoint which handles movie/tv logic
        const res = await api.get(`/movies/${movieId}/trailer`, {
          params: { type: mediaType }
        })
        
        if (res.data && res.data.key) {
          setTrailerKey(res.data.key)
        }
      } catch (error) {
        console.error("Error fetching trailer:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrailer()
  }, [movieId, mediaType])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Trailer: ${title}`}
      onClick={onClose}
    >
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal box: Perfectly Centered */}
      <div
        className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden z-10 flex flex-col shadow-2xl bg-[#1a1a1e] border border-white/10"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/20">
          <h2 className="text-sm sm:text-lg font-bold tracking-wide truncate pr-4 text-white">
            {title || 'Trailer'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close trailer"
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-red-600/20 text-red-500 border border-red-500/30 hover:bg-red-600/40 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video or fallback: Fills the remaining space */}
        <div className="flex-1 bg-black relative">
          {trailerKey ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${title} — Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              {loading ? (
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-600/10 border border-red-500/20">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-400">
                    Trailer for this movie is currently unavailable.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrailerModal

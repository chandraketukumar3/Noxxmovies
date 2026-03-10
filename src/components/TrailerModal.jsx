import { useEffect, useState } from 'react'
import api from '../services/api' // Use customized axios instance
import axios from 'axios'

const TrailerModal = ({ movieId, title, onClose }) => {
  const [trailerKey, setTrailerKey] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!movieId) {
        setLoading(false)
        return
      }
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY
        if (!apiKey) {
           console.error("TMDB API Key missing")
           setLoading(false)
           return
        }
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`)
        
        const videos = res.data?.results || []
        
        // Find specific trailer or fallback to any YouTube video
        const trailer = videos.find((v) => v.type === "Trailer" && v.site === "YouTube") 
          || videos.find((v) => v.site === "YouTube");
          
        if (trailer) {
           setTrailerKey(trailer.key)
        }
      } catch (error) {
        console.error("Error fetching trailer:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrailer()
  }, [movieId])

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
      className="fixed top-0 left-0 w-[100vw] h-[100vh] z-[9999] flex items-center justify-center overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={`Trailer: ${title}`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
        aria-hidden="true"
      />

      {/* Modal box */}
      <div
        className="relative w-[90%] max-w-[900px] rounded-2xl overflow-hidden z-10 flex flex-col shadow-2xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2
            className="text-lg font-bold tracking-wide truncate pr-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {title || 'Trailer'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close trailer"
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110"
            style={{
              background: 'rgba(229,9,20,0.15)',
              color: 'var(--secondary)',
              border: '1px solid rgba(229,9,20,0.3)',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(229,9,20,0.3)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'rgba(229,9,20,0.15)')
            }
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video or fallback */}
        <div
          className="relative w-full shrink-0 bg-black"
          style={{ paddingBottom: '56.25%' /* 16:9 */ }}
        >
          {trailerKey ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${title} — Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              style={{ background: 'var(--card)' }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.3)' }}
              >
                <svg className="w-8 h-8" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
              </div>
              <p
                className="text-base font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                Trailer for this movie is currently unavailable.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrailerModal

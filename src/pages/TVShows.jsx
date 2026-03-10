import { useDispatch } from 'react-redux'
import { addToHistory } from '../redux/slices/watchHistorySlice'
import { getTVShows, getTVShowsByGenre } from '../services/moviesService'
import PaginatedMovieRow from '../components/PaginatedMovieRow'
import { useState } from 'react'
import TrailerModal from '../components/TrailerModal'

const TVShows = () => {
  const dispatch = useDispatch()
  const [activeTrailer, setActiveTrailer] = useState(null)

  const handleTrailerClick = (movie) => {
    dispatch(addToHistory(movie))
    setActiveTrailer(movie)
  }

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

      <PaginatedMovieRow 
        title="All TV Shows" 
        fetchFn={getTVShows} 
        onTrailerClick={handleTrailerClick} 
      />
      
      <PaginatedMovieRow 
        title="Drama" 
        fetchFn={(p) => getTVShowsByGenre(18, p)} 
        onTrailerClick={handleTrailerClick} 
      />

      <PaginatedMovieRow 
        title="Action" 
        fetchFn={(p) => getTVShowsByGenre(28, p)} 
        onTrailerClick={handleTrailerClick} 
      />

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

export default TVShows

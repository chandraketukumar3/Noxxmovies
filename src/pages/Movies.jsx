import { useDispatch } from 'react-redux'
import { addToHistory } from '../redux/slices/watchHistorySlice'
import { toggleFavorite } from '../redux/slices/favoritesSlice'
import { getMovies, getMoviesByGenre } from '../services/moviesService'
import PaginatedMovieRow from '../components/PaginatedMovieRow'
import { useState } from 'react'
import TrailerModal from '../components/TrailerModal'

const Movies = () => {
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
          Movies
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Browse the latest and greatest films
        </p>
      </div>

      <PaginatedMovieRow 
        title="All Movies" 
        fetchFn={getMovies} 
        onTrailerClick={handleTrailerClick} 
      />
      
      <PaginatedMovieRow 
        title="Action" 
        fetchFn={(p) => getMoviesByGenre(28, p)} 
        onTrailerClick={handleTrailerClick} 
      />

      <PaginatedMovieRow 
        title="Thriller" 
        fetchFn={(p) => getMoviesByGenre(53, p)} 
        onTrailerClick={handleTrailerClick} 
      />

      <PaginatedMovieRow 
        title="Science Fiction" 
        fetchFn={(p) => getMoviesByGenre(878, p)} 
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

export default Movies

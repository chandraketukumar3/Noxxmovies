import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToHistory } from '../redux/slices/watchHistorySlice'
import useDebounce from '../hooks/useDebounce'
import PaginatedMovieRow from '../components/PaginatedMovieRow'
import SearchBar from '../components/SearchBar'
import Loader from '../components/Loader'
import { searchMovies } from '../services/moviesService'
import TrailerModal from '../components/TrailerModal'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const query = searchParams.get('q') || ''
  const debouncedQuery = useDebounce(query, 500)
  const [activeTrailer, setActiveTrailer] = useState(null)

  const handleSearch = (q) => {
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  const handleTrailerClick = (movie) => {
    dispatch(addToHistory(movie))
    setActiveTrailer(movie)
  }

  return (
    <div className="min-h-screen py-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1
            className="text-4xl font-bold tracking-wider uppercase mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Search
          </h1>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for movies, shows, people..."
            initialValue={query}
          />
        </div>

        {!debouncedQuery.trim() ? (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Start typing to search
            </p>
          </div>
        ) : (
          <PaginatedMovieRow
            key={debouncedQuery} // Re-mount row when query changes
            title={`Results for "${debouncedQuery}"`}
            fetchFn={(p) => searchMovies(debouncedQuery, p)}
            onTrailerClick={handleTrailerClick}
          />
        )}
      </div>

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

export default SearchResults

import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { searchMovies, clearSearch } from '../redux/slices/searchSlice'
import { addToHistory } from '../redux/slices/watchHistorySlice'
import useDebounce from '../hooks/useDebounce'
import MovieRow from '../components/MovieRow'
import SearchBar from '../components/SearchBar'
import Loader from '../components/Loader'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { results, loading, error } = useSelector((state) => state.search)

  const query = searchParams.get('q') || ''
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery.trim()) {
      dispatch(searchMovies(debouncedQuery.trim()))
    } else {
      dispatch(clearSearch())
    }
  }, [debouncedQuery, dispatch])

  const handleSearch = (q) => {
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`)
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
          {query && !loading && (
            <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {results.length > 0 ? (
                <>
                  Found{' '}
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    {results.length}
                  </span>{' '}
                  results for{' '}
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    &quot;{query}&quot;
                  </span>
                </>
              ) : (
                <>
                  No results found for{' '}
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    &quot;{query}&quot;
                  </span>
                </>
              )}
            </p>
          )}
        </div>

        {!query ? (
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
        ) : loading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" label="Searching..." />
          </div>
        ) : error ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-base font-semibold" style={{ color: 'var(--secondary)' }}>
              Search failed: {error}
            </p>
          </div>
        ) : (
          <MovieRow
            title={`Results for "${query}"`}
            movies={results}
            loading={false}
            onTrailerClick={(movie) => dispatch(addToHistory(movie))}
          />
        )}
      </div>
    </div>
  )
}

export default SearchResults

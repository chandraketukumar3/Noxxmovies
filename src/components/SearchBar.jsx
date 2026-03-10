import { useState } from 'react'

const SearchBar = ({
  onSearch,
  placeholder = 'Search movies, shows...',
  initialValue = '',
}) => {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center" role="search">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className="w-52 sm:w-64 pl-4 pr-10 py-2 rounded-lg text-sm font-medium outline-none transition-all duration-200 focus:w-72"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
      />
      <button
        type="submit"
        aria-label="Submit search"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
        style={{ color: 'var(--text-secondary)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  )
}

export default SearchBar

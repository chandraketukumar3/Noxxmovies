const People = () => {
  return (
    <div className="min-h-screen py-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1
            className="text-4xl font-bold tracking-wider uppercase"
            style={{ color: 'var(--text-primary)' }}
          >
            People
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Discover actors, directors and crew members
          </p>
        </div>

        <div
          className="flex flex-col items-center justify-center py-24 rounded-2xl"
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p
            className="text-lg font-semibold"
            style={{ color: 'var(--text-secondary)' }}
          >
            People data will appear here
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--border)' }}>
            Connect the TMDB API to load trending people
          </p>
        </div>
      </div>
    </div>
  )
}

export default People


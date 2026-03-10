import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearHistory, removeFromHistory } from '../redux/slices/watchHistorySlice'
import MovieRow from '../components/MovieRow'

const WatchHistory = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const historyItems = useSelector((state) => state.watchHistory.items)

  return (
    <div className="min-h-screen py-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1
              className="text-4xl font-bold tracking-wider uppercase"
              style={{ color: 'var(--text-primary)' }}
            >
              Watch History
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {historyItems.length > 0
                ? `${historyItems.length} title${historyItems.length > 1 ? 's' : ''} watched`
                : 'Content you&apos;ve previously viewed'}
            </p>
          </div>
          {historyItems.length > 0 && (
            <button
              className="btn-secondary text-sm"
              onClick={() => dispatch(clearHistory())}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear History
            </button>
          )}
        </div>

        {historyItems.length === 0 ? (
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>
              No watch history
            </p>
            <p className="mt-1 text-sm mb-6" style={{ color: 'var(--border)' }}>
              Movies you view will appear here automatically
            </p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              Start Watching
            </button>
          </div>
        ) : (
          <MovieRow
            title="Recently Watched"
            movies={historyItems}
            loading={false}
          />
        )}
      </div>
    </div>
  )
}

export default WatchHistory

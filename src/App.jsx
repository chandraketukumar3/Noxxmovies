import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { closeTrailer } from './redux/slices/trailerSlice'
import { setUser } from './redux/slices/authSlice'
import Navbar from './components/Navbar'
import Loader from './components/Loader'
import TrailerModal from './components/TrailerModal'
import AuthModal from './components/AuthModal'

const Home         = lazy(() => import('./pages/Home'))
const Movies       = lazy(() => import('./pages/Movies'))
const TVShows      = lazy(() => import('./pages/TVShows'))
const People       = lazy(() => import('./pages/People'))
const MovieDetails = lazy(() => import('./pages/MovieDetails'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const Favorites    = lazy(() => import('./pages/Favorites'))
const WatchHistory = lazy(() => import('./pages/WatchHistory'))
const Login        = lazy(() => import('./pages/Login'))
const Signup       = lazy(() => import('./pages/Signup'))
const PersonDetails = lazy(() => import('./pages/PersonDetails'))
const Profile       = lazy(() => import('./pages/Profile'))
const Settings      = lazy(() => import('./pages/Settings'))

const PageFallback = () => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{ background: 'var(--bg)' }}
  >
    <Loader size="lg" label="Loading..." />
  </div>
)

const AnimatedRoutes = () => {
  const location = useLocation()
  return (
    <div key={location.pathname} className="page-enter">
      <Routes location={location}>
        <Route path="/"          element={<Home />} />
        <Route path="/movies"    element={<Movies />} />
        <Route path="/tvshows"   element={<TVShows />} />
        <Route path="/people"    element={<People />} />
        <Route path="/people/:id" element={<PersonDetails />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/search"    element={<SearchResults />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/history"   element={<WatchHistory />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/profile"   element={<Profile />} />
        <Route path="/settings"  element={<Settings />} />
      </Routes>
    </div>
  )
}

function App() {
  const dispatch = useDispatch()
  const { isOpen, movie } = useSelector((state) => state.trailer)

  useEffect(() => {
    // Sync auth state with Supabase
    const syncAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        dispatch(setUser(session?.user || null))

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          dispatch(setUser(session?.user || null))
        })

        return () => subscription?.unsubscribe()
      } catch (err) {
        console.error('Auth sync error:', err)
      }
    }

    const cleanup = syncAuth()
    return () => {
      if (cleanup && typeof cleanup === 'function') cleanup()
    }
  }, [dispatch])

  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <main className="pt-16">
          <Suspense fallback={<PageFallback />}>
            <AnimatedRoutes />
          </Suspense>
        </main>

        {isOpen && movie && (
          <TrailerModal
            movieId={movie.id}
            title={movie.title || movie.name}
            mediaType={movie.first_air_date ? 'tv' : 'movie'}
            initialTrailerKey={movie.trailerKey}
            onClose={() => dispatch(closeTrailer())}
          />
        )}

        <AuthModal />
      </div>
    </BrowserRouter>
  )
}

export default App

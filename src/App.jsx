import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Loader from './components/Loader'

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
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/search"    element={<SearchResults />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/history"   element={<WatchHistory />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <main className="pt-16">
          <Suspense fallback={<PageFallback />}>
            <AnimatedRoutes />
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

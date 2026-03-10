import { useNavigate, NavLink, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import SearchBar from './SearchBar'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/movies', label: 'Movies' },
  { to: '/tvshows', label: 'TV Shows' },
  { to: '/people', label: 'People' },
  { to: '/favorites', label: 'Favorites' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    setProfileOpen(false)
    navigate('/')
  }

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setMobileOpen(false)
    }
  }

  const activeLinkClass = ({ isActive }) =>
    isActive
      ? 'text-white font-semibold relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full'
      : 'text-text-secondary hover:text-white transition-colors duration-200'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass ${
        scrolled ? 'shadow-lg' : ''
      }`}
    >
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 text-2xl font-bold tracking-widest uppercase"
            style={{ color: 'var(--primary)' }}
          >
            NOX<span className="text-white">MOVIES</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} end={to === '/'} className={activeLinkClass}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            <SearchBar onSearch={handleSearch} />
            
            {user ? (
              <div className="relative">
                <button
                  aria-label="User profile"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:ring-2 hover:ring-primary/50"
                  style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {profileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-48 rounded-xl shadow-2xl py-2 z-50 border border-white/10 animate-fade-in"
                        style={{ background: 'var(--surface)' }}>
                      <div className="px-4 py-2 border-b border-white/5 mb-1">
                        <p className="text-sm font-bold truncate text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setProfileOpen(false)}>
                        Profile
                      </Link>
                      <Link to="/settings" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setProfileOpen(false)}>
                        Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/5 transition-colors border-t border-white/5 mt-1"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary py-1.5 px-4 text-xs">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span
              className={`block h-0.5 w-6 rounded transition-all duration-300 ${
                mobileOpen ? 'rotate-45 translate-y-2' : ''
              }`}
              style={{ background: 'var(--text-primary)' }}
            />
            <span
              className={`block h-0.5 w-6 rounded transition-all duration-300 ${
                mobileOpen ? 'opacity-0' : ''
              }`}
              style={{ background: 'var(--text-primary)' }}
            />
            <span
              className={`block h-0.5 w-6 rounded transition-all duration-300 ${
                mobileOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
              style={{ background: 'var(--text-primary)' }}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="lg:hidden pb-4 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <ul className="pt-4 space-y-3">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={activeLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              {user && (
                <>
                  <li><Link to="/profile" className="block py-2 text-text-secondary" onClick={() => setMobileOpen(false)}>Profile</Link></li>
                  <li><Link to="/settings" className="block py-2 text-text-secondary" onClick={() => setMobileOpen(false)}>Settings</Link></li>
                  <li><button onClick={handleLogout} className="w-full text-left py-2 text-red-500">Logout</button></li>
                </>
              )}
              {!user && (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to="/login" className="btn-secondary py-2 text-center" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/signup" className="btn-primary py-2 text-center" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                </div>
              )}
            </ul>
            <div className="mt-4">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar

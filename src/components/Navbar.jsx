import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
            <button
              aria-label="User profile"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105"
              style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}
            >
              <svg
                className="w-5 h-5"
                style={{ color: 'var(--text-secondary)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
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

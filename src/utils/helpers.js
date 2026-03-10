/**
 * Format a date string to a human-readable format.
 * @param {string} dateStr - ISO date string
 * @returns {string} formatted date
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Truncate a string to a given length and append ellipsis.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (str, maxLength = 150) => {
  if (!str) return ''
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
}

/**
 * Build a TMDB image URL.
 * @param {string} path - image path from TMDB
 * @param {string} size - image size (default: 'w500')
 * @returns {string} full image URL
 */
export const tmdbImage = (path, size = 'w500') => {
  if (!path) return '/placeholder.png'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

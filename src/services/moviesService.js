import api from './api'

export const getTrending = (page = 1) => 
  api.get('/movies/trending', { params: { page } })

export const searchMovies = (query, page = 1) =>
  api.get('/movies/search', { params: { query, page } })

export const getMovieById = (id) => api.get(`/movies/${id}`)

export const getGenres = () => api.get('/movies/genres')

export const getMoviesByGenre = (genreId, page = 1) =>
  api.get('/movies/discover', { params: { with_genres: genreId, page, type: 'movie' } })

export const getTVShowsByGenre = (genreId, page = 1) =>
  api.get('/movies/discover', { params: { with_genres: genreId, page, type: 'tv' } })

export const getMovies = (page = 1) =>
  api.get('/movies/discover', { params: { page, type: 'movie' } })

export const getTVShows = (page = 1) =>
  api.get('/movies/discover', { params: { page, type: 'tv' } })

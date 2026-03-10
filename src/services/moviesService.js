import api from './api'

export const getTrending = () => api.get('/movies/trending')

export const searchMovies = (query) =>
  api.get('/movies/search', { params: { query } })

export const getMovieById = (id) => api.get(`/movies/${id}`)

export const getGenres = () => api.get('/movies/genres')

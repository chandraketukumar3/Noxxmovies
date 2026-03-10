import api from './api'

export const getTrending = (page = 1) => 
  api.get('/movies/trending', { params: { page } })

export const searchMovies = (query, page = 1) =>
  api.get('/movies/search', { params: { query, page } })

export const getMovieById = (id) => api.get(`/movies/${id}`)

export const getGenres = () => api.get('/movies/genres')

export const getTrendingPeople = (page = 1) =>
  api.get('/movies/trending/people', { params: { page } })

export const getMoviesByGenre = (genreId, page = 1) =>
  api.get('/movies/discover/movies', { params: { with_genres: genreId, page } })

export const getTVShowsByGenre = (genreId, page = 1) =>
  api.get('/movies/discover/tv', { params: { with_genres: genreId, page } })

export const getMovies = (page = 1) =>
  api.get('/movies/discover/movies', { params: { page } })

export const getTVShows = (page = 1) =>
  api.get('/movies/discover/tv', { params: { page } })

export const getBollywoodMovies = (page = 1) =>
  api.get('/movies/bollywood', { params: { page } })

export const getBollywoodTV = (page = 1) =>
  api.get('/movies/bollywood/tv', { params: { page } })

export const getAnime = (page = 1) =>
  api.get('/movies/anime/tv', { params: { page } })

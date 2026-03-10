import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getTrending, getGenres, getMovies, getTVShows, getTrendingPeople } from '../../services/moviesService'

export const fetchTrending = createAsyncThunk(
  'movies/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTrending()
      return response.data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch trending'
      )
    }
  },
  {
    condition: (_, { getState }) => {
      const { movies } = getState()

      if (movies.loading || movies.trending.length > 0) {
        return false
      }
    },
  }
)

export const fetchGenres = createAsyncThunk(
  'movies/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getGenres()
      return response.data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch genres'
      )
    }
  },
  {
    condition: (_, { getState }) => {
      const { movies } = getState()

      if (movies.genresLoading || movies.genres.length > 0) {
        return false
      }
    },
  }
)

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await getMovies(page)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch movies')
    }
  }
)

export const fetchTV = createAsyncThunk(
  'movies/fetchTV',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await getTVShows(page)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch TV shows')
    }
  }
)

export const fetchPeople = createAsyncThunk(
  'movies/fetchPeople',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await getTrendingPeople(page)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch people')
    }
  }
)

const moviesSlice = createSlice({
  name: 'movies',

  initialState: {
    trending: [],
    movies: [],
    tvShows: [],
    people: [],
    genres: [],
    loading: false,
    genresLoading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchTrending.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.loading = false
        // Normalize response: already .results from backend, but add safety
        state.trending = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || []
      })

      .addCase(fetchTrending.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(fetchGenres.pending, (state) => {
        state.genresLoading = true
      })

      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genresLoading = false
        state.genres = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.genres || []
      })

      .addCase(fetchGenres.rejected, (state) => {
        state.genresLoading = false
      })

      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.movies = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || []
      })

      .addCase(fetchTV.fulfilled, (state, action) => {
        state.tvShows = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || []
      })

      .addCase(fetchPeople.fulfilled, (state, action) => {
        state.people = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || []
      })
  },
})

export default moviesSlice.reducer
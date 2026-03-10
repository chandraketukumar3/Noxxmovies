import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getTrending, getGenres } from '../../services/moviesService'

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

const moviesSlice = createSlice({
  name: 'movies',

  initialState: {
    trending: [],
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

        // TMDB returns { page, results, total_pages }
        state.trending = Array.isArray(action.payload?.results)
          ? action.payload.results
          : []
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

        // TMDB returns { genres: [] }
        state.genres = Array.isArray(action.payload?.genres)
          ? action.payload.genres
          : []
      })

      .addCase(fetchGenres.rejected, (state) => {
        state.genresLoading = false
      })
  },
})

export default moviesSlice.reducer
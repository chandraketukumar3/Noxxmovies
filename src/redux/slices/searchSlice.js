import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { searchMovies as searchMoviesApi } from '../../services/moviesService'

export const searchMovies = createAsyncThunk(
  'search/searchMovies',
  async (query, { rejectWithValue }) => {
    try {
      const response = await searchMoviesApi(query)
      return { results: response.data, query }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Search failed')
    }
  }
)

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    query: '',
    loading: false,
    error: null,
  },
  reducers: {
    clearSearch(state) {
      state.results = []
      state.query = ''
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload.results
        state.query = action.payload.query
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearSearch } = searchSlice.actions
export default searchSlice.reducer

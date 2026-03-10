import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getMovieById } from '../../services/moviesService'

export const fetchMovieById = createAsyncThunk(
  'movieDetail/fetchMovieById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getMovieById(id)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch movie details')
    }
  }
)

const movieDetailSlice = createSlice({
  name: 'movieDetail',
  initialState: {
    movie: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearMovieDetail(state) {
      state.movie = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true
        state.error = null
        state.movie = null
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false
        state.movie = action.payload
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearMovieDetail } = movieDetailSlice.actions
export default movieDetailSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false,
  movie: null,
}

const trailerSlice = createSlice({
  name: 'trailer',
  initialState,
  reducers: {
    openTrailer: (state, action) => {
      state.isOpen = true
      state.movie = action.payload
    },
    closeTrailer: (state) => {
      state.isOpen = false
      state.movie = null
    },
  },
})

export const { openTrailer, closeTrailer } = trailerSlice.actions
export default trailerSlice.reducer

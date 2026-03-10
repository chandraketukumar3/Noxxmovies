import { configureStore } from '@reduxjs/toolkit'
import moviesReducer from './slices/moviesSlice'
import searchReducer from './slices/searchSlice'
import movieDetailReducer from './slices/movieDetailSlice'
import favoritesReducer from './slices/favoritesSlice'
import watchHistoryReducer from './slices/watchHistorySlice'
import trailerReducer from './slices/trailerSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    search: searchReducer,
    movieDetail: movieDetailReducer,
    favorites: favoritesReducer,
    watchHistory: watchHistoryReducer,
    trailer: trailerReducer,
    ui: uiReducer,
  },
})

export default store

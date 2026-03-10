import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'noxmovies_favorites'

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveToStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Storage not available
  }
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: loadFromStorage(),
  },
  reducers: {
    addFavorite(state, action) {
      const already = state.items.some((m) => m.id === action.payload.id)
      if (!already) {
        state.items.push(action.payload)
        saveToStorage(state.items)
      }
    },
    removeFavorite(state, action) {
      state.items = state.items.filter((m) => m.id !== action.payload)
      saveToStorage(state.items)
    },
    toggleFavorite(state, action) {
      const idx = state.items.findIndex((m) => m.id === action.payload.id)
      if (idx === -1) {
        state.items.push(action.payload)
      } else {
        state.items.splice(idx, 1)
      }
      saveToStorage(state.items)
    },
  },
})

export const { addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer

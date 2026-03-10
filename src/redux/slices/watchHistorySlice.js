import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'noxmovies_history'
const MAX_HISTORY = 50

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

const watchHistorySlice = createSlice({
  name: 'watchHistory',
  initialState: {
    items: loadFromStorage(),
  },
  reducers: {
    addToHistory(state, action) {
      state.items = state.items.filter((m) => m.id !== action.payload.id)
      state.items.unshift(action.payload)
      if (state.items.length > MAX_HISTORY) {
        state.items = state.items.slice(0, MAX_HISTORY)
      }
      saveToStorage(state.items)
    },
    removeFromHistory(state, action) {
      state.items = state.items.filter((m) => m.id !== action.payload)
      saveToStorage(state.items)
    },
    clearHistory(state) {
      state.items = []
      saveToStorage([])
    },
  },
})

export const { addToHistory, removeFromHistory, clearHistory } = watchHistorySlice.actions
export default watchHistorySlice.reducer

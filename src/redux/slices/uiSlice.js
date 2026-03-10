import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  authModal: {
    isOpen: false,
    message: '',
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAuthModal: (state, action) => {
      state.authModal.isOpen = true
      state.authModal.message = action.payload || 'Sign up or log in to continue'
    },
    closeAuthModal: (state) => {
      state.authModal.isOpen = false
      state.authModal.message = ''
    },
  },
})

export const { openAuthModal, closeAuthModal } = uiSlice.actions
export default uiSlice.reducer

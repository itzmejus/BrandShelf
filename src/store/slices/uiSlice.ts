import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean
  toasts: Toast[]
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

const initialState: UIState = {
  sidebarOpen: false,
  toasts: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload
    },
    addToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
      state.toasts.push({
        id: crypto.randomUUID(),
        ...action.payload,
      })
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
  },
})

export const { toggleSidebar, setSidebarOpen, addToast, removeToast } = uiSlice.actions
export default uiSlice.reducer

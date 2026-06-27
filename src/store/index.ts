import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import businessReducer from './slices/businessSlice'
import catalogueReducer from './slices/catalogueSlice'
import categoryReducer from './slices/categorySlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    catalogue: catalogueReducer,
    categories: categoryReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

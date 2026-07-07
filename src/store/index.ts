import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import businessReducer from './slices/businessSlice'
import catalogueReducer from './slices/catalogueSlice'
import categoryReducer from './slices/categorySlice'
import uiReducer from './slices/uiSlice'
import aboutReducer from './slices/aboutSlice'
import testimonialReducer from './slices/testimonialSlice'
import galleryReducer from './slices/gallerySlice'
import analyticsReducer from './slices/analyticsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    catalogue: catalogueReducer,
    categories: categoryReducer,
    ui: uiReducer,
    about: aboutReducer,
    testimonials: testimonialReducer,
    gallery: galleryReducer,
    analytics: analyticsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

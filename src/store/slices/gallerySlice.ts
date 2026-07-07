import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { GalleryImage, GalleryImageFormData } from '../../types'
import { galleryImageService } from '../../services/galleryImage.service'
import { signOut } from './authSlice'

interface GalleryState {
  images: GalleryImage[]
  loading: boolean
  saving: boolean
  error: string | null
}

const initialState: GalleryState = {
  images: [],
  loading: false,
  saving: false,
  error: null,
}

export const fetchGalleryImages = createAsyncThunk(
  'gallery/fetch',
  async (businessId: string, { rejectWithValue }) => {
    try {
      return await galleryImageService.getByBusinessId(businessId)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const createGalleryImage = createAsyncThunk(
  'gallery/create',
  async (
    { businessId, formData }: { businessId: string; formData: GalleryImageFormData },
    { rejectWithValue },
  ) => {
    try {
      return await galleryImageService.create(businessId, formData)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const updateGalleryImage = createAsyncThunk(
  'gallery/update',
  async (
    { imageId, formData }: { imageId: string; formData: Partial<GalleryImageFormData> },
    { rejectWithValue },
  ) => {
    try {
      return await galleryImageService.update(imageId, formData)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const deleteGalleryImage = createAsyncThunk(
  'gallery/delete',
  async (imageId: string, { rejectWithValue }) => {
    try {
      await galleryImageService.delete(imageId)
      return imageId
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    clearGalleryError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGalleryImages.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchGalleryImages.fulfilled, (state, action) => {
        state.loading = false
        state.images = action.payload
      })
      .addCase(fetchGalleryImages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createGalleryImage.pending, (state) => { state.saving = true })
      .addCase(createGalleryImage.fulfilled, (state, action) => {
        state.saving = false
        state.images.push(action.payload)
      })
      .addCase(createGalleryImage.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload as string
      })
      .addCase(updateGalleryImage.fulfilled, (state, action) => {
        const idx = state.images.findIndex((i) => i.id === action.payload.id)
        if (idx !== -1) state.images[idx] = action.payload
      })
      .addCase(updateGalleryImage.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(deleteGalleryImage.fulfilled, (state, action) => {
        state.images = state.images.filter((i) => i.id !== action.payload)
      })
      .addCase(deleteGalleryImage.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(signOut.rejected, () => initialState)
  },
})

export const { clearGalleryError } = gallerySlice.actions
export default gallerySlice.reducer

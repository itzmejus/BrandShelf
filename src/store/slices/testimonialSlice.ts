import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Testimonial, TestimonialFormData } from '../../types'
import { testimonialService } from '../../services/testimonial.service'
import { signOut } from './authSlice'

interface TestimonialState {
  testimonials: Testimonial[]
  loading: boolean
  saving: boolean
  error: string | null
}

const initialState: TestimonialState = {
  testimonials: [],
  loading: false,
  saving: false,
  error: null,
}

export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetch',
  async (businessId: string, { rejectWithValue }) => {
    try {
      return await testimonialService.getByBusinessId(businessId)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const createTestimonial = createAsyncThunk(
  'testimonials/create',
  async (
    { businessId, formData }: { businessId: string; formData: TestimonialFormData },
    { rejectWithValue },
  ) => {
    try {
      return await testimonialService.create(businessId, formData)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const updateTestimonial = createAsyncThunk(
  'testimonials/update',
  async (
    { testimonialId, formData }: { testimonialId: string; formData: Partial<TestimonialFormData> },
    { rejectWithValue },
  ) => {
    try {
      return await testimonialService.update(testimonialId, formData)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const deleteTestimonial = createAsyncThunk(
  'testimonials/delete',
  async (testimonialId: string, { rejectWithValue }) => {
    try {
      await testimonialService.delete(testimonialId)
      return testimonialId
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

const testimonialSlice = createSlice({
  name: 'testimonials',
  initialState,
  reducers: {
    clearTestimonialError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false
        state.testimonials = action.payload
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createTestimonial.pending, (state) => { state.saving = true })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.saving = false
        state.testimonials.push(action.payload)
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload as string
      })
      .addCase(updateTestimonial.pending, (state) => { state.saving = true })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.saving = false
        const idx = state.testimonials.findIndex((t) => t.id === action.payload.id)
        if (idx !== -1) state.testimonials[idx] = action.payload
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload as string
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.testimonials = state.testimonials.filter((t) => t.id !== action.payload)
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(signOut.rejected, () => initialState)
  },
})

export const { clearTestimonialError } = testimonialSlice.actions
export default testimonialSlice.reducer

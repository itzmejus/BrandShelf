import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { AboutContent, AboutContentFormData } from '../../types'
import { aboutContentService } from '../../services/aboutContent.service'
import { signOut } from './authSlice'

interface AboutState {
  about: AboutContent | null
  loading: boolean
  fetched: boolean
  saving: boolean
  error: string | null
}

const initialState: AboutState = {
  about: null,
  loading: false,
  fetched: false,
  saving: false,
  error: null,
}

export const fetchAbout = createAsyncThunk(
  'about/fetch',
  async (businessId: string, { rejectWithValue }) => {
    try {
      return await aboutContentService.getByBusinessId(businessId)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const saveAbout = createAsyncThunk(
  'about/save',
  async (
    { businessId, formData }: { businessId: string; formData: AboutContentFormData },
    { rejectWithValue },
  ) => {
    try {
      return await aboutContentService.upsert(businessId, formData)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    clearAboutError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbout.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchAbout.fulfilled, (state, action) => {
        state.loading = false
        state.about = action.payload
        state.fetched = true
      })
      .addCase(fetchAbout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.fetched = true
      })
      .addCase(saveAbout.pending, (state) => { state.saving = true; state.error = null })
      .addCase(saveAbout.fulfilled, (state, action) => {
        state.saving = false
        state.about = action.payload
      })
      .addCase(saveAbout.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload as string
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(signOut.rejected, () => initialState)
  },
})

export const { clearAboutError } = aboutSlice.actions
export default aboutSlice.reducer

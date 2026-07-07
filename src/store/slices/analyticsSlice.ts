import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { AnalyticsCounts } from '../../types'
import { analyticsEventService } from '../../services/analyticsEvent.service'
import { signOut } from './authSlice'

interface AnalyticsState {
  counts: AnalyticsCounts | null
  loading: boolean
  error: string | null
}

const initialState: AnalyticsState = {
  counts: null,
  loading: false,
  error: null,
}

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetch',
  async (
    { businessId, sinceISODate }: { businessId: string; sinceISODate: string },
    { rejectWithValue },
  ) => {
    try {
      return await analyticsEventService.getCounts(businessId, sinceISODate)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.counts = action.payload
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(signOut.rejected, () => initialState)
  },
})

export default analyticsSlice.reducer

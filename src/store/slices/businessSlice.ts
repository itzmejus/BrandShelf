import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Business, BusinessFormData } from '../../types'
import { businessService } from '../../services/business.service'
import { signOut } from './authSlice'

interface BusinessState {
  business: Business | null
  loading: boolean
  fetched: boolean   // true once the initial fetch has settled (even if null)
  saving: boolean
  error: string | null
  paid: boolean       // whether an admin has marked this business as paid
  paidFetched: boolean
}

const initialState: BusinessState = {
  business: null,
  loading: false,
  fetched: false,
  saving: false,
  error: null,
  paid: false,
  paidFetched: false,
}

export const fetchBusiness = createAsyncThunk(
  'business/fetch',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await businessService.getByUserId(userId)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const fetchPaymentStatus = createAsyncThunk(
  'business/fetchPaymentStatus',
  async (businessId: string, { rejectWithValue }) => {
    try {
      return await businessService.getPaymentStatus(businessId)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const saveBusiness = createAsyncThunk(
  'business/save',
  async (
    {
      businessId,
      userId,
      formData,
    }: { businessId: string | null; userId: string; formData: BusinessFormData },
    { rejectWithValue },
  ) => {
    try {
      if (businessId) return await businessService.update(businessId, formData)
      return await businessService.create(userId, formData)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusiness(state, action: PayloadAction<Business | null>) {
      state.business = action.payload
    },
    clearBusinessError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusiness.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBusiness.fulfilled, (state, action) => {
        state.loading = false
        state.business = action.payload
        state.fetched = true
      })
      .addCase(fetchBusiness.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.fetched = true
      })
      .addCase(saveBusiness.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(saveBusiness.fulfilled, (state, action) => {
        state.saving = false
        state.business = action.payload
      })
      .addCase(saveBusiness.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload as string
      })
      .addCase(fetchPaymentStatus.fulfilled, (state, action) => {
        state.paid = action.payload
        state.paidFetched = true
      })
      .addCase(fetchPaymentStatus.rejected, (state) => {
        state.paidFetched = true
      })
      // Reset all business data on signout to prevent cross-user data leaks
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(signOut.rejected, () => initialState)
  },
})

export const { setBusiness, clearBusinessError } = businessSlice.actions
export default businessSlice.reducer

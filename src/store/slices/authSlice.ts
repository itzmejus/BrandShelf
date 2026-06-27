import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser, LoginCredentials, RegisterCredentials } from '../../types'
import { authService } from '../../services/auth.service'
import { normalizeAuthError } from '../../utils/errors'

interface AuthState {
  user: AuthUser | null
  loading: boolean
  initialized: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  initialized: false,
  error: null,
}

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await authService.signIn(credentials)
      return { id: data.user!.id, email: data.user!.email! }
    } catch (err: unknown) {
      return rejectWithValue(normalizeAuthError((err as Error).message))
    }
  },
)

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const data = await authService.signUp(credentials)
      if (data.user) return { id: data.user.id, email: data.user.email! }
      return null
    } catch (err: unknown) {
      return rejectWithValue(normalizeAuthError((err as Error).message))
    }
  },
)

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  try {
    await authService.signOut()
  } catch (err: unknown) {
    return rejectWithValue(normalizeAuthError((err as Error).message))
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload
      state.initialized = true
    },
    setInitialized(state) {
      state.initialized = true
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.initialized = true
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signUp.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Always clear user on signout, even if the request fails
      .addCase(signOut.fulfilled, (state) => {
        state.user = null
        state.initialized = true
      })
      .addCase(signOut.rejected, (state) => {
        // Force clear local session even if Supabase call failed
        state.user = null
        state.initialized = true
      })
  },
})

export const { setUser, setInitialized, clearError } = authSlice.actions
export default authSlice.reducer

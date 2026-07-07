import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CatalogueItem, CatalogueItemFormData } from '../../types'
import { catalogueService } from '../../services/catalogue.service'
import { signOut } from './authSlice'

interface CatalogueState {
  items: CatalogueItem[]
  loading: boolean
  saving: boolean
  error: string | null
  searchQuery: string
  selectedCategoryId: string
}

const initialState: CatalogueState = {
  items: [],
  loading: false,
  saving: false,
  error: null,
  searchQuery: '',
  selectedCategoryId: '',
}

export const fetchItems = createAsyncThunk(
  'catalogue/fetchItems',
  async (businessId: string, { rejectWithValue }) => {
    try {
      return await catalogueService.getByBusinessId(businessId)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const createItem = createAsyncThunk(
  'catalogue/createItem',
  async (
    { businessId, formData }: { businessId: string; formData: CatalogueItemFormData },
    { rejectWithValue },
  ) => {
    try {
      return await catalogueService.create(businessId, formData)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const updateItem = createAsyncThunk(
  'catalogue/updateItem',
  async (
    { itemId, formData }: { itemId: string; formData: Partial<CatalogueItemFormData> },
    { rejectWithValue },
  ) => {
    try {
      return await catalogueService.update(itemId, formData)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const deleteItem = createAsyncThunk(
  'catalogue/deleteItem',
  async (itemId: string, { rejectWithValue }) => {
    try {
      await catalogueService.delete(itemId)
      return itemId
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

const catalogueSlice = createSlice({
  name: 'catalogue',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategoryId = action.payload
    },
    clearCatalogueError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createItem.pending, (state) => { state.saving = true })
      .addCase(createItem.fulfilled, (state, action) => {
        state.saving = false
        state.items.unshift(action.payload)
      })
      .addCase(createItem.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload as string
      })
      .addCase(updateItem.pending, (state) => { state.saving = true })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.saving = false
        const idx = state.items.findIndex((i) => i.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload as string
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload)
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(signOut.rejected, () => initialState)
  },
})

export const { setSearchQuery, setSelectedCategory, clearCatalogueError } = catalogueSlice.actions
export default catalogueSlice.reducer

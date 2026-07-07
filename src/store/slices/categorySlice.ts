import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Category, CategoryFormData } from '../../types'
import { categoryService } from '../../services/category.service'
import { signOut } from './authSlice'

interface CategoryState {
  categories: Category[]
  loading: boolean
  saving: boolean
  error: string | null
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  saving: false,
  error: null,
}

export const fetchCategories = createAsyncThunk(
  'categories/fetch',
  async (businessId: string, { rejectWithValue }) => {
    try {
      return await categoryService.getByBusinessId(businessId)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const createCategory = createAsyncThunk(
  'categories/create',
  async (
    { businessId, formData }: { businessId: string; formData: CategoryFormData },
    { rejectWithValue },
  ) => {
    try {
      return await categoryService.create(businessId, formData)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const updateCategory = createAsyncThunk(
  'categories/update',
  async (
    { categoryId, formData }: { categoryId: string; formData: Partial<CategoryFormData> },
    { rejectWithValue },
  ) => {
    try {
      return await categoryService.update(categoryId, formData)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      await categoryService.delete(categoryId)
      return categoryId
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  },
)

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createCategory.pending, (state) => { state.saving = true })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.saving = false
        state.categories.push(action.payload)
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload as string
      })
      .addCase(updateCategory.pending, (state) => { state.saving = true })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.saving = false
        const idx = state.categories.findIndex((c) => c.id === action.payload.id)
        if (idx !== -1) state.categories[idx] = action.payload
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload as string
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload)
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(signOut.rejected, () => initialState)
  },
})

export const { clearCategoryError } = categorySlice.actions
export default categorySlice.reducer

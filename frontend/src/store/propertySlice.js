import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  properties: [],
  currentProperty: null,
  loading: false,
  error: null,
  searchFilters: {
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: '',
  },
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    fetchPropertiesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPropertiesSuccess: (state, action) => {
      state.loading = false;
      state.properties = action.payload;
    },
    fetchPropertiesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentProperty: (state, action) => {
      state.currentProperty = action.payload;
    },
    updateSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchPropertiesStart,
  fetchPropertiesSuccess,
  fetchPropertiesFailure,
  setCurrentProperty,
  updateSearchFilters,
  clearError,
} = propertySlice.actions;

export default propertySlice.reducer;
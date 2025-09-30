import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    fetchBookingsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBookingsSuccess: (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
    },
    fetchBookingsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createBookingStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createBookingSuccess: (state, action) => {
      state.loading = false;
      state.bookings.push(action.payload);
    },
    createBookingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchBookingsStart,
  fetchBookingsSuccess,
  fetchBookingsFailure,
  createBookingStart,
  createBookingSuccess,
  createBookingFailure,
  setCurrentBooking,
  clearError,
} = bookingSlice.actions;

export default bookingSlice.reducer;
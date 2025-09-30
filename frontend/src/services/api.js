import axios from 'axios';

// Using API Gateway for all requests
const API_GATEWAY_URL = 'http://localhost:8080';

const createServiceClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createServiceClient(API_GATEWAY_URL);

export const authAPI = {
  login: (credentials) => apiClient.post('/api/auth/signin', credentials),
  register: (userData) => apiClient.post('/api/auth/signup', userData),
};

export const propertyAPI = {
  getAllProperties: () => apiClient.get('/api/properties'),
  getPropertyById: (id) => apiClient.get(`/api/properties/${id}`),
  searchProperties: (params) => apiClient.get('/api/properties/search', { params }),
  createProperty: (propertyData) => apiClient.post('/api/properties', propertyData),
  updateProperty: (id, propertyData) => apiClient.put(`/api/properties/${id}`, propertyData),
  deleteProperty: (id) => apiClient.delete(`/api/properties/${id}`),
};

export const userAPI = {
  getAllUsers: () => apiClient.get('/api/users'),
  getUserById: (id) => apiClient.get(`/api/users/${id}`),
  updateUserRole: (id, role) => apiClient.put(`/api/users/${id}/role?role=${role}`),
  deleteUser: (id) => apiClient.delete(`/api/users/${id}`),
};

export const bookingAPI = {
  getAllBookings: () => apiClient.get('/api/bookings'),
  getBookingById: (id) => apiClient.get(`/api/bookings/${id}`),
  createBooking: (bookingData) => apiClient.post('/api/bookings', bookingData),
  updateBookingStatus: (id, status) => apiClient.put(`/api/bookings/${id}/status?status=${status}`),
  getBookingsByTenant: (tenantId) => apiClient.get(`/api/bookings/tenant/${tenantId}`),
  getBookingsByLandlord: (landlordId) => apiClient.get(`/api/bookings/landlord/${landlordId}`),
  checkAvailability: (propertyId, startDate, endDate) =>
    apiClient.get(`/api/bookings/property/${propertyId}/availability`, {
      params: { startDate, endDate },
    }),
};

// Export API client
export { apiClient };
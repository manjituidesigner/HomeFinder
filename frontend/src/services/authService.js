// Auth service (mocked for frontend testing)
import api from './apiService';

export const login = async (email, password) => {
  // Mock login for testing
  return { user: { id: 1, email }, token: 'mock-token' };
};

export const register = async (userData) => {
  // Mock register for testing
  return { message: 'User registered', uid: 'mock-uid' };
};

export const logout = async () => {
  // Mock logout
  return { message: 'Logged out' };
};
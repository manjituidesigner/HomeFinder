// Auth service (real API calls to backend auth endpoints)
import api from './apiService';

export const login = async (payload) => {
  const res = await api.post('/auth/login', payload);
  return res.data;
};

export const register = async (userData) => {
  const res = await api.post('/auth/signup-initiate', userData);
  return res.data;
};

export const verifySignupOtp = async (payload) => {
  const res = await api.post('/auth/signup-verify-otp', payload);
  return res.data;
};

export const forgotPasswordInitiate = async (payload) => {
  const res = await api.post('/auth/forgot-password-initiate', payload);
  return res.data;
};

export const forgotPasswordVerifyOtp = async (payload) => {
  const res = await api.post('/auth/forgot-password-verify-otp', payload);
  return res.data;
};

export const resetPassword = async (payload) => {
  const res = await api.post('/auth/reset-password', payload);
  return res.data;
};

export const logout = async () => {
  // Mock logout
  return { message: 'Logged out' };
};
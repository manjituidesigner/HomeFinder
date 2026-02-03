// Tenant service
import api from './apiService';

export const getTenants = async (propertyId) => {
  const response = await api.get(`/properties/${propertyId}/tenants`);
  return response.data;
};

export const getTenantProfile = async (id) => {
  const response = await api.get(`/tenants/${id}`);
  return response.data;
};

export const updateTenantProfile = async (id, profileData) => {
  const response = await api.put(`/tenants/${id}`, profileData);
  return response.data;
};
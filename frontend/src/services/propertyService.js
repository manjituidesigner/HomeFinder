// Property service
import api from './apiService';

export const getProperties = async () => {
  const response = await api.get('/properties');
  return response.data;
};

export const getPropertyById = async (id) => {
  const response = await api.get(`/properties/${id}`);
  return response.data;
};

export const createProperty = async (propertyData) => {
  const response = await api.post('/properties', propertyData);
  return response.data;
};

export const createPropertyWithImages = async (propertyData) => {
  const formData = new FormData();

  Object.keys(propertyData).forEach(key => {
    if (key !== 'images') {
      const value = propertyData[key];
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    }
  });

  if (propertyData.images && propertyData.images.length > 0) {
    for (let i = 0; i < propertyData.images.length; i++) {
      const uri = propertyData.images[i];
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('images', blob, `property_image_${i}.jpg`);
      } catch (err) {
        console.error('Error fetching image blob:', err);
      }
    }
  }

  const response = await api.post('/properties', formData);
  return response.data;
};

export const updateProperty = async (id, propertyData) => {
  const response = await api.put(`/properties/${id}`, propertyData);
  return response.data;
};

export const deleteProperty = async (id) => {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
};
import { Platform } from 'react-native';

// Constants
const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL || process.env.REACT_APP_API_URL;

const getDevApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3002/api';
  }
  return 'http://localhost:3002/api';
};

const DEFAULT_DEV_API_URL = getDevApiUrl();
const DEFAULT_PROD_API_URL = 'https://backend-psi-puce-37.vercel.app/api';
let isProdEnv = process.env.NODE_ENV === 'production';

if (typeof window !== 'undefined' && window.location) {
  const host = window.location.hostname;
  // If running on localhost, force development API
  if (host === 'localhost' || host === '127.0.0.1') {
    isProdEnv = false;
  } 
  // If running on a live domain (like Vercel) and not github spaces, force production API
  else if (!host.endsWith('github.dev')) {
    isProdEnv = true;
  }
}

export const API_BASE_URL = ENV_API_URL || (isProdEnv ? DEFAULT_PROD_API_URL : DEFAULT_DEV_API_URL);
export const PROPERTY_TYPES = ['1bhk', '2bhk', '3bhk', 'PG', 'Per Bed'];
export const INCLUSIONS = ['Bed', 'Fan', 'Cooler', 'Fridge', 'AC', 'RO', 'Kitchen', 'Gas'];
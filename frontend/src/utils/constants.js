// Constants
const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL || process.env.REACT_APP_API_URL;
const DEFAULT_DEV_API_URL = 'http://localhost:3000/api';
const DEFAULT_PROD_API_URL = 'https://rently-backend-67fu.onrender.com/api';
const IS_PROD = process.env.NODE_ENV === 'production';

export const API_BASE_URL = ENV_API_URL || (IS_PROD ? DEFAULT_PROD_API_URL : DEFAULT_DEV_API_URL);
export const PROPERTY_TYPES = ['1bhk', '2bhk', '3bhk', 'PG', 'Per Bed'];
export const INCLUSIONS = ['Bed', 'Fan', 'Cooler', 'Fridge', 'AC', 'RO', 'Kitchen', 'Gas'];
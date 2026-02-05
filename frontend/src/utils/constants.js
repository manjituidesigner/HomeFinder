// Constants
const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL || process.env.REACT_APP_API_URL;

const getDevApiUrl = () => {
  // Detect if running in GitHub Codespaces (web environment)
  if (typeof window !== 'undefined' && window.location && window.location.hostname.endsWith('github.dev')) {
    // Replace the current port (e.g. 19006) with backend port 3000
    // URL format: <codespace-name>-<port>.app.github.dev
    const hostname = window.location.hostname.replace(/-(\d+)\.app\.github\.dev$/, '-3000.app.github.dev');
    return `https://${hostname}/api`;
  }
  return 'http://localhost:3000/api';
};

const DEFAULT_DEV_API_URL = getDevApiUrl();
const DEFAULT_PROD_API_URL = 'https://rently-backend-67fu.onrender.com/api';
const IS_PROD = process.env.NODE_ENV === 'production';

export const API_BASE_URL = ENV_API_URL || (IS_PROD ? DEFAULT_PROD_API_URL : DEFAULT_DEV_API_URL);
export const PROPERTY_TYPES = ['1bhk', '2bhk', '3bhk', 'PG', 'Per Bed'];
export const INCLUSIONS = ['Bed', 'Fan', 'Cooler', 'Fridge', 'AC', 'RO', 'Kitchen', 'Gas'];
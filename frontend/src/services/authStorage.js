// Auth token storage with optional Expo SecureStore + web localStorage fallback

let cachedToken = null;
const listeners = new Set();
const TOKEN_KEY = 'auth_token';

const tryGetSecureStore = () => {
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    return require('expo-secure-store');
  } catch (e) {
    return null;
  }
};

const getWebStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (e) {
    return null;
  }
  return null;
};

const notify = () => {
  for (const cb of listeners) {
    try {
      cb(cachedToken);
    } catch (e) {
      // ignore listener error
    }
  }
};

export const subscribeAuthToken = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const getAuthToken = async () => {
  if (typeof cachedToken === 'string' && cachedToken.length > 0) return cachedToken;

  const SecureStore = tryGetSecureStore();
  if (SecureStore) {
    try {
      const stored = await SecureStore.getItemAsync(TOKEN_KEY);
      cachedToken = stored || null;
      return cachedToken;
    } catch (e) {
      // ignore secure store errors and fall back
    }
  }

  const webStorage = getWebStorage();
  if (webStorage) {
    const stored = webStorage.getItem(TOKEN_KEY);
    cachedToken = stored || null;
    return cachedToken;
  }

  return null;
};

export const setAuthToken = async (token) => {
  cachedToken = token || null;

  const SecureStore = tryGetSecureStore();
  if (SecureStore) {
    try {
      if (cachedToken) {
        await SecureStore.setItemAsync(TOKEN_KEY, cachedToken);
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (e) {
      // ignore
    }
  }

  const webStorage = getWebStorage();
  if (webStorage) {
    try {
      if (cachedToken) {
        webStorage.setItem(TOKEN_KEY, cachedToken);
      } else {
        webStorage.removeItem(TOKEN_KEY);
      }
    } catch (e) {
      // ignore
    }
  }

  notify();
};

export const clearAuthToken = async () => {
  await setAuthToken(null);
};

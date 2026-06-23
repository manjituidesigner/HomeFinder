// Auth token storage with optional Expo SecureStore + web localStorage fallback

let cachedSession = { token: null, user: null };
const listeners = new Set();
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const tryGetSecureStore = () => {
  try {
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
      cb(cachedSession.token, cachedSession.user);
    } catch (e) {}
  }
};

export const subscribeAuthToken = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const getAuthSession = async () => {
  if (typeof cachedSession.token === 'string' && cachedSession.token.length > 0) {
    return cachedSession;
  }

  const SecureStore = tryGetSecureStore();
  if (SecureStore) {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      let parsedUser = null;
      try {
        const storedUser = await SecureStore.getItemAsync(USER_KEY);
        if (storedUser && storedUser !== 'undefined') {
          parsedUser = JSON.parse(storedUser);
        }
      } catch (e) {}
      
      cachedSession.token = storedToken || null;
      cachedSession.user = parsedUser;
      return cachedSession;
    } catch (e) {}
  }

  const webStorage = getWebStorage();
  if (webStorage) {
    const storedToken = webStorage.getItem(TOKEN_KEY);
    let parsedUser = null;
    try {
      const storedUser = webStorage.getItem(USER_KEY);
      if (storedUser && storedUser !== 'undefined') {
        parsedUser = JSON.parse(storedUser);
      }
    } catch (e) {}
    
    cachedSession.token = storedToken || null;
    cachedSession.user = parsedUser;
    return cachedSession;
  }

  return { token: null, user: null };
};

export const getAuthToken = async () => {
  const session = await getAuthSession();
  return session.token;
};

export const setAuthSession = async (token, user = null) => {
  cachedSession.token = token || null;
  cachedSession.user = user || null;

  const userString = user ? JSON.stringify(user) : null;

  const SecureStore = tryGetSecureStore();
  if (SecureStore) {
    try {
      if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
      else await SecureStore.deleteItemAsync(TOKEN_KEY);

      if (userString) await SecureStore.setItemAsync(USER_KEY, userString);
      else await SecureStore.deleteItemAsync(USER_KEY);
    } catch (e) {}
  }

  const webStorage = getWebStorage();
  if (webStorage) {
    try {
      if (token) webStorage.setItem(TOKEN_KEY, token);
      else webStorage.removeItem(TOKEN_KEY);

      if (userString) webStorage.setItem(USER_KEY, userString);
      else webStorage.removeItem(USER_KEY);
    } catch (e) {}
  }

  notify();
};

export const setAuthToken = async (token) => {
  // Legacy support
  await setAuthSession(token, cachedSession.user);
};

export const clearAuthToken = async () => {
  await setAuthSession(null, null);
};

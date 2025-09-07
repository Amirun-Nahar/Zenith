export const safeJSONParse = (str, fallback = null) => {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch (e) {
    console.warn('JSON Parse error:', e);
    return fallback;
  }
};

export const getStoredUser = () => {
  return safeJSONParse(localStorage.getItem('user'), null);
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const clearStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

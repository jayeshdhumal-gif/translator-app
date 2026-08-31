const API_BASE_URL = 'http://localhost:8080';
const AUTH_URL = `${API_BASE_URL}/api/auth`;
const PROFILE_URL = `${API_BASE_URL}/api/profiles`;

function getToken() {
  return localStorage.getItem('token');
}

function setAuthSession(userData) {
  localStorage.setItem('token', userData.token);
  localStorage.setItem('userName', userData.name || '');
  localStorage.setItem('userEmail', userData.email || '');
  localStorage.setItem('userRole', userData.role || 'USER');
}

export function clearAuthSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
}

async function request(url, options = {}, requiresAuth = false) {
  const headers = { ...(options.headers || {}) };

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (requiresAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const data = await response.json();
      if (data.message) {
        message = data.message;
      } else if (data.error) {
        message = data.error;
      }
    } catch (error) {
      // Ignore JSON parse errors and fall back to default message.
    }
    throw new Error(message);
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
}

export async function registerUser(user) {
  return request(`${AUTH_URL}/register`, {
    method: 'POST',
    body: JSON.stringify(user)
  });
}

export async function loginUser(user) {
  const data = await request(`${AUTH_URL}/login`, {
    method: 'POST',
    body: JSON.stringify(user)
  });

  setAuthSession(data);
  return data;
}

export async function getCurrentUser() {
  return request(`${AUTH_URL}/me`, { method: 'GET' }, true);
}

export function getStoredUser() {
  const name = localStorage.getItem('userName');
  const email = localStorage.getItem('userEmail');
  const role = localStorage.getItem('userRole');

  if (!name && !email && !role) {
    return null;
  }

  return {
    name: name || '',
    email: email || '',
    role: role || 'USER'
  };
}

export async function logoutUser() {
  clearAuthSession();
  return true;
}

export async function getProfiles() {
  return request(PROFILE_URL, { method: 'GET' }, true);
}

export async function createProfile(profile) {
  return request(PROFILE_URL, {
    method: 'POST',
    body: JSON.stringify(profile)
  }, true);
}

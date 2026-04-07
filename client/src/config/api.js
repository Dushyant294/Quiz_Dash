// API Configuration
export const API_BASE = 'http://localhost:5000/api';

/**
 * Get auth headers with JWT token
 */
export function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

/**
 * Auth-enabled fetch wrapper
 */
export async function authFetch(endpoint, options = {}) {
  const headers = authHeaders();
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });
  return response;
}

/**
 * Public fetch wrapper
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  return response;
}

/**
 * Auth-enabled fetch for FormData (no Content-Type — let browser set boundary)
 */
export async function authUpload(endpoint, formData) {
  const token = localStorage.getItem('token');
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: formData
  });
  return response;
}

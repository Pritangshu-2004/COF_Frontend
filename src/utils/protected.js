// Utility for managing JWT token in the frontend

// Get token from cookie (if not HTTP-only) or localStorage
export function getToken() {
  // Try cookie first
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  if (match) return match[2];
  // Fallback to localStorage
  return localStorage.getItem('token');
}

// Set token in localStorage (for global access, if not using HTTP-only cookie)
export function setToken(token) {
  localStorage.setItem('token', token);
  // Optionally, set as cookie (not HTTP-only)
  document.cookie = `token=${token}; path=/;`;
}

// Remove token
export function removeToken() {
  localStorage.removeItem('token');
  document.cookie = 'token=; Max-Age=0; path=/;';
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getToken();
}

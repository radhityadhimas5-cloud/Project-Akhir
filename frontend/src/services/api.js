/**
 * API Service for connecting React Frontend with Laravel Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * Perform a fetch request to the Laravel API
 * @param {string} endpoint - API path (e.g., '/status')
 * @param {RequestInit} [options] - Fetch options
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error((data && data.message) || `Request failed with status ${response.status}`)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

/**
 * Check backend connection status
 */
export async function checkBackendStatus() {
  return apiRequest('/status')
}

export default {
  apiRequest,
  checkBackendStatus,
}


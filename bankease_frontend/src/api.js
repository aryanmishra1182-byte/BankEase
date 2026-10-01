/* =========================================================
   BANKEASE API CLIENT
   JWT session + clean backend error handling
   ========================================================= */

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const TOKEN_KEY = 'bankease_token'
const USER_KEY = 'bankease_user'

/* =========================================================
   SESSION
   ========================================================= */

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function getUser() {
  try {
    const stored = localStorage.getItem(USER_KEY)

    return stored
        ? JSON.parse(stored)
        : null
  } catch {
    return null
  }
}

export function saveSession(data) {
  if (!data?.token) {
    throw new Error(
        'Login succeeded but BankEase did not return an authentication token.'
    )
  }

  localStorage.setItem(
      TOKEN_KEY,
      data.token
  )

  localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        id: data.id,
        fullname: data.fullname,
        email: data.email,
        role: data.role,
        status: data.status
      })
  )
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function forceLogout() {
  clearSession()

  window.dispatchEvent(
      new Event('bankease:logout')
  )
}

/* =========================================================
   RESPONSE PARSING
   Handles both JSON and plain-text responses
   from GlobalExceptionHandler
   ========================================================= */

async function readResponseBody(response) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function extractErrorMessage(
    body,
    fallback = 'Something went wrong.'
) {
  if (
      typeof body === 'string' &&
      body.trim()
  ) {
    return body.trim()
  }

  if (body?.message) {
    return body.message
  }

  if (body?.error) {
    return body.error
  }

  if (Array.isArray(body?.errors)) {
    const messages = body.errors
        .map(error =>
            error?.defaultMessage ||
            error?.message ||
            String(error)
        )
        .filter(Boolean)

    if (messages.length) {
      return messages.join(', ')
    }
  }

  return fallback
}

/* =========================================================
   CORE REQUEST
   ========================================================= */

async function request(
    path,
    {
      method = 'GET',
      body,
      auth = true,
      signal,
      headers: customHeaders = {}
    } = {}
) {
  const headers =
      new Headers(customHeaders)

  headers.set(
      'Accept',
      'application/json'
  )

  if (
      body !== undefined &&
      body !== null
  ) {
    headers.set(
        'Content-Type',
        'application/json'
    )
  }

  if (auth) {
    const token = getToken()

    if (token) {
      headers.set(
          'Authorization',
          `Bearer ${token}`
      )
    }
  }

  let response

  try {
    response = await fetch(
        `${API_BASE}${path}`,
        {
          method,
          headers,
          signal,
          body:
              body === undefined ||
              body === null
                  ? undefined
                  : JSON.stringify(body)
        }
    )
  } catch (error) {

    if (
        error?.name ===
        'AbortError'
    ) {
      throw new Error(
          'Request cancelled.'
      )
    }

    throw new Error(
        'BankEase cannot reach the backend. Make sure Spring Boot is running on port 8080.'
    )
  }

  const responseBody =
      await readResponseBody(
          response
      )

  /* -------------------------------------------------------
     401 — session expired / invalid token
     ------------------------------------------------------- */

  if (
      response.status === 401 &&
      auth
  ) {
    forceLogout()

    throw new Error(
        'Your BankEase session has expired. Please sign in again.'
    )
  }

  /* -------------------------------------------------------
     403 — role/security restriction
     ------------------------------------------------------- */

  if (response.status === 403) {
    throw new Error(
        extractErrorMessage(
            responseBody,
            'You are not authorized to perform this action.'
        )
    )
  }

  /* -------------------------------------------------------
     Other backend errors
     ------------------------------------------------------- */

  if (!response.ok) {
    throw new Error(
        extractErrorMessage(
            responseBody,
            `BankEase request failed with status ${response.status}.`
        )
    )
  }

  return responseBody
}

/* =========================================================
   AUTHENTICATION
   ========================================================= */

export async function login(
    email,
    password
) {
  const cleanEmail =
      String(email || '').trim()

  if (
      !cleanEmail ||
      !password
  ) {
    throw new Error(
        'Enter your email and password.'
    )
  }

  const data =
      await request(
          '/login',
          {
            method: 'POST',
            auth: false,
            body: {
              email: cleanEmail,
              password
            }
          }
      )

  saveSession(data)

  return data
}

export async function register(
    fullname,
    email,
    phone,
    password
) {
  const cleanName =
      String(fullname || '').trim()

  const cleanEmail =
      String(email || '').trim()

  const cleanPhone =
      String(phone || '').trim()

  if (
      !cleanName ||
      !cleanEmail ||
      !cleanPhone ||
      !password
  ) {
    throw new Error(
        'Complete all registration fields.'
    )
  }

  return request(
      '/users',
      {
        method: 'POST',
        auth: false,
        body: {
          fullname: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password
        }
      }
  )
}

export function logout() {
  forceLogout()
}

/* =========================================================
   API OBJECT
   ========================================================= */

export const api = {

  /* -------------------------------------------------------
     GET
     ------------------------------------------------------- */

  get(
      path,
      options = {}
  ) {
    return request(
        path,
        {
          ...options,
          method: 'GET'
        }
    )
  },

  /* -------------------------------------------------------
     POST
     ------------------------------------------------------- */

  post(
      path,
      body,
      options = {}
  ) {
    return request(
        path,
        {
          ...options,
          method: 'POST',
          body
        }
    )
  },

  /* -------------------------------------------------------
     PATCH
     ------------------------------------------------------- */

  patch(
      path,
      body,
      options = {}
  ) {
    return request(
        path,
        {
          ...options,
          method: 'PATCH',
          body
        }
    )
  },

  /* =======================================================
     ADMIN — LOAN APPLICATION QUEUE
     ======================================================= */

  getAdminLoanApplications(
      status = null
  ) {
    const query =
        status
            ? `?status=${encodeURIComponent(status)}`
            : ''

    return request(
        `/admin/loans/applications${query}`,
        {
          method: 'GET'
        }
    )
  }
}

/* =========================================================
   EXPORT
   ========================================================= */

export {
  API_BASE
}
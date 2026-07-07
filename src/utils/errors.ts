/**
 * Normalises raw Supabase / network error messages into short, user-friendly
 * strings that don't expose internal implementation details.
 */
export function normalizeAuthError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials') || m.includes('invalid credentials')) {
    return 'Invalid email or password.'
  }
  if (m.includes('email not confirmed')) {
    return 'Please confirm your email address before signing in.'
  }
  if (m.includes('user already registered')) {
    return 'An account with this email already exists. Please sign in.'
  }
  if (m.includes('password should be') || m.includes('password must be')) {
    return 'Password must be at least 8 characters.'
  }
  if (m.includes('rate limit') || m.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  if (m.includes('network') || m.includes('fetch failed') || m.includes('failed to fetch')) {
    return 'Connection error. Please check your internet connection and try again.'
  }
  if (m.includes('email address') && m.includes('invalid')) {
    return 'Please enter a valid email address.'
  }
  return 'Something went wrong. Please try again.'
}

export function normalizeStorageError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('payload too large') || m.includes('file size')) {
    return 'File is too large. Maximum size is 5 MB.'
  }
  if (m.includes('mime') || m.includes('content-type')) {
    return 'Invalid file type. Please upload a JPEG, PNG, WEBP, or GIF.'
  }
  if (m.includes('duplicate') || m.includes('already exists')) {
    return 'A file with this name already exists.'
  }
  return 'Upload failed. Please try again.'
}

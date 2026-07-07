export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB

export function validateImageFile(file: File): string | null {
  if (!Object.prototype.hasOwnProperty.call(ALLOWED_IMAGE_TYPES, file.type)) {
    return 'Only JPEG, PNG, WEBP, and GIF images are allowed.'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1)
    return `Image must be smaller than 5 MB. Your file is ${sizeMB} MB.`
  }
  return null
}

export function safeImagePath(businessId: string, mimeType: string): string {
  const ext = ALLOWED_IMAGE_TYPES[mimeType]
  if (!ext) throw new Error('Unsupported image type')
  // businessId comes from Supabase (UUID format) — safe, but sanitize defensively
  const safeId = businessId.replace(/[^a-z0-9-]/gi, '')
  return `${safeId}/${crypto.randomUUID()}.${ext}`
}

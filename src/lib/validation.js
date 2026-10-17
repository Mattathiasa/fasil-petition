const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email) {
  return EMAIL_RE.test(email)
}

export function normalizeEmail(email) {
  return email.toLowerCase().trim()
}

export function signatureStorageKey(email) {
  return `fasil_petition_signed_${normalizeEmail(email)}`
}

import { describe, it, expect } from 'vitest'
import { isValidEmail, normalizeEmail, signatureStorageKey } from './validation'

describe('isValidEmail', () => {
  it('accepts ordinary addresses', () => {
    expect(isValidEmail('abebe@example.com')).toBe(true)
    expect(isValidEmail('a.b+c@mail.example.co.et')).toBe(true)
  })

  it('rejects malformed addresses', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('not-an-email')).toBe(false)
    expect(isValidEmail('no-tld@example')).toBe(false)
    expect(isValidEmail('spaces in@example.com')).toBe(false)
    expect(isValidEmail('two@@example.com')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
  })
})

describe('normalizeEmail', () => {
  it('lowercases and trims', () => {
    expect(normalizeEmail('  Abebe@Example.COM ')).toBe('abebe@example.com')
  })
})

describe('signatureStorageKey', () => {
  it('is stable across casing and whitespace', () => {
    expect(signatureStorageKey('Abebe@Example.com')).toBe(
      signatureStorageKey('  abebe@example.com  ')
    )
  })

  it('is namespaced per email', () => {
    expect(signatureStorageKey('a@example.com')).toBe(
      'fasil_petition_signed_a@example.com'
    )
    expect(signatureStorageKey('a@example.com')).not.toBe(
      signatureStorageKey('b@example.com')
    )
  })
})

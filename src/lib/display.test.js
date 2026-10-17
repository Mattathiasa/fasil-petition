import { describe, it, expect } from 'vitest'
import { getInitial, getDisplayName } from './display'

describe('getInitial', () => {
  it('uppercases a single-letter initial', () => {
    expect(getInitial('a')).toBe('A')
    expect(getInitial('አ')).toBe('አ')
  })

  it('falls back to a checkmark when there is no initial', () => {
    expect(getInitial('')).toBe('✓')
    expect(getInitial(null)).toBe('✓')
    expect(getInitial(undefined)).toBe('✓')
  })
})

describe('getDisplayName', () => {
  it('shows initial + city when both are present', () => {
    expect(getDisplayName('አ', 'ጎንደር')).toBe('አ. ደጋፊ ከጎንደር')
  })

  it('drops the city clause when there is no city', () => {
    expect(getDisplayName('በ', null)).toBe('በ. ደጋፊ')
    expect(getDisplayName('በ', '')).toBe('በ. ደጋፊ')
  })

  it('falls back to a generic supporter label without an initial', () => {
    expect(getDisplayName(null, 'ጎንደር')).toBe('ደጋፊ')
    expect(getDisplayName('', null)).toBe('ደጋፊ')
  })
})

import { describe, it, expect } from 'vitest'
import { timeAgo } from './time'

const ago = (ms) => ({ toMillis: () => Date.now() - ms })

describe('timeAgo', () => {
  it('shows pending state for a null (unsynced serverTimestamp)', () => {
    expect(timeAgo(null)).toBe('ቀሪ...')
  })

  it('shows pending state for non-timestamp values', () => {
    expect(timeAgo(undefined)).toBe('ቀሪ...')
    expect(timeAgo({})).toBe('ቀሪ...')
    expect(timeAgo('2026-01-01')).toBe('ቀሪ...')
  })

  it('handles the just-now window', () => {
    expect(timeAgo(ago(0))).toBe('አሁን ደረሰ')
    expect(timeAgo(ago(4_000))).toBe('አሁን ደረሰ')
    expect(timeAgo(ago(5_000))).toBe('ከ5 ሰከንድ በፊት')
  })

  it('formats seconds', () => {
    expect(timeAgo(ago(45_000))).toBe('ከ45 ሰከንድ በፊት')
  })

  it('formats minutes, including the singular', () => {
    expect(timeAgo(ago(59_000))).toBe('ከ59 ሰከንድ በፊት')
    expect(timeAgo(ago(60_000))).toBe('ከ1 ደቂቃ በፊት')
    expect(timeAgo(ago(10 * 60_000))).toBe('ከ10 ደቂቃ በፊት')
    expect(timeAgo(ago(59 * 60_000))).toBe('ከ59 ደቂቃ በፊት')
  })

  it('formats hours', () => {
    expect(timeAgo(ago(60 * 60_000))).toBe('ከ1 ሰዓት በፊት')
    expect(timeAgo(ago(5 * 60 * 60_000))).toBe('ከ5 ሰዓት በፊት')
  })

  it('formats days', () => {
    expect(timeAgo(ago(24 * 60 * 60_000))).toBe('ትናንት')
    expect(timeAgo(ago(3 * 24 * 60 * 60_000))).toBe('ከ3 ቀን በፊት')
  })

  it('formats weeks', () => {
    expect(timeAgo(ago(7 * 24 * 60 * 60_000))).toBe('ከ1 ሳምንት በፊት')
    expect(timeAgo(ago(14 * 24 * 60 * 60_000))).toBe('ከ2 ሳምንት በፊት')
  })

  it('keeps showing weeks for ~a month, then switches to months', () => {
    expect(timeAgo(ago(30 * 24 * 60 * 60_000))).toBe('ከ4 ሳምንት በፊት')
    expect(timeAgo(ago(35 * 24 * 60 * 60_000))).toBe('ከ1 ወር በፊት')
    expect(timeAgo(ago(90 * 24 * 60 * 60_000))).toBe('ከ3 ወር በፊት')
  })
})

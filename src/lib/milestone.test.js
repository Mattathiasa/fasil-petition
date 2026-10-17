import { describe, it, expect } from 'vitest'
import { GOAL, MILESTONES, nextMilestone, percentSigned } from './milestone'

describe('nextMilestone', () => {
  it('returns the first milestone above the current count', () => {
    expect(nextMilestone(0)).toBe(1000)
    expect(nextMilestone(999)).toBe(1000)
    expect(nextMilestone(1000)).toBe(2500)
    expect(nextMilestone(10_000)).toBe(15_000)
  })

  it('falls back to the goal once all milestones are passed', () => {
    expect(nextMilestone(GOAL)).toBe(GOAL)
    expect(nextMilestone(GOAL + 5_000)).toBe(GOAL)
  })
})

describe('percentSigned', () => {
  it('computes progress toward the goal', () => {
    expect(percentSigned(0)).toBe(0)
    expect(percentSigned(10_000)).toBe(50)
    expect(percentSigned(1_000)).toBe(5)
  })

  it('caps at 100% when over goal', () => {
    expect(percentSigned(GOAL)).toBe(100)
    expect(percentSigned(GOAL * 2)).toBe(100)
  })

  it('is safe against a non-positive goal', () => {
    expect(percentSigned(10, 0)).toBe(0)
  })
})

describe('milestones', () => {
  it('are strictly increasing and end at the goal', () => {
    for (let i = 1; i < MILESTONES.length; i++) {
      expect(MILESTONES[i]).toBeGreaterThan(MILESTONES[i - 1])
    }
    expect(MILESTONES[MILESTONES.length - 1]).toBe(GOAL)
  })
})

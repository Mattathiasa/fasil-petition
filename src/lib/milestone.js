export const GOAL = 20000
export const MILESTONES = [1000, 2500, 5000, 10000, 15000, 20000]

export function nextMilestone(n) {
  return MILESTONES.find((m) => m > n) ?? GOAL
}

export function percentSigned(count, goal = GOAL) {
  if (goal <= 0) return 0
  return Math.min((count / goal) * 100, 100)
}

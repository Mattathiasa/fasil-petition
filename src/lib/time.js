// Shared time-ago formatting for signature timestamps.
// `ts` is anything with a `toMillis()` method (Firestore Timestamp) or nullish
// while a serverTimestamp write is still pending locally.

export function timeAgo(ts) {
  if (!ts || typeof ts.toMillis !== 'function') return 'ቀሪ...'

  const seconds = Math.floor((Date.now() - ts.toMillis()) / 1000)

  if (seconds < 5) return 'አሁን ደረሰ'
  if (seconds < 60) return `ከ${seconds} ሰከንድ በፊት`

  const minutes = Math.floor(seconds / 60)
  if (minutes === 1) return 'ከ1 ደቂቃ በፊት'
  if (minutes < 60) return `ከ${minutes} ደቂቃ በፊት`

  const hours = Math.floor(minutes / 60)
  if (hours === 1) return 'ከ1 ሰዓት በፊት'
  if (hours < 24) return `ከ${hours} ሰዓት በፊት`

  const days = Math.floor(hours / 24)
  if (days === 1) return 'ትናንት'
  if (days < 7) return `ከ${days} ቀን በፊት`

  const weeks = Math.floor(days / 7)
  if (weeks === 1) return 'ከ1 ሳምንት በፊት'
  if (weeks < 5) return `ከ${weeks} ሳምንት በፊት`

  const months = Math.floor(days / 30)
  if (months === 1) return 'ከ1 ወር በፊት'
  return `ከ${months} ወር በፊት`
}

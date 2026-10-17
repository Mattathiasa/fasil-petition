// Display helpers for the public recent-signers feed.
// The feed only ever receives a first-letter initial (`nameInitial`) —
// full names live in the private collection.

export function getInitial(nameInitial) {
  if (!nameInitial) return '✓'
  return nameInitial.charAt(0).toUpperCase()
}

export function getDisplayName(nameInitial, city) {
  if (!nameInitial) return 'ደጋፊ'
  if (city) return `${nameInitial}. ደጋፊ ከ${city}`
  return `${nameInitial}. ደጋፊ`
}

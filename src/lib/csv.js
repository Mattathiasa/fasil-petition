// CSV export for the admin panel.
// Cells are quoted per RFC 4180, and values starting with a formula character
// ( = + - @ tab CR ) are prefixed with an apostrophe so Excel/Sheets treat
// them as text instead of executing them (CSV formula injection).

const FORMULA_PREFIXES = ['=', '+', '-', '@', '\t', '\r']

function csvCell(value) {
  let s = value == null ? '' : String(value)
  if (FORMULA_PREFIXES.some((p) => s.startsWith(p))) s = `'${s}`
  return `"${s.replace(/"/g, '""')}"`
}

function csvRow(cells) {
  return cells.map(csvCell).join(',')
}

export function buildSignaturesCsv(signatures) {
  const header = ['#', 'ሙሉ ስም', 'ኢሜይል', 'ከተማ', 'አስተያየት', 'ቀን/ሰዓት']
  const rows = signatures.map((s, i) => [
    i + 1,
    s.name ?? '',
    s.email ?? '',
    s.city ?? '',
    s.comment ?? '',
    s.createdAt ? s.createdAt.toDate().toISOString() : '',
  ])
  const csv = [header, ...rows].map(csvRow).join('\n')
  return '\ufeff' + csv
}

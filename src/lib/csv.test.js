import { describe, it, expect } from 'vitest'
import { buildSignaturesCsv } from './csv'

const fakeTs = (iso) => ({ toDate: () => new Date(iso) })

describe('buildSignaturesCsv', () => {
  it('starts with a UTF-8 BOM so Excel reads Amharic correctly', () => {
    expect(buildSignaturesCsv([]).startsWith('\ufeff')).toBe(true)
  })

  it('emits the header row', () => {
    const csv = buildSignaturesCsv([])
    expect(csv).toContain('"#"')
    expect(csv).toContain('"ሙሉ ስም"')
    expect(csv).toContain('"ኢሜይል"')
  })

  it('maps signature documents to rows', () => {
    const csv = buildSignaturesCsv([
      {
        name: 'አበበ ከበደ',
        email: 'abebe@example.com',
        city: 'ጎንደር',
        comment: 'የክለቡን ክብር ይመለስ',
        createdAt: fakeTs('2026-01-02T03:04:05.000Z'),
      },
    ])
    const lines = csv.split('\n')
    expect(lines).toHaveLength(2)
    expect(lines[1]).toBe(
      '"1","አበበ ከበደ","abebe@example.com","ጎንደር","የክለቡን ክብር ይመለስ","2026-01-02T03:04:05.000Z"'
    )
  })

  it('renders missing optional fields as empty cells', () => {
    const csv = buildSignaturesCsv([{ name: 'ሳላ', createdAt: null }])
    expect(csv.split('\n')[1]).toBe('"1","ሳላ","","","",""')
  })

  it('doubles embedded quotes per RFC 4180', () => {
    const csv = buildSignaturesCsv([{ name: 'ሰላመደ"ወርቅ' }])
    expect(csv).toContain('"ሰላመደ""ወርቅ"')
  })

  it('keeps commas and newlines inside the quoted cell', () => {
    const csv = buildSignaturesCsv([{ comment: 'አንድ፣ ሁለት\nስድስት' }])
    expect(csv).toContain('"አንድ፣ ሁለት\nስድስት"')
  })

  it('neutralises formula injection in text cells', () => {
    for (const payload of ['=SUM(A1:A9)', '+1', '-1', '@cmd', '\t=1', '\r=1']) {
      const csv = buildSignaturesCsv([{ name: payload }])
      expect(csv.split('\n')[1]).toContain(`"'${payload.replace(/"/g, '""')}"`)
    }
  })

  it('does not prefix ordinary values', () => {
    const csv = buildSignaturesCsv([{ name: 'አበበ' }])
    expect(csv.split('\n')[1]).not.toContain(`"'`)
  })
})

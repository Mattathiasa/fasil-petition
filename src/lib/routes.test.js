import { describe, it, expect } from 'vitest'
import { normalizePath, getRoute } from './routes'

describe('normalizePath', () => {
  it('returns / for empty or missing input', () => {
    expect(normalizePath('')).toBe('/')
    expect(normalizePath(undefined)).toBe('/')
    expect(normalizePath(null)).toBe('/')
  })

  it('keeps the root path', () => {
    expect(normalizePath('/')).toBe('/')
  })

  it('strips a trailing slash', () => {
    expect(normalizePath('/admin/')).toBe('/admin')
    expect(normalizePath('/admin///')).toBe('/admin')
  })

  it('collapses duplicate slashes', () => {
    expect(normalizePath('//admin')).toBe('/admin')
    expect(normalizePath('/a//b/')).toBe('/a/b')
  })

  it('decodes percent-encoding', () => {
    expect(normalizePath('/%61dmin')).toBe('/admin')
  })

  it('keeps malformed percent-encoding as-is', () => {
    expect(normalizePath('/%E0%A4%A')).toBe('/%E0%A4%A')
  })

  it('does not lowercase the path', () => {
    expect(normalizePath('/Admin')).toBe('/Admin')
  })
})

describe('getRoute', () => {
  it('routes / and // to home', () => {
    expect(getRoute('/')).toBe('home')
    expect(getRoute('//')).toBe('home')
  })

  it('routes /admin and sloppy variants to admin', () => {
    expect(getRoute('/admin')).toBe('admin')
    expect(getRoute('/admin/')).toBe('admin')
    expect(getRoute('//admin//')).toBe('admin')
  })

  it('routes anything else to notFound', () => {
    expect(getRoute('/nope')).toBe('notFound')
    expect(getRoute('/admin/settings')).toBe('notFound')
    expect(getRoute('/Admin')).toBe('notFound')
  })
})

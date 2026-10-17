// Client-side route matching for the one-page app (public / admin / 404).
// Vercel rewrites every path to index.html, so this is the source of truth
// for which view to render.

export function normalizePath(pathname) {
  if (!pathname) return '/'
  let p = pathname
  try {
    p = decodeURIComponent(p)
  } catch {
    // malformed percent-encoding — keep the raw path
  }
  p = p.replace(/\/{2,}/g, '/')
  if (p.length > 1) p = p.replace(/\/+$/, '')
  return p
}

export function getRoute(pathname) {
  const path = normalizePath(pathname)
  if (path === '/admin') return 'admin'
  if (path === '/') return 'home'
  return 'notFound'
}

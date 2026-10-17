// Design tokens — single source of truth for the visual palette.
// Inline styles across the app reference these instead of raw hex values,
// so re-theming happens here (values are mirrored as CSS variables in
// index.css for the CSS-side rules).

export const colors = {
  // backgrounds
  bg: '#0a0a0a',
  bgAlt: '#0d0d0d',
  surface: '#111',
  surface2: '#181818',
  rowAlt: '#0f0f0f',
  control: '#1a1a1a',

  // borders
  border: '#1a1a1a',
  borderCard: '#1e1e1e',
  borderStrong: '#222',
  borderMid: '#2a2a2a',
  borderInput: '#333',

  // text
  text: '#fff',
  textDim: '#ccc',
  textMuted: '#aaa',
  textFaint: '#555',

  // brand
  brand: '#CC0000',
  brandLight: '#ff4444',
  brandTint: 'rgba(204,0,0,0.12)',
  brandTintSoft: 'rgba(204,0,0,0.08)',
  brandEdge: 'rgba(204,0,0,0.35)',
  brandHairline: 'rgba(204,0,0,0.2)',
  brandFaint: 'rgba(204,0,0,0.06)',
  brandWash: 'rgba(204,0,0,0.1)',
  brandHalo: 'rgba(204,0,0,0.15)',
  brandEdgeSoft: 'rgba(204,0,0,0.3)',
  brandAura: 'rgba(204,0,0,0.28)',

  // translucent neutrals
  whiteHalf: 'rgba(255,255,255,0.5)',
  whiteFaint: 'rgba(255,255,255,0.1)',
  whiteEdge: 'rgba(255,255,255,0.08)',

  // status
  success: '#4ade80',
  successBright: '#22c55e',
  successTint: 'rgba(34,197,94,0.15)',
  successBg: '#0c1f0c',
  successBgSoft: '#0f2a14',
  successBorder: '#1a4a1a',
  info: '#4fc3f7',
  danger: '#ff7070',
  dangerBg: '#2a0f0f',
  warn: '#ffaa00',
  warnBright: '#ff0',
  pending: '#fffa',

  // social
  telegramBg: '#0088cc22',
  telegramBorder: '#0088cc44',
}

export const gradients = {
  hero: 'linear-gradient(170deg, #1c0000 0%, #0f0000 50%, #0a0a0a 100%)',
  fadeToBg: 'linear-gradient(to top, #0a0a0a 70%, transparent)',
  brandProgress: 'linear-gradient(90deg, #CC0000, #ff4444)',
  brandAura: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(204,0,0,0.28) 0%, transparent 65%)',
  caption: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
}

export const shadows = {
  cta: '0 -4px 30px rgba(204,0,0,0.5)',
  brandRing: '0 0 20px rgba(204,0,0,0.6)',
  brandGlow: '0 0 24px rgba(204,0,0,0.9)',
  brandSubmit: '0 4px 24px rgba(204,0,0,0.45)',
}

export const fonts = {
  body: "'Noto Sans Ethiopic', 'Ethiopic', sans-serif",
}

// Deterministic per-avatar background derived from the signature hue.
export const avatarBg = (hue) => `hsl(${hue}, 55%, 32%)`

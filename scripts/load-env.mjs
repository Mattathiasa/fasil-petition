// Minimal .env loader for dev scripts (no dependency, works on any Node
// version — `node --env-file` needs newer runtimes). Values already present
// in process.env are never overwritten.
import { readFileSync } from 'node:fs'

const envUrl = new URL('../.env', import.meta.url)

try {
  for (const line of readFileSync(envUrl, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (m && !line.trim().startsWith('#') && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
} catch {
  // no .env file — ambient environment must provide the values
}

export function projectId() {
  const id =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.VITE_FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT
  if (!id) {
    console.error(
      'Missing project id — set FIREBASE_PROJECT_ID (or VITE_FIREBASE_PROJECT_ID).\n' +
        'Tip: put it in .env next to the VITE_FIREBASE_* values.'
    )
    process.exit(1)
  }
  return id
}

export function requireServiceAccount() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error(
      'Missing GOOGLE_APPLICATION_CREDENTIALS — export it first:\n' +
        '  export GOOGLE_APPLICATION_CREDENTIALS=~/path/to/serviceAccount.json\n' +
        '(Firebase Console → Project settings → Service accounts → Generate new private key)'
    )
    process.exit(1)
  }
}

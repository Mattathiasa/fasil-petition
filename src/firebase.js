import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const missing = Object.entries(firebaseConfig).filter(([, v]) => !v).map(([k]) => k)

// With a fresh clone and no .env the app must still render (read-only UI)
// instead of crashing to a blank page — guard the SDK init.
export const firebaseReady = missing.length === 0

if (!firebaseReady) {
  console.error('[Firebase] Missing env vars:', missing, '— signatures will NOT save.')
}

let app = null
let db = null
let auth = null

if (firebaseReady) {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  auth = getAuth(app)
}

export { app, db, auth }

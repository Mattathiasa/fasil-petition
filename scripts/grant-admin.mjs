#!/usr/bin/env node
// Grant (or revoke) the admin custom claim that firestore.rules checks.
//
// Usage:
//   export GOOGLE_APPLICATION_CREDENTIALS=~/path/to/serviceAccount.json
//   npm run admin:grant -- admin@example.com
//   npm run admin:grant -- admin@example.com --revoke
//
// The claim takes effect once the user's ID token refreshes (reload the
// page or sign out/in within a minute).

import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { projectId, requireServiceAccount } from './load-env.mjs'

const email = process.argv[2]
const revoke = process.argv.includes('--revoke')

if (!email || !email.includes('@')) {
  console.error('Usage: npm run admin:grant -- <admin-email> [--revoke]')
  process.exit(1)
}

requireServiceAccount()
initializeApp({ credential: applicationDefault(), projectId: projectId() })

const user = await getAuth().getUserByEmail(email)

if (revoke) {
  await getAuth().setCustomUserClaims(user.uid, { admin: null })
  console.log(`✓ Revoked admin claim from ${email} (${user.uid})`)
} else {
  await getAuth().setCustomUserClaims(user.uid, { admin: true })
  console.log(`✓ Granted admin claim to ${email} (${user.uid})`)
  console.log('  They can now read signatures_private and recount the counter.')
  console.log('  Propagates after the ID token refreshes — reload within a minute.')
}

import { readFileSync } from 'node:fs'
import { afterAll, beforeAll, beforeEach, describe, it, expect } from 'vitest'
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

const { serverTimestamp, increment } = firebase.firestore.FieldValue

let env

// emulators:exec publishes FIRESTORE_EMULATOR_HOST; passing it explicitly
// avoids the hub-discovery check that fails on some firebase-tools versions.
const [emuHost, emuPort] = (process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8081').split(':')

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-fasil-rules',
    firestore: {
      rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8'),
      host: emuHost,
      port: Number(emuPort),
    },
  })
}, 60_000)

afterAll(async () => {
  await env?.cleanup()
})

beforeEach(async () => {
  await env.clearFirestore()
})

// rules-unit-testing v3 hands back a firebase/compat Firestore instance.
const anon = () => env.unauthenticatedContext().firestore()
const user = (uid = 'someone') => env.authenticatedContext(uid).firestore()
const admin = () => env.authenticatedContext('admin-uid', { admin: true }).firestore()

async function seed(fn) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await fn(ctx.firestore())
  })
}

const validPublic = () => ({
  nameInitial: 'አ',
  city: 'ጎንደር',
  comment: 'ፋሲል ከነማ',
  createdAt: serverTimestamp(),
})

const validPrivate = () => ({
  name: 'አበበ ከበደ',
  email: 'abebe@example.com',
  city: 'ጎንደር',
  comment: null,
  createdAt: serverTimestamp(),
})

const seededPublic = () => ({ ...validPublic(), createdAt: new Date() })
const seededPrivate = () => ({ ...validPrivate(), createdAt: new Date() })

// ── signatures (public feed) ────────────────────────────────────────
describe('signatures (public feed)', () => {
  it('allows an anonymous valid create', async () => {
    await assertSucceeds(anon().doc('signatures/sig1').set(validPublic()))
  })

  it('rejects an email field in the public doc', async () => {
    await assertFails(
      anon().doc('signatures/sig1').set({ ...validPublic(), email: 'leak@example.com' })
    )
  })

  it('rejects a full-name field in the public doc', async () => {
    await assertFails(
      anon().doc('signatures/sig1').set({ ...validPublic(), name: 'አበበ ከበደ' })
    )
  })

  it('rejects a create without nameInitial', async () => {
    await assertFails(
      anon().doc('signatures/sig1').set({ city: null, comment: null, createdAt: serverTimestamp() })
    )
  })

  it('rejects an oversized comment (max 500)', async () => {
    await assertFails(
      anon().doc('signatures/sig1').set({ ...validPublic(), comment: 'x'.repeat(501) })
    )
  })

  it('accepts a comment at exactly 500 chars', async () => {
    await assertSucceeds(
      anon().doc('signatures/sig1').set({ ...validPublic(), comment: 'x'.repeat(500) })
    )
  })

  it('allows anonymous reads of the feed', async () => {
    await seed((db) => db.doc('signatures/seed').set(seededPublic()))
    await assertSucceeds(anon().doc('signatures/seed').get())
    await assertSucceeds(
      anon().collection('signatures').orderBy('createdAt', 'desc').limit(5).get()
    )
  })

  it('rejects updates from everyone, including admins', async () => {
    await seed((db) => db.doc('signatures/seed').set(seededPublic()))
    await assertFails(
      anon().doc('signatures/seed').set({ ...validPublic(), comment: 'edited' })
    )
    await assertFails(
      admin().doc('signatures/seed').set({ ...validPublic(), comment: 'edited' })
    )
  })

  it('rejects deletes from everyone', async () => {
    await seed((db) => db.doc('signatures/seed').set(seededPublic()))
    await assertFails(anon().doc('signatures/seed').delete())
    await assertFails(admin().doc('signatures/seed').delete())
  })
})

// ── signatures_private (identity data) ──────────────────────────────
describe('signatures_private', () => {
  it('allows an anonymous create (the sign flow writes it)', async () => {
    await assertSucceeds(anon().doc('signatures_private/sig1').set(validPrivate()))
  })

  it('rejects a malformed email', async () => {
    await assertFails(
      anon().doc('signatures_private/sig1').set({ ...validPrivate(), email: 'not-an-email' })
    )
  })

  it('rejects an oversized name (max 100)', async () => {
    await assertFails(
      anon().doc('signatures_private/sig1').set({ ...validPrivate(), name: 'x'.repeat(101) })
    )
  })

  it('rejects reads by anonymous visitors', async () => {
    await seed((db) => db.doc('signatures_private/seed').set(seededPrivate()))
    await assertFails(anon().doc('signatures_private/seed').get())
    await assertFails(anon().collection('signatures_private').get())
  })

  it('rejects reads by signed-in non-admin users', async () => {
    await seed((db) => db.doc('signatures_private/seed').set(seededPrivate()))
    await assertFails(user().doc('signatures_private/seed').get())
  })

  it('allows reads with the admin claim', async () => {
    await seed((db) => db.doc('signatures_private/seed').set(seededPrivate()))
    await assertSucceeds(admin().doc('signatures_private/seed').get())
    await assertSucceeds(
      admin().collection('signatures_private').orderBy('createdAt', 'desc').get()
    )
  })

  it('rejects updates and deletes, even for admins', async () => {
    await seed((db) => db.doc('signatures_private/seed').set(seededPrivate()))
    await assertFails(admin().doc('signatures_private/seed').set(seededPrivate()))
    await assertFails(admin().doc('signatures_private/seed').delete())
  })
})

// ── signed_emails (write-once duplicate lock) ───────────────────────
describe('signed_emails', () => {
  it('allows an anonymous create', async () => {
    await assertSucceeds(
      anon().doc('signed_emails/abebe@example.com').set({ createdAt: serverTimestamp() })
    )
  })

  it('allows get of a known address (duplicate check)', async () => {
    await assertSucceeds(
      anon().doc('signed_emails/abebe@example.com').set({ createdAt: serverTimestamp() })
    )
    await assertSucceeds(anon().doc('signed_emails/abebe@example.com').get())
  })

  it('rejects list — no email enumeration', async () => {
    await seed((db) => db.doc('signed_emails/abebe@example.com').set({ createdAt: new Date() }))
    await assertFails(anon().collection('signed_emails').get())
  })

  it('rejects overwriting the lock (write-once)', async () => {
    await assertSucceeds(
      anon().doc('signed_emails/abebe@example.com').set({ createdAt: serverTimestamp() })
    )
    await assertFails(
      anon().doc('signed_emails/abebe@example.com').set({ createdAt: serverTimestamp() })
    )
  })

  it('rejects a lock id that is not an email', async () => {
    await assertFails(
      anon().doc('signed_emails/not-an-email').set({ createdAt: serverTimestamp() })
    )
  })
})

// ── stats/count (atomic counter) ────────────────────────────────────
describe('stats/count', () => {
  it('allows the anonymous initial create at exactly 1', async () => {
    await assertSucceeds(anon().doc('stats/count').set({ total: 1 }))
  })

  it('rejects an anonymous initial value other than 1', async () => {
    await assertFails(anon().doc('stats/count').set({ total: 7 }))
  })

  it('allows an anonymous +1 increment', async () => {
    await seed((db) => db.doc('stats/count').set({ total: 41 }))
    await assertSucceeds(
      anon().doc('stats/count').set({ total: increment(1) }, { merge: true })
    )
  })

  it('rejects an increment larger than +1', async () => {
    await seed((db) => db.doc('stats/count').set({ total: 41 }))
    await assertFails(
      anon().doc('stats/count').set({ total: increment(2) }, { merge: true })
    )
  })

  it('rejects an update that adds another field', async () => {
    await seed((db) => db.doc('stats/count').set({ total: 41 }))
    await assertFails(
      anon().doc('stats/count').set({ total: increment(1), hacked: true }, { merge: true })
    )
  })

  it('rejects an arbitrary set by non-admins (recount is admin-only)', async () => {
    await seed((db) => db.doc('stats/count').set({ total: 41 }))
    await assertFails(anon().doc('stats/count').set({ total: 9999 }, { merge: true }))
    await assertFails(user().doc('stats/count').set({ total: 9999 }, { merge: true }))
  })

  it('allows the admin recount to any value', async () => {
    await seed((db) => db.doc('stats/count').set({ total: 41 }))
    await assertSucceeds(admin().doc('stats/count').set({ total: 9999 }, { merge: true }))
  })

  it('allows public reads of the counter', async () => {
    await seed((db) => db.doc('stats/count').set({ total: 41 }))
    await assertSucceeds(anon().doc('stats/count').get())
  })

  it('rejects deletes', async () => {
    await seed((db) => db.doc('stats/count').set({ total: 41 }))
    await assertFails(anon().doc('stats/count').delete())
    await assertFails(admin().doc('stats/count').delete())
  })
})

// ── default deny ────────────────────────────────────────────────────
describe('default deny', () => {
  it('rejects access to collections outside the schema', async () => {
    await assertFails(anon().doc('random_collection/x').set({ anything: 1 }))
    await assertFails(anon().collection('random_collection').get())
  })
})

// ── the full sign flow as one transaction-shaped sequence ───────────
describe('sign flow (all four writes)', () => {
  it('succeeds for an anonymous signer', async () => {
    const db = anon()
    // Rules evaluate each write independently; this mirrors what the
    // client transaction in SignForm submits.
    await assertSucceeds(db.doc('signatures/sig9').set(validPublic()))
    await assertSucceeds(db.doc('signatures_private/sig9').set(validPrivate()))
    await assertSucceeds(
      db.doc('signed_emails/abebe@example.com').set({ createdAt: serverTimestamp() })
    )
    await assertSucceeds(db.doc('stats/count').set({ total: increment(1) }, { merge: true }))
  })
})

describe('test sanity', () => {
  it('has run the suite against a non-empty rule set', () => {
    const rules = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8')
    expect(rules).toContain('service cloud.firestore')
  })
})

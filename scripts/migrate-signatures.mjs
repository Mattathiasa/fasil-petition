#!/usr/bin/env node
// One-off migration: legacy signature docs stored the full name and email
// inside the public `signatures` collection. The current model splits that
// into:
//   signatures/{id}           nameInitial, city, comment, createdAt
//   signatures_private/{id}   name, email, city, comment, createdAt (same id)
//
// Usage:
//   npm run migrate:dry      # report what would change (default, safe)
//   npm run migrate:apply    # write a JSON backup first, then migrate
//
// Requires GOOGLE_APPLICATION_CREDENTIALS (Admin SDK — bypasses security
// rules). Safe to re-run: already-migrated docs are skipped and the private
// doc is written deterministically from the public doc.

import { mkdirSync, writeFileSync } from 'node:fs'
import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { projectId, requireServiceAccount } from './load-env.mjs'

const APPLY = process.argv.includes('--apply')

function classify(data) {
  const legacy = 'email' in data || 'name' in data
  const migrated = 'nameInitial' in data
  if (legacy && !migrated) return 'legacy'
  if (migrated && !legacy) return 'migrated'
  if (legacy && migrated) return 'legacy' // stray initial — strip old fields too
  return 'unknown'
}

function initialOf(name) {
  return (name ?? '').trim().charAt(0) || '✓'
}

const PUBLIC_KEYS = new Set(['nameInitial', 'city', 'comment', 'createdAt'])
const IDENTITY_KEYS = new Set(['name', 'email'])

requireServiceAccount()
initializeApp({ credential: applicationDefault(), projectId: projectId() })
const db = getFirestore()

console.log(`Reading signatures/ (${APPLY ? 'APPLY mode' : 'dry-run'})...`)
const snap = await db.collection('signatures').get()
const docs = snap.docs
console.log(`  ${docs.length.toLocaleString()} documents found`)

const legacy = []
const migrated = []
const unknown = []

for (const d of docs) {
  const data = d.data()
  const kind = classify(data)
  if (kind === 'legacy') legacy.push({ id: d.id, data })
  else if (kind === 'migrated') migrated.push(d.id)
  else unknown.push({ id: d.id, data })
}

console.log(`  legacy (need migration): ${legacy.length.toLocaleString()}`)
console.log(`  already migrated:        ${migrated.length.toLocaleString()}`)
if (unknown.length) console.log(`  unrecognized shape:      ${unknown.length} (skipped: ${unknown.map((u) => u.id).slice(0, 5).join(', ')})`)

if (legacy.length === 0) {
  console.log('✓ Nothing to do.')
  process.exit(0)
}

// ── Show a preview of the transformation ────────────────────────────
console.log('\nPreview (first 3):')
for (const { id, data } of legacy.slice(0, 3)) {
  console.log(`  ${id}`)
  console.log(`    public  : name=${JSON.stringify(data.name)} email=${JSON.stringify(data.email)} → nameInitial=${JSON.stringify(initialOf(data.name))} (email dropped)`)
  console.log(`    private : full name + email move to signatures_private/${id}`)
}

if (!APPLY) {
  console.log('\nDry-run only — nothing written. Re-run with `npm run migrate:apply` to execute.')
  process.exit(0)
}

// ── Backup first ────────────────────────────────────────────────────
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const backupDir = new URL('../backup/', import.meta.url)
mkdirSync(backupDir, { recursive: true })
const backupFile = new URL(`signatures-backup-${stamp}.json`, backupDir)
const backup = docs.map((d) => {
  const data = d.data()
  return {
    id: d.id,
    name: data.name ?? null,
    email: data.email ?? null,
    city: data.city ?? null,
    comment: data.comment ?? null,
    phone: data.phone ?? null,
    createdAtISO: data.createdAt?.toDate?.().toISOString() ?? null,
    nameInitial: data.nameInitial ?? null,
    raw: data,
  }
})
writeFileSync(backupFile, JSON.stringify(backup, null, 2))
console.log(`\nBackup written: ${backupFile.pathname}`)

// ── Migrate in batches (2-3 writes per doc, 400 ops per batch) ──────
// Prefetch existing email locks so we never overwrite one.
const existingLocks = new Set()
{
  const locks = await db.collection('signed_emails').get()
  locks.forEach((d) => existingLocks.add(d.id))
}
console.log(`  email locks already present: ${existingLocks.size.toLocaleString()}`)

const DOCS_PER_BATCH = 200
let done = 0
let failures = 0

for (let i = 0; i < legacy.length; i += DOCS_PER_BATCH) {
  const chunk = legacy.slice(i, i + DOCS_PER_BATCH)
  const batch = db.batch()

  for (const { id, data } of chunk) {
    // Fields outside the public schema (phone, …) ride along to the private doc.
    const extra = {}
    for (const [k, v] of Object.entries(data)) {
      if (!PUBLIC_KEYS.has(k) && !IDENTITY_KEYS.has(k) && v !== undefined) extra[k] = v
    }

    // identity copy — same document id as the public doc
    batch.set(db.collection('signatures_private').doc(id), {
      name: data.name ?? '',
      email: data.email ?? '',
      city: data.city ?? null,
      comment: data.comment ?? null,
      createdAt: data.createdAt ?? FieldValue.delete(),
      ...extra,
    })

    // public doc — keep display fields, add initial, strip every other key
    const strip = {}
    for (const k of Object.keys(data)) {
      if (!PUBLIC_KEYS.has(k)) strip[k] = FieldValue.delete()
    }
    batch.update(db.collection('signatures').doc(id), {
      nameInitial: initialOf(data.name),
      ...strip,
      city: data.city ?? null,
      comment: data.comment ?? null,
      ...(data.createdAt ? {} : { createdAt: FieldValue.delete() }),
    })

    // write-once email lock for the duplicate guard (skipped if present)
    const email = (data.email ?? '').trim().toLowerCase()
    if (email && !existingLocks.has(email)) {
      batch.create(db.collection('signed_emails').doc(email), {
        createdAt: data.createdAt ?? FieldValue.serverTimestamp(),
      })
      existingLocks.add(email)
    }
  }

  try {
    await batch.commit()
    done += chunk.length
    console.log(`  ${done.toLocaleString()} / ${legacy.length.toLocaleString()} migrated`)
  } catch (err) {
    failures += chunk.length
    console.error(`  ✗ batch at ${i} failed: ${err.message}`)
  }
}

console.log(`\nDone: ${done.toLocaleString()} migrated, ${failures} failed.`)
if (failures === 0) {
  console.log('Next: open /admin → 🔄 Recount to re-verify the counter (it should not change).')
  process.exit(0)
}
console.error('Some batches failed — the script is safe to re-run (already-migrated docs are skipped).')
process.exit(1)

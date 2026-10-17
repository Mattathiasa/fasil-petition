import { defineConfig } from 'vitest/config'

// Firestore rules tests — run only via `npm run test:rules`, which wraps
// vitest in `firebase emulators:exec --only firestore`.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    testTimeout: 30_000,
    hookTimeout: 60_000,
    fileParallelism: false,
  },
})

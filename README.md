# ፋሲል ከነማ እግርኳስ ክለብ — ፔቲሽን

A real-time Amharic-language petition platform calling for the resignation of
Fasil Kenema FC chairman. Built as a full-stack portfolio piece demonstrating
real-time data, atomic writes, privacy-first storage, and production deployment.

**Live:** [fasil-petition.vercel.app](https://fasil-petition.vercel.app) · **License:** MIT

---

## What it does

Supporters sign a petition with their name, email, and optional comment.
Every submission runs as a **single Firestore transaction** that atomically:

1. writes the public feed doc (initial, city, comment — no PII),
2. writes the identity doc (`signatures_private`, admin-only),
3. claims the email lock (write-once, prevents duplicates across devices),
4. increments the live counter by exactly `+1`.

The signature count, progress bar, and recent signers feed all update live
via `onSnapshot`. An admin panel at `/admin` provides search, pagination,
CSV export, and a recount tool that repairs the counter against the real
document count.

## Key features

| Feature | Details |
|---|---|
| Real-time counter | Animated count-up with `requestAnimationFrame`, single shared Firestore listener (`CountContext`) |
| Milestone progress bar | Visual progress toward 20,000 signature goal with milestone markers + confetti |
| Recent signers feed | Live feed with time-ago labels, auto-refreshes every 30s |
| Share to Telegram + TikTok | Deep-link share buttons with pre-filled Amharic text, toast feedback |
| Mobile sticky CTA | Bottom bar that scrolls users to the sign form |
| Admin dashboard | Firebase Auth sign-in + `admin` claim gate, live first page + cursor pagination, search, full-collection CSV export, recount fix |
| Privacy by design | Public feed stores only a first-letter initial; name/email live in an admin-only collection |
| Resilient UI | Top-level error boundary, toast system, and graceful degradation when `VITE_*` env vars are missing |
| SEO & social sharing | Open Graph + Twitter Card meta tags for clean link previews |
| Dark UI | Design-token palette (`src/lib/theme.js`), Noto Sans Ethiopic throughout |

## Tech stack

- **React 18** + **Vite 5** — fast HMR, optimized production builds, lazy-loaded admin bundle
- **Firebase Firestore** — real-time database, atomic transactions, security rules as the source of truth
- **Firebase Auth** — email/password admin login gated by a custom claim
- **Tailwind CSS** — utility-first styling with a custom dark theme
- **Vitest** — unit tests for pure logic + emulator-based Firestore rules tests
- **GitHub Actions** — lint, unit tests, rules tests, and build on every push
- **Vercel** — zero-config deployment with SPA rewrites and security headers

## Architecture

```
src/
├── App.jsx                  # Route handling (home / /admin / 404) + lazy AdminPanel
├── main.jsx                 # React entry point (ErrorBoundary + ToastProvider)
├── firebase.js              # Firebase init — skips the SDK when env vars are missing
├── components/
│   ├── Hero.jsx             # Hero section with manager photo
│   ├── SignatureCounter.jsx # Animated count + progress bar + share buttons
│   ├── SignForm.jsx         # Signature form (transactional submit + validation)
│   ├── RecentSigners.jsx    # Live recent signers feed
│   ├── FanGallery.jsx       # Fan photo grid with fallback
│   ├── PetitionLetter.jsx   # Full petition text
│   ├── ProblemsSection.jsx  # Problems list
│   ├── ReasonsSection.jsx   # Reasons to sign
│   ├── MobileCTA.jsx        # Sticky mobile sign button
│   ├── AdminPanel.jsx       # Admin dashboard (lazy-loaded)
│   └── ErrorBoundary.jsx    # App-level crash screen
├── context/
│   ├── CountContext.jsx     # The single stats/count listener shared by all consumers
│   └── ToastContext.jsx     # Lightweight toast notifications
├── hooks/
│   └── useSigners.js        # Real-time recent signers
├── lib/
│   ├── theme.js             # Design tokens (colors, gradients, shadows, fonts)
│   ├── routes.js            # Client-side route normalization
│   ├── validation.js        # Email validation/normalization, storage keys
│   ├── csv.js               # CSV export with formula-injection guard
│   ├── time.js              # time-ago formatting
│   ├── milestone.js         # Goal + milestone math
│   └── display.js           # Name initial / display name helpers
scripts/
├── grant-admin.mjs          # Set the admin custom claim (Admin SDK)
├── migrate-signatures.mjs   # One-time PII split migration (dry-run/apply)
└── load-env.mjs             # Loads .env for the Admin SDK scripts
tests/
└── firestore-rules.test.js  # 33 security-rules tests against the emulator
```

## Getting started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase web-app config (Firebase Console → Project settings → Your apps)

# Start development server
npm run dev
```

Without `.env` the site still renders — it just can't read or write
signatures (the UI falls back to its error states instead of crashing).

### Environment variables

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

These are public identifiers (all shipped in the JS bundle by design) —
access control is enforced entirely by `firestore.rules`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the whole repo |
| `npm test` | 43 unit tests (pure logic in `src/lib/`) |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:rules` | 33 Firestore rules tests (starts the emulator; needs Java 11+) |
| `npm run admin:grant -- <email>` | Grant the `admin` custom claim to a user (`--revoke` to remove) |
| `npm run migrate:dry` | Dry-run the signature migration (prints a plan, writes nothing) |
| `npm run migrate:apply` | Run the migration (backs up to `backup/*.json` first) |

CI (`.github/workflows/ci.yml`) runs lint → unit tests → rules tests →
build on every push and pull request.

## Admin access

The `/admin` panel authenticates with **Firebase Auth** (email + password) and
additionally requires an `admin` custom claim — no password is ever shipped
in the JS bundle:

1. Firebase Console → *Authentication* → *Sign-in method* → enable **Email/Password**
2. Firebase Console → *Authentication* → *Users* → add the admin user
3. `export GOOGLE_APPLICATION_CREDENTIALS=~/path/to/serviceAccount.json`
   (Console → Project settings → Service accounts → generate a key)
4. `npm run admin:grant -- admin@example.com`
5. Open `/admin` and sign in (use **ድጋሚ ፈትሽ** if the claim was granted while you were signed in)

## Firestore structure

```
signatures/            — Public feed, display-only (no PII beyond an initial)
  ├── nameInitial: string     // first letter of the signer's name
  ├── city: string | null
  ├── comment: string | null
  └── createdAt: timestamp

signatures_private/     — Identity data, readable only with the admin claim
  ├── name: string
  ├── email: string
  ├── city: string | null
  ├── comment: string | null
  └── createdAt: timestamp    // doc id matches signatures/{id}

signed_emails/          — Email lock for duplicate prevention
  └── [email] → { createdAt: timestamp }

stats/
  └── count → { total: number }   — Atomic counter (+1 per signature)
```

## Firestore security rules

The rules live in [`firestore.rules`](./firestore.rules) — that file is the
single source of truth, and it is covered by 33 automated tests
(`tests/firestore-rules.test.js`) that run against the emulator in CI.
Deploy with `firebase deploy --only firestore:rules`.

In short:

- **Public feed** (`signatures`) only ever stores a first-letter initial, city,
  and comment — full names and emails live in `signatures_private`, which only
  an authenticated admin (custom claim) can read
- **Anyone** can submit a signature (validated name, email, timestamp) — nobody,
  not even an admin, can edit or delete a recorded signature
- **Email lock** docs are write-once; `get` is allowed for the duplicate check
  but `list` never is (prevents enumeration)
- **Counter** increments are constrained to exactly `+1` per client write;
  arbitrary values (the admin recount) require the admin claim — so the atomic
  counter works without Cloud Functions or a Blaze plan
- Anything not explicitly matched is **denied**

### Rollout order (existing data)

When deploying the current code to a project that still holds pre-split
signatures:

```bash
git push origin main                        # 1. site goes out first (Vercel auto-deploy)
firebase deploy --only firestore:rules      # 2. rules enforce the public/private split
npm run migrate:dry                         # 3. inspect the plan
npm run migrate:apply                       # 4. split PII into signatures_private (backs up to backup/)
npm run admin:grant -- you@example.com      # 5. re-grant the admin claim if needed
```

## Security headers

`vercel.json` sets CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options`,
`Referrer-Policy`, and `Permissions-Policy` for every route. The CSP was
verified against the live Firestore WebChannel handshake with headless
Chrome (zero violations).

## Deployment

Push to `main` and Vercel auto-deploys. The `vercel.json` rewrites all routes
to `index.html` for SPA client-side routing, and route normalization handles
trailing slashes and duplicate slashes client-side.

## Manual steps

See [MANUAL_STEPS.md](./MANUAL_STEPS.md) for the one-time OG image
rasterization needed for social link previews.

---

Built for Fasil Kenema FC supporters. 🇦🇹 · [MIT License](./LICENSE)

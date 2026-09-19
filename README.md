# ፋሲል ከነማ እግርኳስ ክለብ — ፔቲሽን

A real-time Amharic-language petition platform calling for the resignation of
Fasil Kenema FC chairman. Built as a full-stack portfolio piece demonstrating
real-time data, offline-first UX, and production deployment.

**Live:** [fasil-petition.vercel.app](https://fasil-petition.vercel.app)

---

## What it does

Supporters sign a petition with their name, email, and optional comment.
Signatures are stored in Firebase Firestore with:
- **Atomic counter** — no race conditions on the live tally
- **Duplicate prevention** — email-locked via a separate Firestore collection + localStorage cache
- **Real-time updates** — the signature count, progress bar, and recent signers feed all update live via `onSnapshot`

An admin panel (`/admin`) provides search, CSV export, and a recount tool that
fixes the counter against the actual document count.

## Key features

| Feature | Details |
|---|---|
| Real-time counter | Animated count-up with `requestAnimationFrame`, live Firebase listener |
| Milestone progress bar | Visual progress toward 20,000 signature goal with milestone markers |
| Recent signers feed | Live feed with time-ago labels, auto-refreshes every 30s |
| Share to Telegram + TikTok | Deep-link share buttons with pre-filled Amharic text |
| Mobile sticky CTA | Bottom bar that scrolls users to the sign form |
| Admin dashboard | Password-protected panel with search, CSV export, recount fix |
| SEO & social sharing | Open Graph + Twitter Card meta tags for clean link previews |
| Dark UI | Custom dark theme with Noto Sans Ethiopic throughout |

## Tech stack

- **React 18** + **Vite 5** — fast HMR, optimized production builds
- **Firebase Firestore** — real-time database with atomic increments
- **Tailwind CSS** — utility-first styling with custom dark theme
- **Vercel** — zero-config deployment with SPA rewrites

## Architecture

```
src/
├── App.jsx                 # Route handling (main page vs /admin)
├── main.jsx                # React entry point
├── firebase.js             # Firebase client config
├── components/
│   ├── Hero.jsx            # Hero section with manager photo
│   ├── SignatureCounter.jsx# Animated count + progress bar
│   ├── SignForm.jsx        # Signature form with validation
│   ├── RecentSigners.jsx   # Live recent signers feed
│   ├── FanGallery.jsx      # Fan photo grid with fallback
│   ├── PetitionLetter.jsx  # Full petition text
│   ├── ProblemsSection.jsx # Problems list
│   ├── ReasonsSection.jsx  # Reasons to sign
│   ├── MobileCTA.jsx       # Sticky mobile sign button
│   └── AdminPanel.jsx      # Admin dashboard
├── hooks/
│   ├── useCount.js         # Real-time signature count
│   └── useSigners.js       # Real-time recent signers
```

## Getting started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase config and admin password

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_ADMIN_PASSWORD` | Admin panel password |

## Firestore structure

```
signatures/          — Each document is one signature
  ├── name: string
  ├── email: string
  ├── city: string | null
  ├── comment: string | null
  └── createdAt: timestamp

signed_emails/       — Email lock for duplicate prevention
  └── [email] → { createdAt: timestamp }

stats/
  └── count → { total: number }   — Atomic counter
```

## Firestore security rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Signatures — anyone can create, nobody can edit/delete
    match /signatures/{sig} {
      allow create: if request.resource.data.keys().hasAll(['name', 'email', 'createdAt'])
                    && request.resource.data.name is string
                    && request.resource.data.email is string;
      allow read:   if true;   // public feed + admin reads
      allow update, delete: if false;
    }

    // Email lock — write-once, no reads from client
    match /signed_emails/{email} {
      allow create: if request.resource.data.keys().hasAll(['createdAt']);
      allow read, update, delete: if false;
    }

    // Stats counter — only via admin SDK (Cloud Functions)
    match /stats/{doc} {
      allow read:   if true;
      allow write:  if false;  // incremented server-side only
    }
  }
}
```

These rules mean:
- **Anyone** can submit a signature (name + email + timestamp required)
- **Nobody** can edit or delete signatures from the client
- **Email lock** documents are write-once — the client can't read them back to check duplicates (prevents enumeration)
- **Stats counter** can only be read by clients — all writes happen via Firebase Admin SDK in Cloud Functions or the admin recount tool

## Deployment

Push to `main` and Vercel auto-deploys. The `vercel.json` rewrites all routes
to `index.html` for SPA client-side routing.

---

Built for Fasil Kenema FC supporters. 🇦🇹

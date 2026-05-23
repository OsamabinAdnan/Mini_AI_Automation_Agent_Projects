# Personal AI CRM

A minimal personal CRM with a dark cyberpunk UI, built with **Next.js (App Router)** on the frontend and **InsForge** as the backend (Auth + Postgres + Edge Functions).

It lets you manage contacts, log interactions, and generate AI summaries + next actions via an InsForge edge function.

## Live App
- Frontend URL: **https://ai-personal-crm.insforge.site/**

> Note: The backend base URL and anon key are configured via environment variables (see below). Do **not** commit credentials.

## Features
- Email/password authentication (with optional email verification)
- OAuth buttons (Google/GitHub) using InsForge OAuth
- Contacts
  - Create contacts with: name, email, company, phone, role, notes, tags
  - Duplicate prevention by **email** (if email provided)
  - Delete contacts from Dashboard (with confirmation)
- Interactions per contact
  - Add interaction type: note/email/call/meeting
- AI summary generation
  - "Generate AI summary" invokes an InsForge edge function and stores the latest summary
- Responsive UI optimized for mobile/tablet/desktop
- Cyberpunk theme + reusable UI components (Navbar, Footer, Hero, Features)

## Tech Stack
- Frontend: Next.js 15 (App Router), React, Tailwind CSS
- Backend: InsForge (Auth, Database, Edge Functions)
- AI: OpenRouter (via edge function env var)
- Icons: lucide-react

## Project Structure
- `frontend/` — Next.js app
- `insforge-functions/` — InsForge edge functions
  - `summarize-contact` — generates AI summaries + next actions

## Getting Started (Local)

### 1) Install dependencies
```bash
cd frontend
npm install
```

### 2) Environment variables
Create `frontend/.env.local` (do **not** commit it) with:
```bash
NEXT_PUBLIC_INSFORGE_BASE_URL=your-insforge-backend-base-url
NEXT_PUBLIC_INSFORGE_ANON_KEY=your-insforge-anon-key
```

> You can use `frontend/.env.local.example` as a template (it contains placeholders).

### 3) Run dev server
```bash
cd frontend
npm run dev
```

Then open:
- http://localhost:3000

## Edge Function Setup (AI)
The AI summary feature depends on the InsForge edge function environment variable:

- `OPENROUTER_API_KEY` — required by `summarize-contact` function

Set it in the InsForge function environment (recommended), not in the frontend.

## Usage (Golden Path)
1. Open the app → Sign up / Login
2. Go to Dashboard
3. Add a contact (optional: tags as comma-separated)
4. Open a contact
5. Add some interactions
6. Click **Generate AI summary**

## Scripts
From `frontend/`:
- `npm run dev` — start dev server
- `npm run build` — build
- `npm run start` — run production server

## Security Notes
- Do not commit `.env.local`.
- `NEXT_PUBLIC_*` values are exposed to the browser by design.
- Keep private API keys (e.g. `OPENROUTER_API_KEY`) only in server/edge-function environments.

## Deployment
This project can be deployed via InsForge frontend deployments.

Current deployment:
- https://ai-personal-crm.insforge.site/

## License
MIT (or your preferred license)

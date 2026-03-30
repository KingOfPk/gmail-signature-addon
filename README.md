# Gmail Signature Add-on (Next.js)

A Gmail Add-on that lets users insert HTML email signatures directly from the compose window. Built with Next.js and the Google Workspace Add-ons REST API.

## Features
- Insert signatures at the bottom of any email from compose window
- Manage multiple signatures (create, edit, delete, set default)
- Live HTML preview in the management dashboard
- Quick templates (Professional, Minimal, With Photo)
- Google JWT auth verification for security

## Setup
1. Clone this repo
2. Copy `.env.example` to `.env.local` and fill in values
3. Run `npm install && npm run dev`
4. Deploy to Vercel and register as Gmail Add-on

See full deployment guide in the original README.

## Tech Stack
- **Next.js 14** — Frontend + API routes
- **Tailwind CSS** — Management dashboard UI
- **google-auth-library** — Verify Google JWT tokens
- **fs-extra** — File-based signature storage

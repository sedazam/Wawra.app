# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the **Wawra** audio content platform — a modern web app for discovering and listening to talks, stories, reflections, and podcast-style episodes.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui (artifacts/wawra)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM (lib/db)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec in lib/api-spec)
- **Build**: esbuild (CJS bundle for server)
- **File uploads**: busboy (multipart/form-data)

## Wawra — Audio Platform

### Features
- Public homepage with hero, featured audio, latest uploads, category nav
- Browse page with search and category filtering
- Audio detail page with HTML5 audio player
- Category pages (all audios by category)
- Admin login (password: `wawra-admin-2024`) + protected dashboard
- Admin upload form (audio + cover image + metadata)
- Category management (CRUD)

### Admin Access
- URL: `/admin/login`
- Default password: `wawra-admin-2024` (set `ADMIN_PASSWORD` env var to change)

### Database Schema
- `categories` — id, name, slug (unique), description, color, timestamps
- `audios` — id, title, slug (unique), description, audio_url, cover_image_url, duration (seconds), category_id (FK), published, featured, publish_date, timestamps

### Storage
Files are uploaded to the local `uploads/` directory on the API server:
- `uploads/audio/` — audio files
- `uploads/images/` — cover images
- Served publicly at `/api/static/audio/*` and `/api/static/images/*`

### API Routes (all under /api)
- `GET /categories` — list all (with audio count)
- `POST/PATCH/DELETE /categories/:id` — admin CRUD
- `GET /categories/slug/:slug` — by slug
- `GET /audios` — list (search, filter, pagination)
- `GET /audios/featured` — featured + published
- `GET /audios/latest` — most recent published
- `GET /audios/stats` — platform stats for admin
- `GET /audios/slug/:slug` — by slug (public detail page)
- `POST/PATCH/DELETE /audios/:id` — admin CRUD
- `POST /upload/audio` — multipart audio file upload
- `POST /upload/image` — multipart image file upload
- `POST /admin/login` — session-based auth
- `GET /admin/me` — check auth status

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/wawra run dev` — run frontend locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

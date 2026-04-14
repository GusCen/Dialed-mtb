# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## General Instructions

- **ALWAYS_CREATE_BRANCH**: Before making any file edits, ask to create a new git branch named `ai/task-description` unless already on a feature branch.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

There is no test framework configured in this project.

## Architecture

**Dialed** is a Next.js 16 App Router application — an AI-powered mountain bike suspension calculator. Deployed on Vercel.

### Key Directories

- `src/app/` — Next.js App Router pages and layouts. `page.tsx` is the main application shell; `layout.tsx` wraps the app in `AuthProvider`.
- `src/components/` — All UI components (`SuspensionForm`, `ResultsView`, `SavedSetupsList`, `LoginModal`, `FeedbackModal`, `AddToHomeScreen`). All components use `'use client'`.
- `src/services/geminiService.ts` — Google Gemini AI integration for analyzing suspension component images via `@google/genai`.
- `src/contexts/AuthContext.tsx` — Auth state via React Context, persisted to `localStorage` under key `mtb-user`.
- `src/constants.ts` — Large (~510 lines) static databases: `suspensionDatabase` (fork/shock specs with adjustment ranges), `bikeDatabase`, and `eBikeDatabase`.
- `src/utils.ts` — Core `calculateSettings()` function that computes suspension tuning recommendations.
- `src/types.ts` — All shared TypeScript interfaces.

### State & Persistence

All persistence is via `localStorage` (no external database for user data):
- `mtb-theme` — Light/dark theme preference
- `mtb-preferences` — User calculation preferences
- `mtb-saved-setups` — Saved suspension configurations
- `mtb-user` — Auth user data

### Path Aliases

`@/*` maps to `src/*` (configured in `tsconfig.json`).

### Tech Stack

Next.js 16 + React 19, TypeScript 5 (strict mode), Tailwind CSS 4, ESLint 9 (flat config), Google Gemini AI (`@google/genai`), Lucide React icons.

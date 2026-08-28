# MWU Backend (Node + TypeScript + Express + SQLite)

This folder contains a lightweight Node.js backend scaffold intended to run locally with SQLite.

Important:
- Dependencies are installed with `npm install` inside `backend`.
- The backend mirrors the Python FastAPI architecture (modules: repository/service/controller/routes) but implemented in TypeScript.
- `category_types` is an internal SQLite table seeded automatically at startup. It has no CRUD module or public route.

Quick start (after `npm install`):

```bash
cd backend
npm run dev
```

DB file: `backend/data/mwu.db` (created automatically by SQLite when the server runs).

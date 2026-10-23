# MWU — Money With U

MWU is a personal finance application with a React and TypeScript frontend and a local Express and TypeScript API. The backend stores application data in SQLite.

> **Electron status:** Electron's main process, desktop shell, and packaging configuration are not included yet. The frontend currently runs in a browser through Vite and connects to the local backend. Update this documentation when Electron integration is added.

## Requirements

- Node.js 18 or newer and npm
- Windows, macOS, or Linux

## Project structure

```text
backend/   Express API, TypeORM services, and SQLite database
frontend/  React, TypeScript, and Vite user interface
```

The frontend and backend are separate npm projects, each with its own `package.json` and `node_modules` directory. Install dependencies in both folders:

```bash
cd backend
npm install
cd ../frontend
npm install
```

## Configure the frontend

Create `frontend/.env` and set the local API URL:

```env
VITE_MWU_API_ENDPOINT=http://localhost:4000/api
```

Vite reads this variable at startup. Restart the frontend dev server after changing the file.

## Run in development

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

By default, the API listens at `http://localhost:4000`. Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Vite prints the local URL, usually `http://localhost:5173`.

## Build, test, and run

Run the backend unit tests and build:

```bash
cd backend
npm test
```

`npm test` builds the backend and runs unit tests for transaction recurrence rules. To build or start the backend separately:

```bash
npm run build
npm start
```

The backend build is written to `backend/dist`. Build the frontend with:

```bash
cd frontend
npm run build
```

To preview the frontend production build locally, run `npm run preview` inside `frontend`.

## Database

The backend creates the SQLite database at `backend/data/mwu.db` on startup. Set `DB_PATH` in the backend process environment to use a different file. For example, in PowerShell:

```powershell
$env:DB_PATH = "C:\path\to\mwu.db"
npm run dev
```

The following category types are seeded automatically: Investments, Transferencia, Income, and Expense.

## Features

- Common-user registration and login
- Accounts, categories, transactions, and financial goals
- Default category types seeded on backend startup
- Weekly, monthly, and yearly recurring transactions, including historical backfill
- Recurring due dates processed on startup and while the backend is running
- Dashboard charts for current-year transaction totals by category type and financial-goal progress

The API associates user data through the `x-user-id` request header. Financial-goal progress currently uses the sum of the user's account balances because goals are not linked to individual accounts in the current data model.

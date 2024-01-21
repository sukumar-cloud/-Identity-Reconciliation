# Bitespeed Identity — Frontend

A full-stack admin dashboard + customer-facing UI for the Bitespeed Identity Reconciliation service.

## Pages

| Page | Description |
|---|---|
| **Dashboard** | Stats overview, recent activity, reconciliation rules |
| **Identify** | Customer form + API tester for `/identify` endpoint |
| **Contacts** | Searchable/filterable registry of all contacts with cluster expansion |
| **Activity** | Audit log timeline of all identity events |
| **Settings** | API URL configuration and endpoint reference |

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Set VITE_API_URL to your backend URL

# Start dev server (proxies /api → backend)
npm run dev

# Build for production
npm run build
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (default: `http://localhost:3000`) |

## Connecting to the Backend

The Vite dev server proxies `/api/*` to `http://localhost:3000` automatically. In production, set `VITE_API_URL` to your deployed backend URL (e.g. `https://bitespeed-identity.onrender.com`).

> **Note:** The Contacts and Activity pages currently use mock data. To connect them to live data, implement `GET /contacts` and `GET /contacts/search` endpoints in the backend and update `src/api/index.ts`.

# Bitespeed Identity Reconciliation

A web service that identifies and links customer contacts across multiple purchases, even when different emails and phone numbers are used.

## Live Endpoint

> `POST https://<your-render-url>/identify`

---

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Database:** PostgreSQL
- **Hosting:** Render.com

---

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/bitespeed-identity.git
cd bitespeed-identity

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# 4. Run migrations
npm run build && npm run migrate

# 5. Start dev server
npm run dev
```

---

## API Reference

### `POST /identify`

Identifies and consolidates a customer's contact information.

**Request Body** (JSON):
```json
{
  "email": "string (optional)",
  "phoneNumber": "string (optional)"
}
```
> At least one of `email` or `phoneNumber` must be provided.

**Response** `200 OK`:
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["primary@example.com", "secondary@example.com"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

---

## Reconciliation Logic

| Scenario | Behaviour |
|---|---|
| No existing contacts match | Create a new **primary** contact |
| Match found, no new info | Return consolidated contact as-is |
| Match found, new email/phone | Create a **secondary** contact linked to the primary |
| Two separate primaries are linked | Older primary wins; newer primary is demoted to secondary |

---

## Deploy to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New** → **Blueprint**
3. Connect your GitHub repo — Render auto-detects `render.yaml`
4. Click **Apply** — it provisions a free PostgreSQL DB + web service automatically

---

## Project Structure

```
src/
├── index.ts                  # Express app entry point
├── db/
│   ├── pool.ts               # PostgreSQL connection pool
│   └── migrate.ts            # Table creation migration
├── models/
│   └── contact.ts            # TypeScript interfaces
├── routes/
│   └── identify.ts           # POST /identify controller
└── services/
    └── identityService.ts    # Core reconciliation logic
```
